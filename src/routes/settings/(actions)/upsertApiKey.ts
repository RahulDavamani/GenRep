import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { RequestEvent } from '../$types';

export const upsertApiKeySchema = z.object({
	id: z.string().min(1).optional(),
	name: z.string().min(1)
});
export type UpsertApiKey = z.infer<typeof upsertApiKeySchema>;

export const upsertApiKey = async (event: RequestEvent) => {
	const session = event.locals.session;
	if (!session) throw redirect(302, '/login');

	const form = await superValidate(event, upsertApiKeySchema);
	const {
		valid,
		data: { id, name }
	} = form;
	if (!valid) return fail(400, { upsertApiKey: { ...form } });

	const newApiKey = await prisma.aPIKey.upsert({
		where: { id: id ?? '' },
		create: {
			name,
			userId: session.user_id
		},
		update: { name },
		select: { id: true, name: true }
	});

	form.message = { newApiKey };
	return { upsertApiKey: { ...form } };
};
