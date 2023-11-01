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
					include: {
						datasets: { include: { queryParams: true } },
						cardComponents: { include: { properties: true } },
						tableComponents: { include: { properties: true } }
					}
				})
				.catch(prismaErrorHandler);
			return { report };
		}),

	save: authProcedure
		.input(upsertReportSchema)
		.query(
			async ({
				ctx: { session },
				input: { id, name, description, theme, canvasHeight, datasets, cardComponents, tableComponents }
			}) => {
				// Report
				const report = await prisma.report.upsert({
					where: { id },
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
					where: { reportId: report.id },
					select: { id: true }
				});
				const deleteDatasetsId = existingDatasets
					.filter((ed) => !datasets.find((d) => ed.id === d.id))
					.map((d) => d.id);

				await prisma.dataset.deleteMany({ where: { id: { in: deleteDatasetsId } } });
				for (const { id, databaseId, name, query, queryParams } of datasets) {
					const dataset = await prisma.dataset.upsert({
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

					const existingQueryParams = await prisma.queryParam.findMany({
						where: { datasetId: dataset.id },
						select: { id: true }
					});
					const deleteQueryParams = existingQueryParams
						.filter((ecc) => !queryParams.find((cc) => ecc.id === cc.id))
						.map((d) => d.id);

					await prisma.queryParam.deleteMany({ where: { id: { in: deleteQueryParams } } });
					for (const { id, key, value } of queryParams) {
						await prisma.queryParam.upsert({
							where: { id },
							create: { datasetId: dataset.id, key, value },
							update: { key, value }
						});
					}
				}

				// Card Components
				const existingCardComponents = await prisma.cardComponent.findMany({
					where: { reportId: report.id },
					select: { id: true }
				});
				const deleteCardComponents = existingCardComponents
					.filter((ec) => !cardComponents.find((c) => ec.id === c.id))
					.map((d) => d.id);

				await prisma.cardComponent.deleteMany({ where: { id: { in: deleteCardComponents } } });
				for (const {
					id,
					datasetId,
					name,
					title,
					column,
					rowNumber,
					properties: { id: propertiesId, x, y, width, height, bgColor, textColor, shadow, rounded, border, outline }
				} of cardComponents) {
					const componentProperties = await prisma.componentProperties.upsert({
						where: { id: propertiesId },
						create: { x, y, width, height, bgColor, textColor, shadow, rounded, border, outline },
						update: { x, y, width, height, bgColor, textColor, shadow, rounded, border, outline }
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

				// Table Components
				const existingTableComponents = await prisma.tableComponent.findMany({
					where: { reportId: report.id },
					select: { id: true }
				});
				const deleteTableComponents = existingTableComponents
					.filter((ec) => !tableComponents.find((c) => ec.id === c.id))
					.map((d) => d.id);

				await prisma.tableComponent.deleteMany({ where: { id: { in: deleteTableComponents } } });
				for (const {
					id,
					datasetId,
					name,
					title,
					columns,
					rows,
					properties: { id: propertiesId, x, y, width, height, bgColor, textColor, shadow, rounded, border, outline }
				} of tableComponents) {
					const componentProperties = await prisma.componentProperties.upsert({
						where: { id: propertiesId },
						create: { x, y, width, height, bgColor, textColor, shadow, rounded, border, outline },
						update: { x, y, width, height, bgColor, textColor, shadow, rounded, border, outline }
					});

					await prisma.tableComponent.upsert({
						where: { id },
						create: {
							reportId: report.id,
							datasetId,
							name,
							title,
							columns,
							rows,
							propertiesId: componentProperties.id
						},
						update: {
							datasetId,
							name,
							title,
							columns,
							rows
						}
					});
				}

				return { report };
			}
		)
});
