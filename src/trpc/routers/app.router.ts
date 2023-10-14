import type { ServerLoadEvent } from '@sveltejs/kit';
import { createContext, procedure, router } from '../trpc';
import { apiKeyRouter } from './apiKey.router';
import { databaseRouter } from './database.router';
import { themeRouter } from './theme.router';
import { reportRouter } from './report.router';

export const appRouter = router({
	test: procedure.query(async () => {
		return 'hello';
	}),
	theme: themeRouter,
	database: databaseRouter,
	apiKey: apiKeyRouter,
	report: reportRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = async (event: ServerLoadEvent) => appRouter.createCaller(await createContext(event));
