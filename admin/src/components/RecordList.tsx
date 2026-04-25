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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { SortableRecordCard } from "@/components/SortableRecordCard";
import type { CollectionConfig, PocketBaseRecord } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type RecordListProps = {
  activeRecordId: string | "new";
  config: CollectionConfig;
  isSortableCollection: boolean;
  onCreateNew: () => void;
  onReorder: (event: DragEndEvent) => void;
  onSelectRecord: (recordId: string) => void;
  records: PocketBaseRecord[];
  reordering: boolean;
};

export function RecordList({
  activeRecordId,
  config,
  isSortableCollection,
  onCreateNew,
  onReorder,
  onSelectRecord,
  records,
  reordering
}: RecordListProps) {
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

  return (
    <Card className="rounded-lg border-border/70 bg-card/85 shadow-sm md:rounded-lg">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-lg sm:text-xl">Danh sách record</CardTitle>
            <CardDescription>
              {isSortableCollection
                ? `Kéo-thả để đổi thứ tự hiển thị, hoặc chọn một record để sửa nội dung trong collection \`${config.key}\`.`
                : `Chọn một record để sửa hoặc tạo record mới cho collection \`${config.key}\`.`}
            </CardDescription>
          </div>
          <Badge variant="secondary">{records.length}</Badge>
        </div>

        <Button className="w-full sm:w-auto" variant={activeRecordId === "new" ? "default" : "outline"} onClick={onCreateNew}>
          <Plus className="h-4 w-4" />
          Tạo mới
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {isSortableCollection ? (
          <>
            <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              {reordering ? "Đang lưu thứ tự mới..." : "Giữ biểu tượng kéo ở bên trái để đổi thứ tự hiển thị."}
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onReorder}>
              <SortableContext items={records.map((record) => record.id)} strategy={verticalListSortingStrategy}>
                <div className="grid gap-3">
                  {records.map((record) => (
                    <SortableRecordCard
                      key={record.id}
                      record={record}
                      config={config}
                      active={record.id === activeRecordId}
                      onSelect={onSelectRecord}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-lg border border-border/70 md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{config.primaryField}</TableHead>
                    <TableHead className="w-[96px]">Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => {
                    const active = record.id === activeRecordId;
                    return (
                      <TableRow
                        key={record.id}
                        className={cn("cursor-pointer", active && "bg-primary/5")}
                        onClick={() => onSelectRecord(record.id)}
                      >
                        <TableCell>
                          <div className="font-medium">{String(record[config.primaryField] ?? record.id)}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{record.id}</div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {typeof record.order !== "undefined" ? String(record.order) : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-3 md:hidden">
              {records.map((record) => {
                const active = record.id === activeRecordId;
                return (
                  <button
                    key={record.id}
                    type="button"
                    onClick={() => onSelectRecord(record.id)}
                    className={cn(
                      "rounded-lg border px-4 py-3 text-left transition-colors",
                      active ? "border-primary/30 bg-primary/10" : "border-border/70 bg-background hover:bg-muted/50"
                    )}
                  >
                    <div className="font-medium">{String(record[config.primaryField] ?? record.id)}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{record.id}</div>
                    {typeof record.order !== "undefined" ? (
                      <div className="mt-2 text-xs text-muted-foreground">Order: {String(record.order)}</div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
