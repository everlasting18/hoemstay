const PLACEHOLDER_URL = "https://example.com";

export const resolveSiteUrl = (site?: URL): URL => {
  if (site) return site;
  const env = import.meta.env.PUBLIC_SITE_URL?.trim();
  if (!env) {
    console.warn(
      "[site-url] PUBLIC_SITE_URL chưa được set. " +
      "Site sẽ bị đánh dấu noindex trên search engine. " +
      "Thêm PUBLIC_SITE_URL=https://yourdomain.com vào file .env"
    );
  }
  return new URL(env || PLACEHOLDER_URL);
};

export const toAbsoluteUrl = (path: string, site: URL) => new URL(path, site).toString();

export const isPlaceholderSite = (site: URL) =>
  site.hostname === "example.com" || !import.meta.env.PUBLIC_SITE_URL?.trim();
