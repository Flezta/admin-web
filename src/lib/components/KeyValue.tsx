import type { ReactNode } from "react";

function KeyValue({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.14em] text-primary/55">
        {label}
      </p>
      <div className="mt-1 text-sm font-semibold break-words text-primary">
        {value}
      </div>
    </div>
  );
}

export default KeyValue;
