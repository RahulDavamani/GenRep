import { auth } from '$lib/server/lucia.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ locals }) => {
		if (locals.session) await auth.invalidateSession(locals.session.sessionId);
		locals.auth.setSession(null);
		throw redirect(302, '/login');
	}
};
