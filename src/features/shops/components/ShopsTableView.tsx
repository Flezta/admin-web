import { Link } from "react-router-dom";
import type { Shop } from "../../../types/shop";

interface ShopsTableViewProps {
  shops: Shop[];
}

function formatDate(value?: string) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

function statusStyles(status?: string) {
  if (status === "active") {
    return "border-green-200 bg-green-50 text-green-700";
  }
  if (status === "pending") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (status === "suspended") {
    return "border-red-200 bg-red-50 text-red-700";
  }
  if (status === "rejected") {
    return "border-slate-300 bg-slate-100 text-slate-700";
  }
  return "border-primary/20 bg-primary/5 text-primary/70";
}

export default function ShopsTableView({ shops }: ShopsTableViewProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-primary/5 text-left text-xs uppercase tracking-[0.14em] text-primary/65">
          <tr>
            <th className="px-4 py-3">Shop</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shops.map((shop) => (
            <tr
              key={shop.shopId}
              className="border-t border-primary/10 align-top"
            >
              <td className="px-4 py-3">
                <p className="font-semibold text-primary">{shop.name || "-"}</p>
                <p className="text-primary/70">{shop.shopId}</p>
              </td>

              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${statusStyles(
                    shop.status,
                  )}`}
                >
                  {shop.status || "unknown"}
                </span>
              </td>

              <td className="px-4 py-3 text-primary/75">
                <p>{shop.contactInfo?.contactEmail || "-"}</p>
                <p>{shop.contactInfo?.contactPhoneNumber || "-"}</p>
              </td>

              <td className="px-4 py-3 text-primary/75">
                {formatDate(shop.createdAt)}
              </td>

              <td className="px-4 py-3">
                <Link
                  to={`/shops/${shop.shopId}`}
                  className="inline-flex rounded-lg border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/5"
                >
                  View details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
