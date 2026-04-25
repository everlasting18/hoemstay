import type { APIRoute } from "astro";
import { resolveSiteUrl, toAbsoluteUrl } from "../lib/site-url";

export const GET: APIRoute = ({ site }) => {
  const baseUrl = resolveSiteUrl(site);
  const sitemapUrl = toAbsoluteUrl("/sitemap.xml", baseUrl);

  const body = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
