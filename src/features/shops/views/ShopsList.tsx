import { useMemo, useState } from "react";
import type { ShopStatus } from "../../../types/shop";
import { useGetShopsQuery } from "../../../store/api/shopsApi";
import ShopsTableView from "../components/ShopsTableView";

type ShopStatusFilter = "all" | ShopStatus;

function matchesShopSearch(
  shop: {
    name?: string;
    shopId?: string;
    contactInfo?: { contactEmail?: string; contactPhoneNumber?: string };
  },
  search: string,
) {
  const query = search.trim().toLowerCase();
  if (!query) return true;

  return [
    shop.name,
    shop.shopId,
    shop.contactInfo?.contactEmail,
    shop.contactInfo?.contactPhoneNumber,
  ]
    .filter(Boolean)
    .some((value) => value!.toLowerCase().includes(query));
}

export default function ShopsList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ShopStatusFilter>("all");

  const { data: shops = [], isLoading, isFetching, error } = useGetShopsQuery({
    status,
  });

  const filteredShops = useMemo(() => {
    return shops.filter((shop) => matchesShopSearch(shop, search));
  }, [shops, search]);

  const requestError = (error as { message?: string } | undefined)?.message;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Shops</h1>
          <p className="mt-1 text-sm text-primary/70">
            Review registered shops and monitor their status.
          </p>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-primary/10 bg-white p-3 sm:grid-cols-[1fr_auto] sm:items-center sm:p-4">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-primary/60">
            Search shops
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, shop id, email, phone"
            className="w-full rounded-xl border border-primary/20 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-primary/60">
            Status
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ShopStatusFilter)}
            className="w-full rounded-xl border border-primary/20 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          >
            <option value="all">All shops</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between text-sm text-primary/70">
        <p>
          Showing {filteredShops.length} of {shops.length} shops
        </p>
        {isFetching && <p>Refreshing...</p>}
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-primary/10 bg-white p-6 text-sm text-primary/70">
          Loading shops...
        </div>
      ) : requestError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {requestError}
        </div>
      ) : filteredShops.length === 0 ? (
        <div className="rounded-2xl border border-primary/10 bg-white p-6 text-sm text-primary/70">
          No shops match your current search/filter.
        </div>
      ) : (
        <ShopsTableView shops={filteredShops} />
      )}
    </section>
  );
}