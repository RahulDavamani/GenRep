import { createCaller, type RouterOutput } from '../../trpc/routers/app.router.js';
import { trpcServerErrorHandler } from '../../trpc/trpcErrorhandler.js';

export const load = async (event) => {
	const id = event.url.searchParams.get('id');
	const { theme } = await event.parent();

	const trpc = await createCaller(event);
	const { report } = id
		? await trpc.report.getById({ id }).catch(trpcServerErrorHandler)
		: ({
				report: {
					id: '',
					name: '',
					slug: '',
					description: '',
					theme,
					userId: '',
					datasets: []
				}
		  } as RouterOutput['report']['getById']);
	const { databases } = await trpc.database.getAll().catch(trpcServerErrorHandler);

	return { report, databases };
};
