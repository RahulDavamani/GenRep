import { createCaller } from '../../trpc/routers/app.router.js';
import { trpcServerErrorHandler } from '../../trpc/trpcErrorhandler.js';

export const load = async (event) => {
	const trpc = await createCaller(event);
	const { validateTokenUrl } = await trpc.user.getValidateTokenURL().catch(trpcServerErrorHandler);
	const { databases } = await trpc.database.getAll().catch(trpcServerErrorHandler);
	const { apiKeys } = await trpc.apiKey.getAll().catch(trpcServerErrorHandler);

	return { validateTokenUrl, databases, apiKeys };
};
