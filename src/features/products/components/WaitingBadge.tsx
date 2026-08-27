import { elapsedHours, formatElapsed } from "../../../lib/utils/helpers";

// Ages the review queue so breaches are obvious at a glance.
const WARN_AFTER_HOURS = 24;
const BREACH_AFTER_HOURS = 72;

export default function WaitingBadge({
  since,
  label = "waiting",
}: {
  since?: string;
  label?: string;
}) {
  if (!since) return null;

  const hours = elapsedHours(since);

  const toneClass =
    hours >= BREACH_AFTER_HOURS
      ? "border-red-200 bg-red-50 text-red-700"
      : hours >= WARN_AFTER_HOURS
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-primary/20 bg-primary/5 text-primary/70";

  return (
    <span
      title={`In this state since ${new Date(since).toLocaleString()}`}
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${toneClass}`}
    >
      {formatElapsed(since)} {label}
    </span>
  );
}
