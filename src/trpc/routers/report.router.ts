import { z } from 'zod';
import { authProcedure, procedure, router } from '../trpc';
import prismaErrorHandler from '../../prisma/prismaErrorHandler';
import { upsertReportSchema, type UpsertProperties } from '$lib/reportSchema';
import {
	componentTypesList,
	type ComponentType,
	type ComponentKey,
	type UpsertComponent,
	type ServerFn
} from '../../lib/data/componentTypes';

type ComponentIncludes = {
	[K in ComponentType<ComponentKey>['labels']['keyComponents']]: { include: { properties: boolean } };
};

const componentIncludes = Object.fromEntries(
	componentTypesList.map((ct) => [ct.labels.keyComponents, { include: { properties: true } }])
) as ComponentIncludes;

export const deleteComponents = async (
	reportId: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	prismaTable: any,
	components: UpsertComponent<ComponentKey>[]
) => {
	const existingComponents = (await prismaTable.findMany({
		where: { reportId },
		select: { id: true }
	})) as { id: string }[];

	const deleteComponents = existingComponents.filter((ec) => !components.find((c) => ec.id === c.id)).map((d) => d.id);
	await prismaTable.deleteMany({ where: { id: { in: deleteComponents } } });
};

export const upsertComponents = async (
	reportId: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	prismaTable: any,
	components: UpsertComponent<ComponentKey>[]
) => {
	for (const { id, properties, ...values } of components) {
		const propertiesId = await upsertProperties(properties);
		await prismaTable.upsert({
			where: { id },
			create: {
				reportId,
				propertiesId,
				...values
			},
			update: { ...values }
		});
	}
};

export const upsertProperties = async (properties: UpsertProperties) => {
	const { id, x, y, width, height, bgColor, textColor, shadow, rounded, border, outline } = properties;
	return (
		await prisma.componentProperties.upsert({
			where: { id },
			create: { x, y, width, height, bgColor, textColor, shadow, rounded, border, outline },
			update: { x, y, width, height, bgColor, textColor, shadow, rounded, border, outline },
			select: { id: true }
		})
	).id;
};

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
				inputComponents,
				cardComponents,
				tableComponents
			}
		}) => {
			const allComponents: {
				[K in ComponentType<ComponentKey>['labels']['keyComponents']]: UpsertComponent<ComponentKey>[];
			} = { inputComponents, cardComponents, tableComponents };

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
				if (deleteFn) await (deleteFn as ServerFn<typeof key>)(allComponents[keyComponents]);
				else await deleteComponents(reportId, prisma[keyComponent], allComponents[keyComponents]);

				if (upsertFn) await (upsertFn as ServerFn<typeof key>)(allComponents[keyComponents]);
				else await upsertComponents(reportId, prisma[keyComponent], allComponents[keyComponents]);
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
