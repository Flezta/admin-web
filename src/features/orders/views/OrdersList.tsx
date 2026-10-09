import { Link, useSearchParams } from "react-router-dom";
import { useGetPartnerHubProfileQuery } from "../../../store/api/hubsApi";
import { useAuth } from "../../auth/context/use-auth";
import {
  useGetLogisticsHubsQuery,
  useGetOperationalOrdersQuery,
} from "../../../store/api/ordersApi";
import { FULFILMENT_STATUSES } from "../../../types/order";
import Badge from "../../../lib/components/Badge";
import {
  formatDate,
  formatMoney,
  getErrorMessage,
} from "../../../lib/utils/helpers";
import { fieldClass, statusLabel, statusTone } from "../utils";

export default function OrdersList({ hubOnly = false }: { hubOnly?: boolean }) {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const { data: hubs } = useGetLogisticsHubsQuery();
  const { data: partnerHub } = useGetPartnerHubProfileQuery(undefined, {
    skip: !hubOnly || !user?.hubId,
  });
  const limit = Number(params.get("limit")) || 20;
  const skip = Number(params.get("skip")) || 0;
  const view = params.get("view") === "attention" ? "attention" : "all";
  const {
    currentData: page,
    isFetching,
    error,
    refetch,
  } = useGetOperationalOrdersQuery(
    {
      hubOnly,
      view,
      limit,
      skip,
      search: params.get("search") || undefined,
      status: params.get("status") || undefined,
      shopId: params.get("shopId") || undefined,
      hubId: params.get("hubId") || undefined,
      from: params.get("from") || undefined,
      to: params.get("to") || undefined,
    },
    { skip: hubOnly && !user?.hubId },
  );

  const changeFilter = (name: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    if (name !== "skip") next.delete("skip");
    setParams(next);
  };
  const basePath = hubOnly ? "/hub/orders" : "/orders";
  const requestError = getErrorMessage(error);

  if (hubOnly && !user?.hubId)
    return (
      <p
        role="alert"
        className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
      >
        No hub is assigned to your account. Please contact a super-admin.
      </p>
    );

  return (
    <section className="min-w-0 space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            {hubOnly ? "Hub orders" : "Orders"}
          </h1>
          {hubOnly && (
            <p className="mt-1 text-sm text-primary/65">
              {partnerHub?.name || user?.hubId}
            </p>
          )}
        </div>
        <button
          type="button"
          title="Refresh orders"
          aria-label="Refresh orders"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-white disabled:opacity-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className={`h-5 w-5 ${isFetching ? "animate-spin" : ""}`}
            aria-hidden="true"
          >
            <path d="M20 7v5h-5M4 17v-5h5" />
            <path d="M5.5 8a7 7 0 0 1 12-3L20 8M4 16l2.5 3a7 7 0 0 0 12-3" />
          </svg>
        </button>
      </header>
      {hubOnly && partnerHub?.enabled === false && (
        <p
          role="status"
          className="border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900"
        >
          This hub is closed to new handovers. Existing assigned sub-orders can
          still be processed.
        </p>
      )}

      <div
        role="tablist"
        aria-label="Order views"
        className="flex gap-5 border-b border-primary/15"
      >
        {(["all", "attention"] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={view === tab}
            onClick={() => changeFilter("view", tab)}
            className={`border-b-2 pb-3 text-sm font-semibold ${view === tab ? "border-primary text-primary" : "border-transparent text-primary/55"}`}
          >
            {tab === "all" ? "All orders" : "Needs attention"}
          </button>
        ))}
      </div>

      <form
        key={`${params.get("search")}:${params.get("shopId")}`}
        onSubmit={(event) => {
          event.preventDefault();
          const values = new FormData(event.currentTarget);
          const next = new URLSearchParams(params);
          for (const name of ["search", "shopId"]) {
            const value = String(values.get(name) || "").trim();
            if (value) next.set(name, value);
            else next.delete(name);
          }
          next.delete("skip");
          setParams(next);
        }}
        className="flex flex-wrap items-end gap-3"
      >
        <label className="min-w-0 grow basis-56 text-xs font-semibold text-primary/70">
          Search
          <input
            name="search"
            defaultValue={params.get("search") || ""}
            placeholder={
              hubOnly
                ? "Order, sub-order or buyer email"
                : "Order, buyer email or payment reference"
            }
            className={`mt-1 ${fieldClass}`}
          />
        </label>
        <label className="min-w-0 grow basis-36 text-xs font-semibold text-primary/70">
          Shop ID
          <input
            name="shopId"
            defaultValue={params.get("shopId") || ""}
            className={`mt-1 ${fieldClass}`}
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Search
        </button>
      </form>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-semibold text-primary/70">
          Status
          <select
            value={params.get("status") || ""}
            onChange={(event) => changeFilter("status", event.target.value)}
            className={`mt-1 ${fieldClass}`}
          >
            <option value="">All statuses</option>
            {FULFILMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </select>
        </label>
        {!hubOnly && (
          <label className="text-xs font-semibold text-primary/70">
            Hub
            <select
              value={params.get("hubId") || ""}
              onChange={(event) => changeFilter("hubId", event.target.value)}
              className={`mt-1 ${fieldClass}`}
            >
              <option value="">All hubs</option>
              {hubs?.map((hub) => (
                <option key={hub.id} value={hub.id}>
                  {hub.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="text-xs font-semibold text-primary/70">
          From
          <input
            type="date"
            value={params.get("from") || ""}
            max={params.get("to") || undefined}
            onChange={(event) => changeFilter("from", event.target.value)}
            className={`mt-1 ${fieldClass}`}
          />
        </label>
        <label className="text-xs font-semibold text-primary/70">
          To
          <input
            type="date"
            value={params.get("to") || ""}
            min={params.get("from") || undefined}
            onChange={(event) => changeFilter("to", event.target.value)}
            className={`mt-1 ${fieldClass}`}
          />
        </label>
      </div>
      <div className="flex items-center justify-between gap-3 text-sm text-primary/65">
        <p aria-live="polite">
          {isFetching
            ? "Loading orders..."
            : `${page?.total ?? 0} ${hubOnly ? "sub-orders" : "orders"}`}
        </p>
        <button
          type="button"
          onClick={() => setParams({})}
          className="font-semibold text-primary hover:underline"
        >
          Clear filters
        </button>
      </div>
      {requestError && (
        <div
          role="alert"
          className="border-l-4 border-red-400 bg-red-50 p-3 text-sm text-red-700"
        >
          {requestError}{" "}
          <button
            type="button"
            onClick={() => refetch()}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}
      {!requestError && page && (
        <>
          <div className="overflow-x-auto border-y border-primary/15 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-primary/5 text-xs uppercase text-primary/65">
                <tr>
                  <th className="p-3">{hubOnly ? "Sub-order" : "Order"}</th>
                  {!hubOnly && <th className="p-3">Buyer</th>}
                  <th className="p-3">Progress</th>
                  {!hubOnly && <th className="p-3">Amount</th>}
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {page.rows.map((order) => (
                  <tr
                    key={order.subOrderId || order.orderId}
                    className="border-t border-primary/10 align-top hover:bg-primary/5"
                  >
                    <td className="p-3">
                      <Link
                        to={`${basePath}/${encodeURIComponent(order.subOrderId || order.orderId)}`}
                        className="font-semibold text-primary underline underline-offset-4"
                      >
                        {order.subOrderId || order.orderId}
                      </Link>
                      {hubOnly && (
                        <p className="mt-1 text-xs text-primary/55">
                          {order.orderId}
                        </p>
                      )}
                    </td>
                    {!hubOnly && (
                      <td className="max-w-56 break-words p-3">
                        {order.buyerEmail}
                      </td>
                    )}
                    <td className="p-3">
                      <div className="flex max-w-72 flex-wrap gap-1">
                        {[
                          ...new Set(
                            order.subOrders.map((subOrder) => subOrder.status),
                          ),
                        ].map((status) => (
                          <Badge key={status} tone={statusTone(status)}>
                            {statusLabel(status)}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-primary/55">
                        {
                          order.subOrders.filter(
                            (subOrder) => subOrder.status === "DELIVERED",
                          ).length
                        }
                        /{order.subOrders.length} delivered
                      </p>
                    </td>
                    {!hubOnly && (
                      <td className="whitespace-nowrap p-3">
                        {formatMoney(
                          order.totalAmount ??
                            order.subOrders[0]?.item.subtotal ??
                            0,
                          order.currency || "NGN",
                        )}
                      </td>
                    )}
                    <td className="p-3">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {page.rows.length === 0 && (
              <p className="p-8 text-center text-sm text-primary/65">
                No orders match these filters.
              </p>
            )}
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 text-primary/65">
              Rows
              <select
                value={limit}
                onChange={(event) => changeFilter("limit", event.target.value)}
                className="rounded-lg border border-primary/20 bg-white px-2 py-1"
              >
                {[20, 50, 100].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <p className="text-primary/65">
              {page.total ? skip + 1 : 0}-
              {Math.min(skip + page.rows.length, page.total)} of {page.total}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isFetching || skip === 0}
                onClick={() =>
                  changeFilter("skip", String(Math.max(0, skip - limit)))
                }
                className="rounded-lg border border-primary/20 px-3 py-2 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={isFetching || skip + limit >= page.total}
                onClick={() => changeFilter("skip", String(skip + limit))}
                className="rounded-lg border border-primary/20 px-3 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}
