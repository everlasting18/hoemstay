import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { createInitialValues, encodeFieldValue } from "@/lib/form-values";
import { createRecord, updateRecord } from "@/lib/pocketbase";
import type { PocketBaseRecord, SettingsConfig } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldInput } from "@/components/FieldInput";
import type { ToastMessage } from "@/App";

type SettingsPanelProps = {
  config: SettingsConfig;
  record: PocketBaseRecord | null;
  token: string;
  onReload: () => Promise<void>;
  onToast: (message: string, type: ToastMessage["type"]) => void;
};

export function SettingsPanel({ config, record, token, onReload, onToast }: SettingsPanelProps) {
  const initialValues = useMemo(() => createInitialValues(config, record), [config, record]);

  const [values, setValues] = useState<Record<string, string | number | boolean>>(initialValues);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = Object.fromEntries(
        config.fields.map((field) => [field.key, encodeFieldValue(field, values[field.key] ?? "")])
      );

      if (record?.id) {
        await updateRecord(config.key, record.id, payload, token);
        onToast("Đã lưu settings.", "success");
      } else {
        await createRecord(config.key, payload, token);
        onToast("Đã tạo settings.", "success");
      }

      await onReload();
    } catch (submitError) {
      onToast(submitError instanceof Error ? submitError.message : "Không thể lưu settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="rounded-lg border-border/70 bg-card/85 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{record ? "Thiết lập site" : "Tạo thiết lập site"}</CardTitle>
            <CardDescription>
              {record
                ? "Cập nhật branding, liên hệ, SEO và hero metadata của website."
                : "Collection settings đang rỗng. Điền thông tin bắt buộc để tạo record đầu tiên."}
            </CardDescription>
          </div>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Đang lưu..." : record ? "Lưu settings" : "Tạo settings"}
          </Button>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {config.fields.map((field) => (
              <FieldInput
                key={field.key}
                field={field}
                value={values[field.key] ?? ""}
                onChange={(nextValue) =>
                  setValues((current) => ({ ...current, [field.key]: nextValue }))
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
