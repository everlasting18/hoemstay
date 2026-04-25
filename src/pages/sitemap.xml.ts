import type { APIRoute } from "astro";
import { getRooms } from "../lib/content";
import { resolveSiteUrl, toAbsoluteUrl } from "../lib/site-url";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = resolveSiteUrl(site);
  const lastmod = new Date().toISOString().slice(0, 10);
  const rooms = await getRooms();

  const staticPaths = ["/"];
  const roomPaths = rooms.map((room) => `/phong-nghi/${room.slug}/`);
  const urls = [...staticPaths, ...roomPaths];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${toAbsoluteUrl(path, baseUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
