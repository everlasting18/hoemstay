import { useEffect, useMemo, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import { createInitialValues, encodeFieldValue } from "@/lib/form-values";
import { createRecord, deleteRecord, updateRecord } from "@/lib/pocketbase";
import type { CollectionConfig, PocketBaseRecord } from "@/lib/types";
import type { ToastMessage } from "@/App";

type UseCollectionEditorArgs = {
  config: CollectionConfig;
  records: PocketBaseRecord[];
  token: string;
  onReload: () => Promise<void>;
  onToast: (message: string, type: ToastMessage["type"]) => void;
};

export type MobileEditorView = "list" | "form";

export function useCollectionEditor({ config, records, token, onReload, onToast }: UseCollectionEditorArgs) {
  const [activeRecordId, setActiveRecordId] = useState<string | "new">("new");
  const [mobileView, setMobileView] = useState<MobileEditorView>("list");
  const [values, setValues] = useState<Record<string, string | number | boolean>>(createInitialValues(config));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderedRecords, setOrderedRecords] = useState<PocketBaseRecord[]>(records);

  const isSortableCollection = config.sort === "order";
  const editableFields = useMemo(
    () => (isSortableCollection ? config.fields.filter((field) => field.key !== "order") : config.fields),
    [config.fields, isSortableCollection]
  );

  const activeRecord = useMemo(
    () => (activeRecordId === "new" ? null : orderedRecords.find((record) => record.id === activeRecordId) ?? null),
    [activeRecordId, orderedRecords]
  );

  useEffect(() => {
    setValues(createInitialValues(config, activeRecord));
  }, [activeRecord, config]);

  useEffect(() => {
    setOrderedRecords(records);
  }, [records]);

  const resetToList = () => {
    setActiveRecordId("new");
    setValues(createInitialValues(config));
    setMobileView("list");
  };

  const submit = async () => {
    setSaving(true);
    setError(null);

    const payload = Object.fromEntries(editableFields.map((field) => [field.key, encodeFieldValue(field, values[field.key] ?? "")]));

    if (!activeRecord && isSortableCollection) {
      const maxOrder = orderedRecords.reduce((max, record) => {
        const nextOrder = typeof record.order === "number" ? record.order : Number(record.order ?? 0);
        return Number.isFinite(nextOrder) ? Math.max(max, nextOrder) : max;
      }, 0);

      payload.order = maxOrder + 1;
    }

    try {
      if (activeRecord) {
        await updateRecord(config.key, activeRecord.id, payload, token);
        onToast("Đã lưu thay đổi.", "success");
      } else {
        await createRecord(config.key, payload, token);
        onToast("Đã tạo record mới.", "success");
      }

      await onReload();
      resetToList();
    } catch (submitError) {
      const msg = submitError instanceof Error ? submitError.message : "Không thể lưu record.";
      setError(msg);
      onToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteActiveRecord = async () => {
    if (!activeRecord) return;
    const shouldDelete = window.confirm(`Xóa "${String(activeRecord[config.primaryField] ?? activeRecord.id)}"?`);
    if (!shouldDelete) return;

    setDeleting(true);
    setError(null);

    try {
      await deleteRecord(config.key, activeRecord.id, token);
      onToast("Đã xóa record.", "success");
      await onReload();
      resetToList();
    } catch (deleteError) {
      const msg = deleteError instanceof Error ? deleteError.message : "Không thể xóa record.";
      setError(msg);
      onToast(msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  const createNew = () => {
    setActiveRecordId("new");
    setMobileView("form");
  };

  const selectRecord = (recordId: string) => {
    setActiveRecordId(recordId);
    setMobileView("form");
  };

  const reorder = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !isSortableCollection) {
      return;
    }

    const oldIndex = orderedRecords.findIndex((record) => record.id === active.id);
    const newIndex = orderedRecords.findIndex((record) => record.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const previousRecords = orderedRecords;
    const movedRecords = arrayMove(orderedRecords, oldIndex, newIndex).map((record, index) => ({
      ...record,
      order: index + 1
    }));

    const changedRecords = movedRecords.filter((record, index) => {
      const previous = previousRecords[index];
      return previous?.id !== record.id || Number(previous?.order ?? 0) !== Number(record.order ?? 0);
    });

    setOrderedRecords(movedRecords);
    setError(null);
    setReordering(true);

    try {
      await Promise.all(changedRecords.map((record) => updateRecord(config.key, record.id, { order: record.order }, token)));
      await onReload();
    } catch (dragError) {
      setOrderedRecords(previousRecords);
      setError(dragError instanceof Error ? dragError.message : "Không thể cập nhật thứ tự.");
    } finally {
      setReordering(false);
    }
  };

  return {
    activeRecord,
    activeRecordId,
    createNew,
    deleteActiveRecord,
    deleting,
    editableFields,
    error,
    isSortableCollection,
    mobileView,
    orderedRecords,
    reorder,
    reordering,
    saving,
    selectRecord,
    setMobileView,
    setValues,
    submit,
    values
  };
}
