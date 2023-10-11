import { upsertApiKey } from './(actions)/upsertApiKey.js';
import { updateTheme } from './(actions)/updateTheme.js';
import { deleteApiKey } from './(actions)/deleteApiKey.js';

export const load = async (event) => {
	const {
		locals: { session }
	} = event;

	const apiKeys = await prisma.aPIKey.findMany({
		where: { userId: session?.user_id },
		select: { id: true, name: true }
	});

	return { apiKeys };
};

export const actions = {
	upsertApiKey,
	deleteApiKey,
	updateTheme
};
