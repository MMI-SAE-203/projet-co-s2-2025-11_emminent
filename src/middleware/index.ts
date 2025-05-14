import PocketBase from "pocketbase";
import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(
  async ({ locals, request, isPrerendered }, next: () => any) => {
    locals.pb = new PocketBase("https://emminent.noahrognon.fr:443");

    if (!isPrerendered) {
      locals.pb.authStore.loadFromCookie(request.headers.get("cookie") || "");

      try {
        if (locals.pb.authStore.isSuperuser) {
          // refresh superadmin session (nouveau nom)
          await locals.pb.admins.authRefresh();
        } else if (locals.pb.authStore.isValid) {
          // refresh user session
          await locals.pb.collection("users").authRefresh();
        }
      } catch (_) {
        locals.pb.authStore.clear();
      }
    }

    const response = await next();

    if (!isPrerendered) {
      response.headers.append("set-cookie", locals.pb.authStore.exportToCookie());
    }

    return response;
  }
);
