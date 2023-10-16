import type { ServerLoadEvent } from '@sveltejs/kit';
import { createContext, procedure, router } from '../trpc';
import { apiKeyRouter } from './apiKey.router';
import { databaseRouter } from './database.router';
import { themeRouter } from './theme.router';
import { reportRouter } from './report.router';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

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

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
