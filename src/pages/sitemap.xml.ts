import type { APIRoute } from "astro";
import { rooms } from "../data/site";

const resolveSiteUrl = (site?: URL) => site ?? new URL(import.meta.env.PUBLIC_SITE_URL || "https://example.com");

const toAbsoluteUrl = (path: string, site: URL) => new URL(path, site).toString();

export const GET: APIRoute = ({ site }) => {
  const baseUrl = resolveSiteUrl(site);
  const lastmod = new Date().toISOString().slice(0, 10);

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
