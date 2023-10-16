import { z } from 'zod';
import { authProcedure, router } from '../trpc';
import prismaErrorHandler from '../../prisma/prismaErrorHandler';

export const upsertReportSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1),
	description: z.string(),
	theme: z.string().min(1),
	datasets: z.array(
		z.object({
			id: z.string().optional(),
			databaseId: z.string().min(1).nullish(),
			name: z.string().min(1),
			query: z.string().min(1)
		})
	)
});
export type UpsertReport = z.infer<typeof upsertReportSchema>;
export type UpsertDataset = UpsertReport['datasets'][number];

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
					include: { datasets: true }
				})
				.catch(prismaErrorHandler);
			return { report };
		}),

	save: authProcedure
		.input(upsertReportSchema)
		.query(async ({ ctx: { session }, input: { id, name, description, theme, datasets } }) => {
			const existingDatasets = await prisma.dataset.findMany({
				where: { reportId: id ?? '' },
				select: { id: true }
			});
			const deleteDatasets = existingDatasets.filter((ed) => !datasets.find((d) => ed.id === d.id));

			const report = await prisma.report.upsert({
				where: { id: id ?? '' },
				create: {
					userId: session.user_id,
					name,
					description,
					theme,
					datasets: {
						create: datasets.map(({ databaseId, name, query }) => ({
							databaseId,
							name,
							query
						}))
					}
				},
				update: {
					name,
					description,
					theme,
					datasets: {
						upsert: datasets.map(({ id, databaseId, name, query }) => ({
							where: { id: id ?? '' },
							create: {
								databaseId,
								name,
								query
							},
							update: {
								databaseId,
								name,
								query
							}
						})),
						deleteMany: deleteDatasets.map(({ id }) => ({ id }))
					}
				}
			});
			return { report };
		})
});
