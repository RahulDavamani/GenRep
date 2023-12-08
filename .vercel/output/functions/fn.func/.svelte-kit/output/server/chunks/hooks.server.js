import { a as auth } from "./lucia.js";
import { r as redirect } from "./index.js";
import { a as appRouter, b as createContext } from "./app.router.js";
import { createTRPCHandle } from "trpc-sveltekit";
import { a as appUrls } from "./appUrls.js";
const handle = async ({ event, resolve }) => {
  const trpcResolve = () => createTRPCHandle({ router: appRouter, createContext })({ event, resolve });
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  event.locals = { auth: authRequest, session };
  const path = event.url.pathname;
  if (path.startsWith("/trpc"))
    return trpcResolve();
  if (appUrls.sessionRestricted.includes(path))
    if (session)
      throw redirect(302, "/");
    else
      return trpcResolve();
  if (!appUrls.public.includes(path))
    if (session)
      return trpcResolve();
    else
      throw redirect(302, "/login");
  return trpcResolve();
};
export {
  handle
};
