import { e as error } from "../../../chunks/index.js";
import { c as createCaller } from "../../../chunks/app.router.js";
import { t as trpcServerErrorHandler } from "../../../chunks/trpcErrorhandler.js";
const load = async (event) => {
  const id = event.url.searchParams.get("id");
  const token = event.url.searchParams.get("token");
  if (!id || !token)
    throw error(400, "Bad Request");
  const trpc = await createCaller(event);
  const { report } = await trpc.report.getReportView({ id, token }).catch(trpcServerErrorHandler);
  return { report };
};
export {
  load
};
