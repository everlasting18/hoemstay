import type { CollectionField, PocketBaseRecord } from "@/lib/types";

type FieldConfig = {
  fields: CollectionField[];
};

export const decodeLinesField = (value: unknown) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.join("\n");
    }
  } catch {
    return trimmed;
  }

  return trimmed;
};

export const encodeFieldValue = (field: CollectionField, value: string | number | boolean) => {
  if (field.type === "number") {
    return value === "" ? null : Number(value);
  }

  if (field.type === "checkbox") {
    return Boolean(value);
  }

  if (field.type === "linesToJson") {
    const lines = String(value)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    return JSON.stringify(lines);
  }

  return String(value ?? "");
};

export const createInitialValues = (config: FieldConfig, record?: PocketBaseRecord | null) => {
  const next: Record<string, string | number | boolean> = {};

  config.fields.forEach((field) => {
    const rawValue = record?.[field.key];

    if (field.type === "checkbox") {
      next[field.key] = Boolean(rawValue);
      return;
    }

    if (field.type === "linesToJson") {
      next[field.key] = decodeLinesField(rawValue);
      return;
    }

    if (field.type === "number") {
      next[field.key] = rawValue === null || rawValue === undefined ? "" : String(rawValue);
      return;
    }

    next[field.key] = String(rawValue ?? "");
  });

  return next;
};
