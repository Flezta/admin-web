import { createPortal } from "react-dom";

interface ConfirmActionModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  hint?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonClassName?: string;
}

export default function ConfirmActionModal({
  isOpen,
  title,
  message,
  hint = "Please confirm to continue.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  confirmButtonClassName,
}: ConfirmActionModalProps) {
  if (!isOpen) return null;

  const modal = (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-primary/35 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-2xl border border-primary/15 bg-white p-5 shadow-2xl">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <p className="mt-2 text-sm text-primary/70">{message}</p>
        <p className="mt-1 text-xs text-primary/55">{hint}</p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              confirmButtonClassName ||
              "rounded-lg border border-primary bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}