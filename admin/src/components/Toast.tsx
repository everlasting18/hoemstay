import { CheckCircle, XCircle } from "lucide-react";
import type { ToastMessage } from "@/App";

type ToastProps = {
  toasts: ToastMessage[];
};

export function Toast({ toasts }: ToastProps) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 sm:right-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur transition-all ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-destructive/20 bg-destructive/10 text-destructive"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0 text-destructive" />
          )}
          {toast.message}
        </div>
      ))}
    </div>
  );
}
