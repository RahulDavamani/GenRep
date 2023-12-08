import { lucia } from "lucia";
import { google } from "@lucia-auth/oauth/providers";
import { sveltekit } from "lucia/middleware";
import { prisma as prisma$1 } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { b as private_env } from "./shared-server.js";
const prisma = global.prisma || new PrismaClient();
if (private_env.MODE === "DEV")
  global.prisma = prisma;
const auth = lucia({
  adapter: prisma$1(prisma),
  env: "PROD",
  middleware: sveltekit(),
  getUserAttributes: (data) => data,
  getSessionAttributes: (data) => data
});
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = private_env;
const googleAuth = google(auth, {
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  redirectUri: `${private_env.BASE_URL}/login/google/callback`,
  scope: ["email", "profile"]
});
export {
  auth as a,
  googleAuth as g
};
