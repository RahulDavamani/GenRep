import { g as googleAuth, a as auth } from "../../../../../chunks/lucia.js";
import { OAuthRequestError } from "@lucia-auth/oauth";
const GET = async ({ url, cookies, locals }) => {
  const storedState = cookies.get("google_oauth_state");
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  if (!storedState || !state || storedState !== state || !code)
    return new Response(null, { status: 400 });
  try {
    const { googleUser, createUser, getExistingUser } = await googleAuth.validateCallback(code);
    const existingUser = await getExistingUser();
    const newUser = async () => await createUser({
      attributes: {
        name: googleUser.name,
        email: googleUser.email ?? ""
      }
    });
    const { userId } = existingUser ?? await newUser();
    const session = await auth.createSession({
      userId,
      attributes: {
        user_picture: googleUser.picture
      }
    });
    locals.auth.setSession(session);
    return new Response(null, {
      status: 302,
      headers: { Location: "/" }
    });
  } catch (e) {
    console.log(e);
    if (e instanceof OAuthRequestError)
      return new Response(null, { status: 400 });
    return new Response(null, { status: 500 });
  }
};
export {
  GET
};
