import { lazy, Suspense, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, UploadCloud } from "lucide-react";
import { SortableImageGrid } from "@/components/SortableImageGrid";
import { hasCloudinaryUploadConfig, uploadFileToCloudinary } from "@/lib/cloudinary";
import { parseLineList } from "@/lib/line-list";
import type { CollectionField } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const RichTextEditor = lazy(() =>
  import("@/components/RichTextEditor").then((module) => ({ default: module.RichTextEditor }))
);

type FieldInputProps = {
  field: CollectionField;
  value: string | number | boolean;
  onChange: (nextValue: string | number | boolean) => void;
};

export function FieldInput({ field, value, onChange }: FieldInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const canUpload = field.supportsUpload && hasCloudinaryUploadConfig();
  const inputValue = String(value ?? "");
  const imageLines = field.preview === "image-list" ? parseLineList(inputValue) : [];

  const wrapperClassName = cn(
    "grid gap-3 rounded-xl border border-border/70 bg-background/80 p-3 sm:rounded-2xl sm:p-4",
    (field.type === "textarea" || field.type === "linesToJson" || field.type === "richtext") && "md:col-span-2"
  );

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    setProgress(0);
    setUploadError(null);

    try {
      const urls: string[] = [];

      for (const file of files) {
        const asset = await uploadFileToCloudinary(file, {
          folder: field.uploadFolder,
          onProgress: setProgress
        });
        urls.push(asset.url);
      }

      if (field.preview === "image") {
        onChange(urls[0] ?? "");
      } else if (field.preview === "image-list") {
        onChange([...imageLines, ...urls].join("\n"));
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload ảnh thất bại.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const renderPreview = () => {
    if (field.preview === "image" && inputValue.trim()) {
      return (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-muted">
          <img src={inputValue} alt={field.label} className="aspect-[16/10] w-full object-cover" />
        </div>
      );
    }

    if (field.preview === "image-list") {
      return <SortableImageGrid urls={imageLines} onChange={(urls) => onChange(urls.join("\n"))} />;
    }

    return null;
  };

  return (
    <div className={wrapperClassName}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <Label htmlFor={field.key}>{field.label}</Label>
          {field.description ? <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">{field.description}</p> : null}
        </div>
        {field.required ? <Badge variant="outline">Bắt buộc</Badge> : null}
      </div>

      {field.type === "richtext" ? (
        <Suspense fallback={<div className="rounded-xl border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground">Đang tải trình soạn thảo...</div>}>
          <RichTextEditor
            value={inputValue}
            onChange={(html) => onChange(html)}
            uploadFolder={field.uploadFolder}
          />
        </Suspense>
      ) : field.type === "textarea" || field.type === "linesToJson" ? (
        <Textarea
          id={field.key}
          name={field.key}
          rows={field.rows ?? 4}
          value={inputValue}
          placeholder={field.placeholder}
          required={field.required ?? false}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : field.type === "number" ? (
        <Input
          id={field.key}
          name={field.key}
          type="number"
          value={value === "" ? "" : Number(value ?? 0)}
          placeholder={field.placeholder}
          required={field.required ?? false}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : field.type === "checkbox" ? (
        <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-3">
          <Checkbox
            id={field.key}
            checked={Boolean(value)}
            onCheckedChange={(checked) => onChange(Boolean(checked))}
          />
          <Label htmlFor={field.key} className="cursor-pointer">
            Bật trạng thái này
          </Label>
        </div>
      ) : field.type === "select" ? (
        <Select value={inputValue} onValueChange={(nextValue) => onChange(nextValue)}>
          <SelectTrigger id={field.key}>
            <SelectValue placeholder="Chọn giá trị" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={field.key}
          name={field.key}
          type={field.type === "url" || field.type === "imageUrl" ? "url" : "text"}
          value={inputValue}
          placeholder={field.placeholder}
          required={field.required ?? false}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {field.supportsUpload ? (
        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
                <ImagePlus className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-foreground">Upload Cloudinary</p>
                <p className="text-xs sm:text-sm">
                  {field.preview === "image-list" ? "Có thể chọn nhiều ảnh cùng lúc." : "Chọn một ảnh để điền URL tự động."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept="image/*"
                multiple={field.preview === "image-list"}
                onChange={handleUpload}
                disabled={!canUpload || uploading}
              />
              <Button
                variant="outline"
                type="button"
                disabled={!canUpload || uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="h-4 w-4" />
                {uploading ? `Đang upload ${progress}%` : field.preview === "image-list" ? "Upload nhiều ảnh" : "Upload ảnh"}
              </Button>
            </div>
          </div>

          {!canUpload ? (
            <p className="text-sm text-muted-foreground">
              Thiếu `VITE_CLOUDINARY_CLOUD_NAME` hoặc `VITE_CLOUDINARY_UPLOAD_PRESET`, upload đang bị tắt.
            </p>
          ) : null}
          {uploadError ? <p className="text-sm font-medium text-destructive">{uploadError}</p> : null}
        </div>
      ) : null}

      {renderPreview()}
    </div>
  );
}
