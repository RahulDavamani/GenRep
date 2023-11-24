import { error } from '@sveltejs/kit';
import { createCaller } from '../../trpc/routers/app.router.js';
import { trpcServerErrorHandler } from '../../trpc/trpcErrorhandler.js';

export const load = async (event) => {
	const id = event.url.searchParams.get('id');
	const apiKey = event.url.searchParams.get('apiKey');

	if (!id || !apiKey) throw error(400, 'Bad Request');

	const trpc = await createCaller(event);

	const { report } = await trpc.report.getReportView({ id, apiKey }).catch(trpcServerErrorHandler);

	return { report };
};
