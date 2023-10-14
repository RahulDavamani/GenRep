import { createCaller } from '../trpc/routers/app.router';
import { trpcServerErrorHandler } from '../trpc/trpcErrorhandler';

export const load = async (event) => {
	const trpc = await createCaller(event);
	const { reports } = await trpc.report.getAll().catch(trpcServerErrorHandler);
	return { reports };
};
