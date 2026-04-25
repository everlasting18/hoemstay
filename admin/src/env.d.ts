/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POCKETBASE_URL?: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET?: string;
  readonly VITE_CLOUDINARY_IMAGE_TRANSFORM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
