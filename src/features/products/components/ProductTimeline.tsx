import { formatDate } from "../../../lib/utils/helpers";
import type { ProductTimelineEntry } from "../../../types/product";
import { getActorName } from "../utils/product.helpers";

function roleLabel(metadata?: Record<string, unknown>) {
  const role = metadata?.role;
  if (typeof role !== "string") return null;
  return role.replaceAll("_", " ");
}

export default function ProductTimeline({
  entries,
}: {
  entries: ProductTimelineEntry[];
}) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-primary/65">
        No activity has been recorded for this product.
      </p>
    );
  }

  const ordered = [...entries].reverse();

  return (
    <ol className="relative space-y-4 border-l border-primary/15 pl-5">
      {ordered.map((entry, index) => {
        const role = roleLabel(entry.metadata);
        const reasons = entry.metadata?.rejectionReasons;

        return (
          <li key={`${entry.date}-${index}`} className="relative">
            <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-primary" />
            <p className="text-sm font-semibold text-primary">
              {entry.description}
            </p>
            <p className="mt-0.5 text-xs text-primary/55">
              {formatDate(entry.date)} · {getActorName(entry.actionBy)}
              {role ? ` · ${role}` : ""}
            </p>
            {Array.isArray(reasons) && reasons.length > 0 ? (
              <ul className="mt-2 list-inside list-disc rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {reasons.map((reason, reasonIndex) => (
                  <li key={reasonIndex}>{String(reason)}</li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
