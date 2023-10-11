import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { RequestEvent } from '../$types';

export const updateThemeSchema = z.object({
	theme: z.string().min(1)
});
export type UpdateTheme = z.infer<typeof updateThemeSchema>;

export const updateTheme = async (event: RequestEvent) => {
	const session = event.locals.session;
	if (!session) throw redirect(302, '/login');

	const form = await superValidate(event, updateThemeSchema);
	const {
		valid,
		data: { theme }
	} = form;
	if (!valid) return fail(400, { updateTheme: { ...form } });

	await prisma.user.update({
		where: { id: session.user_id },
		data: { theme }
	});

	form.message = { theme };
	return { updateTheme: { ...form } };
};
