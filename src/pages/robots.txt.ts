import type { APIRoute } from "astro";

const resolveSiteUrl = (site?: URL) => site ?? new URL(import.meta.env.PUBLIC_SITE_URL || "https://example.com");

export const GET: APIRoute = ({ site }) => {
  const baseUrl = resolveSiteUrl(site);
  const sitemapUrl = new URL("/sitemap.xml", baseUrl).toString();

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
