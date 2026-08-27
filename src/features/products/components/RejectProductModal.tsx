import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const PRESET_REASONS = [
  "Images do not meet listing quality standards",
  "Title or description is misleading",
  "Wrong or missing category attributes",
  "Pricing or stock information looks invalid",
  "Prohibited or restricted item",
  "Counterfeit or unauthorised brand use",
];

export default function RejectProductModal({
  isOpen,
  productTitle,
  submitting,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  productTitle: string;
  submitting?: boolean;
  onCancel: () => void;
  onConfirm: (reasons: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelected([]);
      setCustom("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const reasons = [...selected, ...(custom.trim() ? [custom.trim()] : [])];

  const toggleReason = (reason: string) => {
    setSelected((current) =>
      current.includes(reason)
        ? current.filter((item) => item !== reason)
        : [...current, reason],
    );
  };

  const modal = (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-primary/35 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-lg rounded-2xl border border-primary/15 bg-white p-5 shadow-2xl">
        <h3 className="text-lg font-semibold text-primary">Reject product</h3>
        <p className="mt-1 text-sm text-primary/70">
          Select at least one reason. The seller is notified with these notes.
        </p>
        <p className="mt-1 text-xs text-primary/50">{productTitle}</p>

        <div className="mt-4 space-y-2">
          {PRESET_REASONS.map((reason) => (
            <label
              key={reason}
              className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-primary/12 bg-white px-3 py-2 text-sm text-primary/80 transition hover:border-primary/30 hover:bg-primary/5"
            >
              <input
                type="checkbox"
                checked={selected.includes(reason)}
                onChange={() => toggleReason(reason)}
                className="mt-0.5 h-4 w-4 accent-[#003625]"
              />
              <span>{reason}</span>
            </label>
          ))}
        </div>

        <label className="mt-3 block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-primary/60">
            Additional note
          </span>
          <textarea
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
            rows={3}
            placeholder="Optional extra context for the seller"
            className="w-full resize-none rounded-xl border border-primary/20 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={reasons.length === 0 || submitting}
            onClick={() => onConfirm(reasons)}
            className="cursor-pointer rounded-lg border border-red-600 bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Rejecting..." : "Reject product"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
