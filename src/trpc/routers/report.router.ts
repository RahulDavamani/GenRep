import { z } from 'zod';
import { authProcedure, router } from '../trpc';
import prismaErrorHandler from '../../prisma/prismaErrorHandler';
import { upsertReportSchema, type UpsertProperties } from '$lib/reportSchema';
import { componentTypesList } from '../../lib/data/componentTypes';

interface Component {
	id: string;
	properties: UpsertProperties;
	[key: string]: unknown;
}

type ComponentIncludes = {
	[K in 'inputComponents' | 'cardComponents' | 'tableComponents']: {
		include: {
			properties: boolean;
		};
	};
};

const deleteComponents = async (
	reportId: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	prismaTable: any,
	components: Component[]
) => {
	const existingComponents = (await prismaTable.findMany({
		where: { reportId },
		select: { id: true }
	})) as { id: string }[];

	const deleteComponents = existingComponents.filter((ec) => !components.find((c) => ec.id === c.id)).map((d) => d.id);
	await prismaTable.deleteMany({ where: { id: { in: deleteComponents } } });
};

const upsertComponents = async (
	reportId: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	prismaTable: any,
	components: Component[]
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

const upsertProperties = async (properties: UpsertProperties) => {
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
			const componentIncludes = Object.fromEntries(
				componentTypesList.map((ct) => [ct.labels.componentsKey, { include: { properties: true } }])
			) as ComponentIncludes;

			const report = await prisma.report
				.findUniqueOrThrow({
					where: { id, userId: session.user_id },
					include: {
						datasets: { include: { queryParams: true } },
						...componentIncludes
					}
				})
				.catch(prismaErrorHandler);
			return { report };
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
				labels: { componentKey, componentsKey },
				server: { deleteFn, upsertFn }
			} of componentTypesList) {
				if (deleteFn) await deleteFn();
				else await deleteComponents(reportId, prisma[componentKey], allComponents[componentsKey]);

				if (upsertFn) await upsertFn();
				else await upsertComponents(reportId, prisma[componentKey], allComponents[componentsKey]);
			}

			return { reportId };
		}
	)
});
