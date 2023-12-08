import { c as createCaller } from "../../../chunks/app.router.js";
import { t as trpcServerErrorHandler } from "../../../chunks/trpcErrorhandler.js";
const load = async (event) => {
  const id = event.url.searchParams.get("id");
  const trpc = await createCaller(event);
  const { databases } = await trpc.database.getAll().catch(trpcServerErrorHandler);
  if (!id)
    return { databases };
  const { apiKey, report } = await trpc.report.getById({ id }).catch(trpcServerErrorHandler);
  return { apiKey, report, databases };
};
export {
  load
};
