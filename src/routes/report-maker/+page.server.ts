import { createCaller } from '../../trpc/routers/app.router.js';
import { trpcServerErrorHandler } from '../../trpc/trpcErrorhandler.js';

export const load = async (event) => {
	const id = event.url.searchParams.get('id');

	const trpc = await createCaller(event);
	const { report } = id ? await trpc.report.getById({ id }).catch(trpcServerErrorHandler) : { report: undefined };
	const { databases } = await trpc.database.getAll().catch(trpcServerErrorHandler);

	return { report, databases };
};
