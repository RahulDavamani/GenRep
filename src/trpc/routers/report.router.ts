import { z } from 'zod';
import { authProcedure, procedure, router } from '../trpc';
import prismaErrorHandler from '../../prisma/prismaErrorHandler';
import { upsertReportSchema } from '$lib/reportSchema';
import {
	componentIncludes,
	componentTypesList,
	prismaDeleteComponents,
	prismaUpsertComponents,
	type ServerFn
} from '../../lib/data/componentTypes';
import { TRPCError } from '@trpc/server';
import { getErrorCode } from '$lib/data/errorCodes';

export const reportRouter = router({
	getAll: authProcedure.query(async ({ ctx: { session } }) => {
		const reports = await prisma.report.findMany({
			where: { userId: session.user_id },
			include: { _count: true }
		});
		return { reports };
	}),

	getById: authProcedure
		.input(z.object({ id: z.string().min(1) }))
		.query(async ({ ctx: { session }, input: { id } }) => {
			const apiKey = (await prisma.aPIKey.findFirst({ select: { id: true } }))?.id;
			const report = await prisma.report
				.findUniqueOrThrow({
					where: { id, userId: session.user_id },
					include: {
						datasets: { include: { queryParams: true } },
						...componentIncludes
					}
				})
				.catch(prismaErrorHandler);
			return { apiKey, report };
		}),

	save: authProcedure.input(upsertReportSchema).query(
		async ({
			ctx: { session },
			input: {
				id,
				datasets,

				name,
				description,
				canvasHeight,
				theme,
				...allComponents
			}
		}) => {
			// Report
			const reportId = (
				await prisma.report.upsert({
					where: { id },
					create: { userId: session.user_id, name, description, canvasHeight, theme },
					update: { name, description, canvasHeight, theme },
					select: { id: true }
				})
			).id;

			// Datasets
			const existingDatasets = await prisma.dataset.findMany({
				where: { reportId },
				select: { id: true }
			});
			const deleteDatasetsId = existingDatasets.filter((ed) => !datasets.find((d) => ed.id === d.id)).map((d) => d.id);

			await prisma.dataset.deleteMany({ where: { id: { in: deleteDatasetsId } } });
			for (const { id, queryParams, ...values } of datasets) {
				const datasetId = (
					await prisma.dataset.upsert({
						where: { id },
						create: { reportId, ...values },
						update: { ...values },
						select: { id: true }
					})
				).id;

				const existingQueryParams = await prisma.queryParam.findMany({
					where: { datasetId },
					select: { id: true }
				});
				const deleteQueryParams = existingQueryParams
					.filter((ecc) => !queryParams.find((cc) => ecc.id === cc.id))
					.map((d) => d.id);

				await prisma.queryParam.deleteMany({ where: { id: { in: deleteQueryParams } } });
				for (const { id, ...values } of queryParams) {
					await prisma.queryParam.upsert({
						where: { id },
						create: { datasetId, ...values },
						update: { ...values }
					});
				}
			}

			for (const {
				labels: { key, keyComponent, keyComponents },
				server: { deleteFn, upsertFn }
			} of componentTypesList) {
				if (deleteFn) await (deleteFn as ServerFn<typeof key>)(reportId, session.user_id, allComponents[keyComponents]);
				else await prismaDeleteComponents(reportId, prisma[keyComponent], allComponents[keyComponents]);

				if (upsertFn) await (upsertFn as ServerFn<typeof key>)(reportId, session.user_id, allComponents[keyComponents]);
				else await prismaUpsertComponents(reportId, prisma[keyComponent], allComponents[keyComponents]);
			}

			return { reportId };
		}
	),

	getReportView: procedure
		.input(z.object({ id: z.string().min(1), token: z.string().min(1) }))
		.query(async ({ input: { id, token } }) => {
			const report = await prisma.report
				.findUniqueOrThrow({
					where: { id },
					include: {
						datasets: { include: { queryParams: true } },
						...componentIncludes
					}
				})
				.catch(prismaErrorHandler);

			const { validateTokenUrl } = await prisma.user
				.findUniqueOrThrow({
					where: { id: report.userId },
					select: { validateTokenUrl: true }
				})
				.catch(prismaErrorHandler);

			const res = await fetch(validateTokenUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					AccessKey: '52CB3A03-1F50-41E5-9A24-BD8843B4403A',
					Token: token
				})
			});
			const { Message, ...queryParams } = (await res.json()) as { Message: string; [k: string]: unknown };

			if (res.status !== 200)
				throw new TRPCError({
					code: getErrorCode({ http: res.status }).trpc,
					message: Message
				});

			report.datasets.forEach((d, di) =>
				d.queryParams.forEach((q, qi) => {
					const i = Object.keys(queryParams).findIndex((k) => k === q.key);
					if (i > 1) report.datasets[di].queryParams[qi].value = String(Object.values(queryParams)[i]);
				})
			);
			return { report };
		})
});
