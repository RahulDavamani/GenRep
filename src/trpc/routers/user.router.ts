import { z } from 'zod';
import { authProcedure, router } from '../trpc';

export const userRouter = router({
	updateTheme: authProcedure
		.input(z.object({ theme: z.string().min(1) }))
		.query(async ({ ctx: { session }, input: { theme } }) => {
			await prisma.user.update({
				where: { id: session.user_id },
				data: { theme }
			});
			return { theme };
		}),

	getValidateTokenURL: authProcedure.query(async ({ ctx: { session } }) => {
		const { validateTokenUrl } = await prisma.user.findUniqueOrThrow({
			where: { id: session.user_id },
			select: { validateTokenUrl: true }
		});
		return { validateTokenUrl };
	}),

	updateValidateTokenURL: authProcedure
		.input(z.object({ validateTokenUrl: z.string().min(1) }))
		.query(async ({ ctx: { session }, input: { validateTokenUrl } }) => {
			await prisma.user.update({
				where: { id: session.user_id },
				data: { validateTokenUrl }
			});
			return { validateTokenUrl };
		})
});
