import { createCaller } from '../../trpc/routers/app.router.js';

export const load = async (event) => {
	const trpc = await createCaller(event);
	const { databases } = await trpc.database.getAll();
	const { apiKeys } = await trpc.apiKey.getAll();

	return { databases, apiKeys };
};
