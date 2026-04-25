export type AdminSession = {
  token: string;
  email: string;
  expiresAt: number; // Unix ms timestamp
};

export type RecordValue = string | number | boolean | null | undefined;

export type PocketBaseRecord = {
  id: string;
  created?: string;
  updated?: string;
  [key: string]: unknown;
};

export type CollectionFieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "checkbox"
  | "imageUrl"
  | "url"
  | "linesToJson"
  | "select";

export type CollectionField = {
  key: string;
  label: string;
  type: CollectionFieldType;
  placeholder?: string;
  description?: string;
  options?: string[];
  rows?: number;
  required?: boolean;
  preview?: "image" | "image-list";
  supportsUpload?: boolean;
  uploadFolder?: string;
};

export type SectionKey = "settings" | "hero_slides" | "rooms" | "services" | "gallery" | "reviews";

export type CollectionConfig = {
  key: Exclude<SectionKey, "settings">;
  title: string;
  description: string;
  singleton?: false;
  sort?: string;
  primaryField: string;
  slugFrom?: string;
  fields: CollectionField[];
};

export type SettingsConfig = {
  key: Extract<SectionKey, "settings">;
  title: string;
  description: string;
  singleton: true;
  fields: CollectionField[];
};

export type AdminSection = CollectionConfig | SettingsConfig;
