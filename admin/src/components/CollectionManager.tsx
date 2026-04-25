import { ListChecks, PencilLine } from "lucide-react";
import { RecordEditor } from "@/components/RecordEditor";
import { RecordList } from "@/components/RecordList";
import { useCollectionEditor } from "@/hooks/useCollectionEditor";
import type { CollectionConfig, PocketBaseRecord } from "@/lib/types";
import { cn, toSlug } from "@/lib/utils";
import type { ToastMessage } from "@/App";

type CollectionManagerProps = {
  config: CollectionConfig;
  records: PocketBaseRecord[];
  token: string;
  onReload: () => Promise<void>;
  onToast: (message: string, type: ToastMessage["type"]) => void;
};

export function CollectionManager({ config, records, token, onReload, onToast }: CollectionManagerProps) {
  const editor = useCollectionEditor({ config, records, token, onReload, onToast });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void editor.submit();
  };

  const handleValueChange = (fieldKey: string, value: string | number | boolean) => {
    editor.setValues((current) => {
      const next: Record<string, string | number | boolean> = { ...current, [fieldKey]: value };

      // Tự động tạo slug từ field nguồn khi tạo record mới
      if (config.slugFrom && fieldKey === config.slugFrom && !editor.activeRecord) {
        next.slug = toSlug(String(value));
      }

      return next;
    });
  };

  return (
    <div className="space-y-4 xl:grid xl:grid-cols-[360px_minmax(0,1fr)] xl:gap-4 xl:space-y-0">
      <div className="sticky top-[73px] z-10 -mx-4 border-b border-border/70 bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 xl:hidden">
        <div className="grid grid-cols-2 rounded-xl border border-border/70 bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => editor.setMobileView("list")}
            className={cn(
              "flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors",
              editor.mobileView === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            <ListChecks className="h-4 w-4" />
            Danh sách
          </button>
          <button
            type="button"
            onClick={() => editor.setMobileView("form")}
            className={cn(
              "flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors",
              editor.mobileView === "form" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            <PencilLine className="h-4 w-4" />
            Biểu mẫu
          </button>
        </div>
      </div>

      <div className={cn(editor.mobileView === "list" ? "block" : "hidden", "xl:block")}>
        <RecordList
          activeRecordId={editor.activeRecordId}
          config={config}
          isSortableCollection={editor.isSortableCollection}
          onCreateNew={editor.createNew}
          onReorder={editor.reorder}
          onSelectRecord={editor.selectRecord}
          records={editor.orderedRecords}
          reordering={editor.reordering}
        />
      </div>

      <div className={cn(editor.mobileView === "form" ? "block" : "hidden", "xl:block")}>
        <RecordEditor
          activeRecord={editor.activeRecord}
          config={config}
          deleting={editor.deleting}
          editableFields={editor.editableFields}
          error={editor.error}
          isSortableCollection={editor.isSortableCollection}
          onCreateNew={editor.createNew}
          onDelete={editor.deleteActiveRecord}
          onSubmit={handleSubmit}
          onValueChange={handleValueChange}
          saving={editor.saving}
          values={editor.values}
        />
      </div>
    </div>
  );
}
