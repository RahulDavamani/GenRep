import { c as createCaller } from "../../../chunks/app.router.js";
import { t as trpcServerErrorHandler } from "../../../chunks/trpcErrorhandler.js";
const load = async (event) => {
  const trpc = await createCaller(event);
  const { validateTokenUrl } = await trpc.user.getValidateTokenURL().catch(trpcServerErrorHandler);
  const { databases } = await trpc.database.getAll().catch(trpcServerErrorHandler);
  const { apiKeys } = await trpc.apiKey.getAll().catch(trpcServerErrorHandler);
  return { validateTokenUrl, databases, apiKeys };
};
export {
  load
};
