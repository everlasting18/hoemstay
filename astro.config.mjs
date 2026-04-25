import { defineConfig, envField } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    platformProxy: { enabled: true }
  }),
  site: process.env.PUBLIC_SITE_URL || "https://example.com",
  env: {
    schema: {
      PUBLIC_POCKETBASE_URL: envField.string({ context: "server", access: "public", optional: true }),
      PUBLIC_SITE_URL: envField.string({ context: "server", access: "public", optional: true }),
      PUBLIC_REQUIRE_CMS: envField.string({ context: "server", access: "public", optional: true })
    }
  }
});
