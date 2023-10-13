import { z } from 'zod';
import { authProcedure, router } from '../trpc';

export const themeRouter = router({
	update: authProcedure
		.input(z.object({ theme: z.string().min(1) }))
		.query(async ({ ctx: { session }, input: { theme } }) => {
			await prisma.user.update({
				where: { id: session.user_id },
				data: { theme }
			});
			return { theme };
		})
});
