import { error } from '@sveltejs/kit';
import { createCaller } from '../../trpc/routers/app.router.js';
import { trpcServerErrorHandler } from '../../trpc/trpcErrorhandler.js';

export const load = async (event) => {
	const id = event.url.searchParams.get('id');
	const token = event.url.searchParams.get('token');

	if (!id || !token) throw error(400, 'Bad Request');

	const trpc = await createCaller(event);

	const { report } = await trpc.report.getReportView({ id, token }).catch(trpcServerErrorHandler);

	return { report };
};
