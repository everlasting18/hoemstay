import { PencilLine, Plus, Save, Trash2 } from "lucide-react";
import { FieldInput } from "@/components/FieldInput";
import type { CollectionConfig, CollectionField, PocketBaseRecord } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type RecordEditorProps = {
  activeRecord: PocketBaseRecord | null;
  config: CollectionConfig;
  deleting: boolean;
  editableFields: CollectionField[];
  error: string | null;
  isSortableCollection: boolean;
  onCreateNew: () => void;
  onDelete: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onValueChange: (fieldKey: string, value: string | number | boolean) => void;
  saving: boolean;
  values: Record<string, string | number | boolean>;
};

export function RecordEditor({
  activeRecord,
  config,
  deleting,
  editableFields,
  error,
  isSortableCollection,
  onCreateNew,
  onDelete,
  onSubmit,
  onValueChange,
  saving,
  values
}: RecordEditorProps) {
  return (
    <form onSubmit={onSubmit} className="pb-44 md:pb-0">
      <Card className="rounded-lg border-border/70 bg-card/90 shadow-sm md:rounded-lg">
        <CardHeader className="gap-3 sm:gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {activeRecord ? <PencilLine className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {activeRecord ? "Chỉnh sửa record" : "Tạo record mới"}
              </div>
              <CardTitle className="text-lg sm:text-xl">
                {activeRecord ? String(activeRecord[config.primaryField] ?? activeRecord.id) : `Tạo ${config.title}`}
              </CardTitle>
              <CardDescription className="line-clamp-3 sm:line-clamp-none">
                Điền thông tin cho collection `{config.key}`. Những field nhiều dòng sẽ được convert đúng format khi lưu.
                {isSortableCollection ? " Phần thứ tự đã được xử lý bằng kéo-thả ở panel bên trái." : ""}
              </CardDescription>
            </div>

            {activeRecord ? (
              <Button variant="destructive" type="button" onClick={onDelete} disabled={deleting}>
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">{deleting ? "Đang xóa..." : "Xóa"}</span>
              </Button>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </div>
          ) : null}
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-5">
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {editableFields.map((field) => (
              <FieldInput
                key={field.key}
                field={field}
                value={values[field.key] ?? ""}
                onChange={(nextValue) => onValueChange(field.key, nextValue)}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {activeRecord ? "Record sẽ được cập nhật ngay trong PocketBase." : "Record mới sẽ được tạo trong PocketBase."}
            </div>
            <div className="hidden flex-col gap-2 sm:flex sm:flex-row">
              <Button variant="outline" type="button" onClick={onCreateNew}>
                <Plus className="h-4 w-4" />
                Reset form
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? "Đang lưu..." : activeRecord ? "Lưu thay đổi" : "Tạo record"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="fixed inset-x-0 bottom-[4.9rem] z-30 border-t border-border/70 bg-background/95 p-3 shadow-[0_-12px_28px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-[1fr_1.25fr] gap-2">
          <Button variant="outline" type="button" onClick={onCreateNew}>
            <Plus className="h-4 w-4" />
            Mới
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Đang lưu..." : activeRecord ? "Lưu" : "Tạo"}
          </Button>
        </div>
      </div>
    </form>
  );
}
