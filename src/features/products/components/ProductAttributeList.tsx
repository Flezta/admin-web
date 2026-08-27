import { toValueList } from "../utils/product.helpers";

export default function ProductAttributeList({
  attributes,
  emptyLabel,
}: {
  attributes?: Record<string, unknown>;
  emptyLabel: string;
}) {
  const entries = Object.entries(attributes ?? {}).filter(
    ([, value]) => toValueList(value).length > 0,
  );

  if (entries.length === 0) {
    return <p className="text-sm text-primary/65">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-3">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="rounded-2xl border border-primary/10 bg-white px-3 py-2.5"
        >
          <p className="text-[11px] uppercase tracking-[0.14em] text-primary/55">
            {key.replaceAll("_", " ")}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {toValueList(value).map((item) => (
              <span
                key={item}
                className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary/75"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
