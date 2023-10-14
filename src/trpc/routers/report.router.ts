import { z } from 'zod';
import { authProcedure, router } from '../trpc';
import prismaErrorHandler from '../../prisma/prismaErrorHandler';

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
					where: { id, userId: session.user_id }
				})
				.catch(prismaErrorHandler);
			return { report };
		})
});
