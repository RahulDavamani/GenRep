const load = async ({ locals: { session } }) => {
  let theme = "wireframe";
  if (session)
    theme = (await prisma.user.findUniqueOrThrow({
      where: { id: session?.user_id },
      select: { theme: true }
    })).theme;
  return { session, theme };
};
export {
  load
};
