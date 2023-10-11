import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { RequestEvent } from '../$types';

export const deleteApiKeySchema = z.object({
	id: z.string().min(1)
});
export type DeleteApiKey = z.infer<typeof deleteApiKeySchema>;

export const deleteApiKey = async (event: RequestEvent) => {
	const session = event.locals.session;
	if (!session) throw redirect(302, '/login');

	const form = await superValidate(event, deleteApiKeySchema);
	const {
		valid,
		data: { id }
	} = form;
	if (!valid) return fail(400, { deleteApiKey: { ...form } });

	await prisma.aPIKey.delete({ where: { id } });
	form.message = { id };

	return { deleteApiKey: { ...form } };
};
