import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  // Không cache ở edge (Cloudflare) và browser
  // Để data từ PocketBase luôn fresh mỗi request
  response.headers.set("Cache-Control", "no-store");
  return response;
});
