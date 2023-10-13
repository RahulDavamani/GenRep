import { z } from 'zod';
import { authProcedure, router } from '../trpc';

export const upsertApiKeySchema = z.object({
	id: z.string().min(1).optional(),
	name: z.string().min(1)
});
export type UpsertApiKey = z.infer<typeof upsertApiKeySchema>;

export const apiKeyRouter = router({
	getAll: authProcedure.query(async ({ ctx: { session } }) => {
		const apiKeys = await prisma.aPIKey.findMany({
			where: { userId: session.user_id }
		});
		return { apiKeys };
	}),

	upsert: authProcedure.input(upsertApiKeySchema).query(async ({ ctx: { session }, input: { id, name } }) => {
		const apiKey = await prisma.aPIKey.upsert({
			where: { id: id ?? '' },
			create: {
				name,
				userId: session.user_id
			},
			update: { name }
		});
		return { apiKey };
	}),

	delete: authProcedure.input(z.object({ id: z.string().min(1) })).query(async ({ input: { id } }) => {
		await prisma.aPIKey.delete({ where: { id } });
		return { id };
	})
});
