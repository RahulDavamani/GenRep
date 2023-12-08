import { a as auth } from "../../../chunks/lucia.js";
import { r as redirect } from "../../../chunks/index.js";
const actions = {
  default: async ({ locals }) => {
    if (locals.session)
      await auth.invalidateSession(locals.session.sessionId);
    locals.auth.setSession(null);
    throw redirect(302, "/login");
  }
};
export {
  actions
};
