import Badge from "../../../lib/components/Badge";
import { formatDate, statusLabel } from "../../../lib/utils/helpers";
import type { ProductRejectionRecord } from "../../../types/product";
import { getActorName } from "../utils/product.helpers";

export default function ProductRejectionHistory({
  records,
}: {
  records: ProductRejectionRecord[];
}) {
  if (records.length === 0) {
    return (
      <p className="text-sm text-primary/65">
        This product has never been rejected.
      </p>
    );
  }

  const ordered = [...records].reverse();

  return (
    <div className="space-y-3">
      {ordered.map((record, index) => {
        const attempt = records.length - index;
        const isOpen = !record.resolvedAt;

        return (
          <div
            key={`${record.rejectedAt}-${index}`}
            className={`rounded-2xl border p-3.5 ${
              isOpen ? "border-red-200 bg-red-50" : "border-primary/10 bg-white"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p
                className={`text-sm font-semibold ${isOpen ? "text-red-700" : "text-primary"}`}
              >
                Rejection #{attempt}
              </p>
              {isOpen ? (
                <Badge tone="danger">unresolved</Badge>
              ) : (
                <Badge tone="success">
                  resolved to {statusLabel(record.resolvedStatus)}
                </Badge>
              )}
            </div>

            <p
              className={`mt-0.5 text-xs ${isOpen ? "text-red-700/70" : "text-primary/55"}`}
            >
              {formatDate(record.rejectedAt)} by{" "}
              {getActorName(record.rejectedBy)}
              {record.resolvedAt
                ? ` · seller resubmitted ${formatDate(record.resolvedAt)}`
                : ""}
            </p>

            <ul
              className={`mt-2 list-inside list-disc space-y-1 text-xs ${
                isOpen ? "text-red-700" : "text-primary/70"
              }`}
            >
              {record.reasons.map((reason, reasonIndex) => (
                <li key={reasonIndex}>{reason}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
