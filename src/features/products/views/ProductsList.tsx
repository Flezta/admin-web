import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AlertMessage from "../../../lib/components/AlertMessage";
import EmptyState from "../../../lib/components/EmptyState";
import Pagination from "../../../lib/components/Pagination";
import StatCard from "../../../lib/components/StatCard";
import StatusTabs from "../../../lib/components/StatusTabs";
import type { StatusTabItem } from "../../../lib/components/StatusTabs";
import BoxIcon from "../../../lib/icons/BoxIcon";
import { getErrorMessage } from "../../../lib/utils/helpers";
import { useGetProductsQuery } from "../../../store/api/productsApi";
import type { ProductSort, ProductStatusFilter } from "../../../types/product";
import ProductCard from "../components/ProductCard";
import ProductsGridSkeleton from "../components/ProductsGridSkeleton";

const PAGE_SIZE = 24;

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "longest_waiting", label: "Longest waiting" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "recently_updated", label: "Recently updated" },
  { value: "title_asc", label: "Title A-Z" },
];

const TAB_VALUES: ProductStatusFilter[] = [
  "all",
  "under_review",
  "live",
  "sold_out",
  "draft",
  "rejected",
  "disabled",
];

function isStatusFilter(value: string | null): value is ProductStatusFilter {
  return Boolean(value) && TAB_VALUES.includes(value as ProductStatusFilter);
}

export default function ProductsList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const tab: ProductStatusFilter = isStatusFilter(tabParam)
    ? tabParam
    : "under_review";
  const shopId = searchParams.get("shopId") || "";

  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [sort, setSort] = useState<ProductSort>(
    tab === "under_review" ? "longest_waiting" : "newest",
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reviewers work oldest-first so submissions cannot starve in the queue.
  useEffect(() => {
    setSort(tab === "under_review" ? "longest_waiting" : "newest");
  }, [tab]);

  useEffect(() => {
    setPage(1);
  }, [tab, search, sort, shopId]);

  const { data, isLoading, isFetching, error } = useGetProductsQuery({
    page,
    limit: PAGE_SIZE,
    status:
      tab === "all" || tab === "disabled"
        ? "all"
        : tab === "sold_out"
          ? "live"
          : tab,
    disabled: tab === "disabled" ? "true" : "false",
    ...(tab === "sold_out" ? { stock: "sold_out" as const } : {}),
    ...(shopId ? { shopId } : {}),
    ...(search ? { search } : {}),
    sort,
  });

  const products = data?.data ?? [];
  const meta = data?.meta;
  const counts = data?.counts;
  const requestError = getErrorMessage(error);

  const tabs = useMemo<StatusTabItem<ProductStatusFilter>[]>(
    () => [
      { value: "all", label: "All", count: counts?.all },
      {
        value: "under_review",
        label: "Under review",
        count: counts?.under_review,
      },
      { value: "live", label: "Live", count: counts?.live },
      { value: "sold_out", label: "Sold out", count: counts?.soldOut },
      { value: "draft", label: "Draft", count: counts?.draft },
      { value: "rejected", label: "Rejected", count: counts?.rejected },
      { value: "disabled", label: "Deleted", count: counts?.disabled },
    ],
    [counts],
  );

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Products
          </h1>
          <p className="mt-1 text-sm text-primary/70">
            Review seller listings and moderate what goes live on the
            marketplace. Listings are created and edited by sellers.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Awaiting review"
          value={String(counts?.under_review ?? 0)}
          hint="Submitted listings needing a decision"
        />
        <StatCard
          label="Live"
          value={String(counts?.live ?? 0)}
          hint="Visible to buyers right now"
        />
        <StatCard
          label="Sold out"
          value={String(counts?.soldOut ?? 0)}
          hint="Live but hidden until restocked"
        />
        <StatCard
          label="Rejected"
          value={String(counts?.rejected ?? 0)}
          hint="Blocked pending seller fixes"
        />
      </div>

      <StatusTabs
        items={tabs}
        activeValue={tab}
        onSelect={(value) => updateParam("tab", value)}
      />

      <div className="grid gap-3 rounded-2xl border border-primary/10 bg-white p-3 sm:grid-cols-[1fr_auto] sm:items-end sm:p-4">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-primary/60">
            Search products
          </span>
          <input
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
              updateParam("q", event.target.value.trim());
            }}
            placeholder="Title, product id, brand, category path"
            className="w-full rounded-xl border border-primary/20 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-primary/60">
            Sort
          </span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as ProductSort)}
            className="w-full rounded-xl border border-primary/20 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {shopId ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/15 bg-primary/5 px-3 py-2 text-sm text-primary/75">
          <p>
            Filtered to shop <span className="font-semibold">{shopId}</span>
          </p>
          <button
            type="button"
            onClick={() => updateParam("shopId", "")}
            className="cursor-pointer text-xs font-semibold underline underline-offset-4"
          >
            Clear
          </button>
        </div>
      ) : null}

      {isFetching && !isLoading ? (
        <p className="text-sm text-primary/65">Refreshing products...</p>
      ) : null}

      {isLoading ? (
        <ProductsGridSkeleton />
      ) : requestError ? (
        <AlertMessage tone="error" message={requestError} />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<BoxIcon />}
          title="No products here"
          description="Nothing matches this tab and search combination yet."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>

          {meta ? (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              showing={products.length}
              disabled={isFetching}
              onPageChange={setPage}
            />
          ) : null}
        </>
      )}
    </section>
  );
}
