import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SortableImageGridProps = {
  urls: string[];
  onChange: (urls: string[]) => void;
};

type SortableImageTileProps = {
  id: string;
  url: string;
  index: number;
  onRemove: (index: number) => void;
};

function SortableImageTile({ id, url, index, onRemove }: SortableImageTileProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/70 bg-muted",
        isDragging && "z-10 opacity-80 shadow-lg"
      )}
    >
      <img src={url} alt={`Ảnh ${index + 1}`} className="aspect-square w-full object-cover" />
      <div className="absolute left-2 top-2 flex items-center gap-1">
        <button
          type="button"
          className="flex h-8 w-8 touch-none items-center justify-center rounded-lg bg-background/90 text-muted-foreground shadow-sm backdrop-blur"
          aria-label="Kéo để đổi thứ tự ảnh"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="rounded-lg bg-background/90 px-2 py-1 text-xs font-medium shadow-sm backdrop-blur">
          {index + 1}
        </span>
      </div>
      <button
        type="button"
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-background/90 text-destructive opacity-100 shadow-sm backdrop-blur transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
        aria-label="Xóa ảnh"
        onClick={() => onRemove(index)}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function SortableImageGrid({ urls, onChange }: SortableImageGridProps) {
  const items = urls.map((url, index) => ({
    id: `${index}:${url}`,
    url,
    index
  }));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;
    onChange(arrayMove(urls, oldIndex, newIndex));
  };

  const handleRemove = (index: number) => {
    onChange(urls.filter((_, itemIndex) => itemIndex !== index));
  };

  if (!urls.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="font-medium text-foreground">Thứ tự ảnh</p>
        <p className="text-muted-foreground">{urls.length} ảnh</p>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {items.map((item) => (
              <SortableImageTile
                key={item.id}
                id={item.id}
                url={item.url}
                index={item.index}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
