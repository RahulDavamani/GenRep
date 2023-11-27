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
		.input(z.object({ id: z.string().min(1), apiKey: z.string().min(1) }))
		.query(async ({ input: { id, apiKey } }) => {
			await prisma.aPIKey.findUniqueOrThrow({ where: { id: apiKey } }).catch(prismaErrorHandler);
			const report = await prisma.report
				.findUniqueOrThrow({
					where: { id },
					include: {
						datasets: { include: { queryParams: true } },
						...componentIncludes
					}
				})
				.catch(prismaErrorHandler);
			return { report };
		})
});
