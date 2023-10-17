import { z } from 'zod';
import { authProcedure, router } from '../trpc';
import prismaErrorHandler from '../../prisma/prismaErrorHandler';
import { upsertReportSchema } from '$lib/reportSchema';

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
			const report = await prisma.report
				.findUniqueOrThrow({
					where: { id, userId: session.user_id },
					include: { datasets: true, cardComponents: { include: { properties: true } } }
				})
				.catch(prismaErrorHandler);
			return { report };
		}),

	save: authProcedure
		.input(upsertReportSchema)
		.query(
			async ({ ctx: { session }, input: { id, name, description, theme, canvasHeight, datasets, cardComponents } }) => {
				// Report
				const report = await prisma.report.upsert({
					where: { id: id ?? '' },
					create: {
						userId: session.user_id,
						name,
						description,
						theme,
						canvasHeight
					},
					update: {
						name,
						description,
						theme,
						canvasHeight
					}
				});

				// Datasets
				const existingDatasets = await prisma.dataset.findMany({
					where: { reportId: id ?? '' },
					select: { id: true }
				});
				const deleteDatasetsId = existingDatasets
					.filter((ed) => !datasets.find((d) => ed.id === d.id))
					.map((d) => d.id);

				await prisma.dataset.deleteMany({ where: { id: { in: deleteDatasetsId } } });
				for (const { id, databaseId, name, query } of datasets) {
					await prisma.dataset.upsert({
						where: { id },
						create: {
							reportId: report.id,
							databaseId,
							name,
							query
						},
						update: {
							databaseId,
							name,
							query
						}
					});
				}

				// Card Components
				const existingCardComponents = await prisma.cardComponent.findMany({
					where: { reportId: id ?? '' },
					select: { id: true }
				});
				const deleteCardComponents = existingCardComponents
					.filter((ecc) => !cardComponents.find((cc) => ecc.id === cc.id))
					.map((d) => d.id);

				await prisma.cardComponent.deleteMany({ where: { id: { in: deleteCardComponents } } });
				for (const {
					id,
					datasetId,
					name,
					title,
					column,
					rowNumber,
					properties: { id: propertiesId, x, y, width, height }
				} of cardComponents) {
					const componentProperties = await prisma.componentProperties.upsert({
						where: { id: propertiesId },
						create: { x, y, width, height },
						update: { x, y, width, height }
					});

					await prisma.cardComponent.upsert({
						where: { id },
						create: {
							reportId: report.id,
							datasetId,
							name,
							title,
							column,
							rowNumber,
							propertiesId: componentProperties.id
						},
						update: {
							datasetId,
							name,
							title,
							column,
							rowNumber
						}
					});
				}

				return { report };
			}
		)
});
