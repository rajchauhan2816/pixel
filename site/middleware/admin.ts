export default function(ctx: any) {
  console.log(ctx);
  if (ctx.$auth.user.role !== "Admin") {
    return ctx.redirect("/");
  }
}
