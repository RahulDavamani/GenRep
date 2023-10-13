import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';
import { createContext } from './trpc/trpc';
import { appRouter } from './trpc/routers/app.router';
import { createTRPCHandle } from 'trpc-sveltekit';

const urls = {
	publicURLs: [] as string[], // Session & No Session
	sessionRestricted: ['/login', '/login/google', '/login/google/callback'] // No Session
};

export const handle: Handle = async ({ event, resolve }) => {
	const trpcResolve = () => createTRPCHandle({ router: appRouter, createContext })({ event, resolve });

	const authRequest = auth.handleRequest(event);
	const session = await authRequest.validate();
	event.locals = { auth: authRequest, session };

	const path = event.url.pathname;

	// tRPC
	if (path.startsWith('/trpc')) return trpcResolve();

	// Session Restricted
	if (urls.sessionRestricted.includes(path))
		if (session) throw redirect(302, '/');
		else return trpcResolve();

	// Protected
	if (!urls.publicURLs.includes(path))
		if (session) return trpcResolve();
		else throw redirect(302, '/login');

	//Public
	return trpcResolve();
};
