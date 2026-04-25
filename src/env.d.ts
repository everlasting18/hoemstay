interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_POCKETBASE_URL?: string;
  readonly PUBLIC_REQUIRE_CMS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
