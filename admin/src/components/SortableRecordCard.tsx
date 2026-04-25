import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { CollectionConfig, PocketBaseRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortableRecordCardProps = {
  record: PocketBaseRecord;
  config: CollectionConfig;
  active: boolean;
  onSelect: (recordId: string) => void;
};

export function SortableRecordCard({ record, config, active, onSelect }: SortableRecordCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: record.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-3 transition-colors",
        active ? "border-primary/30 bg-primary/10" : "border-border/70 bg-background hover:bg-muted/50",
        isDragging && "opacity-80 shadow-lg"
      )}
    >
      <button
        type="button"
        className="flex h-10 w-10 shrink-0 touch-none items-center justify-center rounded-xl border border-border/70 bg-card text-muted-foreground"
        aria-label="Kéo để đổi thứ tự"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onSelect(record.id)}>
        <div className="font-medium">{String(record[config.primaryField] ?? record.id)}</div>
        <div className="mt-1 truncate text-xs text-muted-foreground">{record.id}</div>
      </button>

      <div className="shrink-0 text-right">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order</div>
        <div className="text-sm font-semibold">{typeof record.order !== "undefined" ? String(record.order) : "-"}</div>
      </div>
    </div>
  );
}
