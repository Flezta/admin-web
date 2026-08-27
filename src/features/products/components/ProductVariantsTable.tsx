import { formatMoney } from "../../../lib/utils/helpers";
import type { ProductVariant } from "../../../types/product";

export default function ProductVariantsTable({
  variants,
  axes,
}: {
  variants: ProductVariant[];
  axes: string[];
}) {
  if (variants.length === 0) {
    return (
      <p className="text-sm text-primary/65">
        This product has no variants saved yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-primary/5 text-left text-xs uppercase tracking-[0.14em] text-primary/65">
          <tr>
            <th className="px-4 py-3">SKU</th>
            {axes.map((axis) => (
              <th key={axis} className="px-4 py-3">
                {axis}
              </th>
            ))}
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant.sku} className="border-t border-primary/10">
              <td className="px-4 py-3 font-semibold text-primary">
                {variant.sku}
              </td>
              {axes.map((axis) => (
                <td key={axis} className="px-4 py-3 capitalize text-primary/75">
                  {variant.attributes?.[axis] || "-"}
                </td>
              ))}
              <td className="px-4 py-3 text-primary/75">
                {formatMoney(variant.price)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`font-semibold ${variant.stock > 0 ? "text-primary/75" : "text-red-600"}`}
                >
                  {variant.stock}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
