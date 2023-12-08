import { c as createCaller } from "../../chunks/app.router.js";
import { t as trpcServerErrorHandler } from "../../chunks/trpcErrorhandler.js";
const load = async (event) => {
  const trpc = await createCaller(event);
  const { reports } = await trpc.report.getAll().catch(trpcServerErrorHandler);
  return { reports };
};
export {
  load
};
