import { createCaller } from '../../trpc/routers/app.router.js';
import { trpcServerErrorHandler } from '../../trpc/trpcErrorhandler.js';

export const load = async (event) => {
	const id = event.url.searchParams.get('id');
	const { theme } = await event.parent();

	const trpc = await createCaller(event);
	const { report } = id
		? await trpc.report.getById({ id }).catch(trpcServerErrorHandler)
		: {
				report: {
					id: undefined,
					name: '',
					slug: '',
					description: '',
					theme,
					userId: '',
					datasets: []
				}
		  };
	const { databases } = await trpc.database.getAll().catch(trpcServerErrorHandler);

	return { report, databases };
};
