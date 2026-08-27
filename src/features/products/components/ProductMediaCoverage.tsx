import type { Product } from "../../../types/product";
import {
  groupImagesByAxis,
  resolveImageAxisKey,
  toValueList,
} from "../utils/product.helpers";

// Sellers assign images per colour, so gaps here mean an incomplete listing.
export default function ProductMediaCoverage({
  product,
}: {
  product: Product;
}) {
  const images = product.images ?? [];
  const axisKey = resolveImageAxisKey(images);
  const groups = groupImagesByAxis(images, axisKey);

  const declaredValues = axisKey
    ? toValueList(product.variantProperties?.[axisKey])
    : [];

  const covered = new Set(groups.map((group) => group.value));
  const rows = [
    ...declaredValues.map((value) => ({
      value,
      count: groups.find((group) => group.value === value)?.images.length ?? 0,
    })),
    ...groups
      .filter((group) => !declaredValues.includes(group.value))
      .map((group) => ({ value: group.value, count: group.images.length })),
  ];

  if (!axisKey || rows.length === 0) {
    return (
      <p className="text-sm text-primary/65">
        {images.length} image(s) uploaded, none tagged to a variant option.
      </p>
    );
  }

  const missing = declaredValues.filter((value) => !covered.has(value));

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.value}
            className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 ${
              row.count === 0
                ? "border-red-200 bg-red-50"
                : "border-primary/10 bg-white"
            }`}
          >
            <p className="text-sm font-semibold capitalize text-primary">
              {row.value}
            </p>
            <p
              className={`text-sm font-bold ${row.count === 0 ? "text-red-600" : "text-primary/70"}`}
            >
              {row.count} image{row.count === 1 ? "" : "s"}
            </p>
          </div>
        ))}
      </div>

      {missing.length > 0 ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          Missing images for: {missing.join(", ")}
        </p>
      ) : null}
    </div>
  );
}
