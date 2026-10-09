import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  useGetBuyerPaymentsQuery,
  useGetEligibleVendorPayoutsQuery,
  useGetManualVendorPaymentsQuery,
} from "../../../store/api/paymentsApi";
import type { EligibleVendorPayout } from "../../../types/payment";
import {
  formatDate,
  formatMoney,
  getErrorMessage,
} from "../../../lib/utils/helpers";
import { fieldClass } from "../../orders/utils";
import RecordVendorPayment from "../components/RecordVendorPayment";
import Badge from "../../../lib/components/Badge";

export default function PaymentsList() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "buyers";
  const skip = Number(params.get("skip")) || 0;
  const filters = {
    limit: 20,
    skip,
    search: params.get("search") || undefined,
    buyerId: tab === "buyers" ? params.get("buyerId") || undefined : undefined,
    orderId:
      tab !== "eligible" ? params.get("orderId") || undefined : undefined,
    shopId: params.get("shopId") || undefined,
    status: params.get("status") || undefined,
    from: params.get("from") || undefined,
    to: params.get("to") || undefined,
    attention: params.get("attention") || undefined,
  };
  const buyers = useGetBuyerPaymentsQuery(filters, { skip: tab !== "buyers" });
  const eligible = useGetEligibleVendorPayoutsQuery(filters, {
    skip: tab !== "eligible",
  });
  const vendors = useGetManualVendorPaymentsQuery(filters, {
    skip: tab !== "vendors",
  });
  const active =
    tab === "eligible" ? eligible : tab === "vendors" ? vendors : buyers;
  const [selected, setSelected] = useState<EligibleVendorPayout[]>([]);
  const [recording, setRecording] = useState(false);
  const updateFilter = (name: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    if (name !== "skip") next.delete("skip");
    if (name !== "skip") {
      setSelected([]);
      setRecording(false);
    }
    setParams(next);
  };
  const choose = (row: EligibleVendorPayout) =>
    setSelected(
      selected.some((item) => item.subOrderId === row.subOrderId)
        ? selected.filter((item) => item.subOrderId !== row.subOrderId)
        : [...selected, row],
    );
  const page = active.currentData;
  const error = getErrorMessage(active.error);
  return (
    <section className="min-w-0 space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Payments</h1>
        <button
          type="button"
          disabled={active.isFetching}
          onClick={() => {
            setSelected([]);
            setRecording(false);
            active.refetch();
          }}
          className="rounded-lg border border-primary/20 px-3 py-2 text-sm"
        >
          Refresh
        </button>
      </header>
      <nav
        className="flex flex-wrap gap-5 border-b border-primary/15"
        aria-label="Payment views"
      >
        {[
          ["buyers", "Buyer payments"],
          ["eligible", "Eligible vendor payouts"],
          ["vendors", "Completed vendor payments"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              const next = new URLSearchParams({ tab: value });
              if (value !== "buyers" && tab !== "buyers" && filters.shopId)
                next.set("shopId", filters.shopId);
              setParams(next);
              setSelected([]);
              setRecording(false);
            }}
            aria-current={tab === value ? "page" : undefined}
            className={`border-b-2 pb-3 text-sm font-semibold ${tab === value ? "border-primary text-primary" : "border-transparent text-primary/55"}`}
          >
            {label}
          </button>
        ))}
      </nav>
      <form
        key={`${tab}:${params.get("search")}:${params.get("shopId")}`}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          updateFilter(
            tab === "eligible" ? "shopId" : "search",
            String(data.get("search") || "").trim(),
          );
        }}
        className="flex flex-wrap items-end gap-3"
      >
        <label className="min-w-0 grow text-xs font-semibold text-primary/70">
          {tab === "eligible" ? "Vendor shop ID" : "Search"}
          <input
            name="search"
            defaultValue={
              params.get(tab === "eligible" ? "shopId" : "search") || ""
            }
            placeholder={
              tab === "eligible"
                ? "SHOP-..."
                : "Reference, buyer email, order or vendor"
            }
            className={`mt-1 ${fieldClass}`}
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setParams({ tab })}
          className="text-sm underline"
        >
          Clear filters
        </button>
      </form>
      <div className="grid gap-3 sm:grid-cols-2">
        {tab === "buyers" ? (
          <label className="text-xs font-semibold text-primary/70">
            Buyer ID
            <input
              value={params.get("buyerId") || ""}
              onChange={(event) => updateFilter("buyerId", event.target.value)}
              className={`mt-1 ${fieldClass}`}
            />
          </label>
        ) : tab === "vendors" ? (
          <label className="text-xs font-semibold text-primary/70">
            Vendor shop ID
            <input
              value={params.get("shopId") || ""}
              onChange={(event) => updateFilter("shopId", event.target.value)}
              className={`mt-1 ${fieldClass}`}
            />
          </label>
        ) : null}
        {tab !== "eligible" && (
          <label className="text-xs font-semibold text-primary/70">
            Order ID
            <input
              value={params.get("orderId") || ""}
              onChange={(event) => updateFilter("orderId", event.target.value)}
              className={`mt-1 ${fieldClass}`}
            />
          </label>
        )}
      </div>
      {tab !== "eligible" && (
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-xs font-semibold text-primary/70">
            From
            <input
              type="date"
              value={params.get("from") || ""}
              onChange={(event) => updateFilter("from", event.target.value)}
              className={`mt-1 ${fieldClass}`}
            />
          </label>
          <label className="text-xs font-semibold text-primary/70">
            To
            <input
              type="date"
              value={params.get("to") || ""}
              onChange={(event) => updateFilter("to", event.target.value)}
              className={`mt-1 ${fieldClass}`}
            />
          </label>
          {tab === "buyers" && (
            <label className="text-xs font-semibold text-primary/70">
              Status
              <select
                value={params.get("status") || ""}
                onChange={(event) => updateFilter("status", event.target.value)}
                className={`mt-1 ${fieldClass}`}
              >
                <option value="">All statuses</option>
                {[
                  "PENDING",
                  "AUTHORIZED",
                  "SUCCESSFUL",
                  "FAILED",
                  "ABANDONED",
                  "CANCELLED",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}
      {tab === "buyers" && (
        <label className="flex items-center gap-2 text-sm text-primary/70">
          <input
            type="checkbox"
            checked={params.get("attention") === "true"}
            onChange={(event) =>
              updateFilter("attention", event.target.checked ? "true" : "")
            }
          />
          Successful payments needing order review
        </label>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      {active.isFetching && (
        <p role="status" className="text-sm text-primary/65">
          Loading payments...
        </p>
      )}
      {tab === "eligible" && (
        <p className="text-sm text-primary/65">
          Delivered for at least three days; unpaid and not on hold. Select
          sub-orders from one vendor. Recording does not send money.
        </p>
      )}
      {recording && selected.length > 0 && (
        <RecordVendorPayment
          key={selected.map((row) => row.subOrderId).join()}
          selected={selected}
          onCancel={() => setRecording(false)}
        />
      )}
      {tab === "eligible" && selected.length > 0 && !recording && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-primary/15 py-3">
          <p className="text-sm font-semibold">
            {selected[0].shopName} · {selected.length} selected ·{" "}
            {formatMoney(
              selected.reduce((total, row) => total + row.netInKobo, 0) / 100,
              "NGN",
            )}
          </p>
          <button
            type="button"
            onClick={() => setRecording(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Record completed payment
          </button>
        </div>
      )}
      <div className="overflow-x-auto border-y border-primary/15 bg-white">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-primary/5 text-xs uppercase text-primary/65">
            <tr>
              {tab === "eligible" && <th className="p-3">Select</th>}
              <th className="p-3">
                {tab === "buyers" ? "Buyer / reference" : "Vendor"}
              </th>
              <th className="p-3">
                {tab === "eligible" ? "Sub-order" : "Status"}
              </th>
              <th className="p-3">Amount</th>
              <th className="p-3">
                {tab === "eligible" ? "Delivered" : "Date"}
              </th>
            </tr>
          </thead>
          <tbody>
            {tab === "buyers" &&
              buyers.currentData?.rows.map((payment) => (
                <tr
                  key={payment.paystackReference}
                  className="border-t border-primary/10"
                >
                  <td className="max-w-72 p-3">
                    <Link
                      to={`/payments/buyers/${encodeURIComponent(payment.paystackReference)}?${params.toString()}`}
                      className="break-all font-semibold underline"
                    >
                      {payment.paystackReference}
                    </Link>
                    <p className="mt-1 break-words text-xs text-primary/55">
                      {payment.buyerUid ? (
                        <Link
                          to={`/users/${encodeURIComponent(payment.buyerUid)}`}
                          className="underline"
                        >
                          {payment.buyerEmail || payment.buyerId}
                        </Link>
                      ) : (
                        payment.buyerEmail
                      )}
                    </p>
                    {payment.orderId && (
                      <Link
                        to={`/orders/${encodeURIComponent(payment.orderId)}`}
                        className="mt-1 inline-block text-xs underline"
                      >
                        Order {payment.orderId}
                      </Link>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge
                      tone={
                        payment.status === "SUCCESSFUL"
                          ? "success"
                          : payment.status === "FAILED"
                            ? "danger"
                            : "neutral"
                      }
                    >
                      {payment.status}
                    </Badge>
                    <p className="mt-2 text-xs text-primary/65">
                      Order: {payment.orderCreationStatus.replaceAll("_", " ")}
                    </p>
                    {payment.status === "SUCCESSFUL" && !payment.orderId && (
                      <p className="mt-1 text-xs font-semibold text-amber-800">
                        No linked order
                      </p>
                    )}
                    {payment.orderCreationStatus === "REQUIRES_REVIEW" && (
                      <p className="mt-1 text-xs font-semibold text-amber-800">
                        Needs order review
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap p-3">
                    {formatMoney(payment.amountInNaira, payment.currency)}
                  </td>
                  <td className="p-3">
                    {formatDate(payment.paidAt || payment.createdAt)}
                  </td>
                </tr>
              ))}
            {tab === "eligible" &&
              eligible.currentData?.rows.map((row) => (
                <tr key={row.subOrderId} className="border-t border-primary/10">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${row.subOrderId}`}
                      checked={selected.some(
                        (item) => item.subOrderId === row.subOrderId,
                      )}
                      disabled={
                        recording ||
                        (selected.length > 0 &&
                          selected[0].shopId !== row.shopId)
                      }
                      onChange={() => choose(row)}
                    />
                  </td>
                  <td className="p-3">
                    <Link
                      to={`/shops/${encodeURIComponent(row.shopId)}`}
                      className="font-semibold underline"
                    >
                      {row.shopName}
                    </Link>
                    <p className="mt-1 text-xs text-primary/55">
                      {row.productName}
                    </p>
                  </td>
                  <td className="p-3">
                    <Link
                      to={`/orders/${encodeURIComponent(row.orderId)}`}
                      className="break-all underline"
                    >
                      {row.subOrderId}
                    </Link>
                  </td>
                  <td className="p-3">
                    <p>{formatMoney(row.netInKobo / 100, "NGN")} net</p>
                    <p className="mt-1 text-xs text-primary/55">
                      Gross {formatMoney(row.grossInKobo / 100, "NGN")} ·
                      Commission{" "}
                      {formatMoney(row.commissionInKobo / 100, "NGN")}
                    </p>
                  </td>
                  <td className="p-3">{formatDate(row.deliveredAt)}</td>
                </tr>
              ))}
            {tab === "vendors" &&
              vendors.currentData?.rows.map((payment) => (
                <tr
                  key={payment.recordId}
                  className="border-t border-primary/10"
                >
                  <td className="max-w-72 p-3">
                    <Link
                      to={`/payments/vendors/${encodeURIComponent(payment.recordId)}?${params.toString()}`}
                      className="font-semibold underline"
                    >
                      {payment.shopName}
                    </Link>
                    <p className="mt-1 break-all text-xs text-primary/55">
                      {payment.reference}
                    </p>
                    <Link
                      to={`/shops/${encodeURIComponent(payment.shopId)}`}
                      className="mt-1 inline-block text-xs underline"
                    >
                      Open shop
                    </Link>
                  </td>
                  <td className="p-3">
                    <Badge tone="success">PAID</Badge>
                    <p className="mt-1 text-xs text-primary/55">
                      {payment.method.replaceAll("_", " ")}
                    </p>
                  </td>
                  <td className="whitespace-nowrap p-3">
                    {formatMoney(payment.amountInKobo / 100, payment.currency)}
                  </td>
                  <td className="p-3">{formatDate(payment.paidAt)}</td>
                </tr>
              ))}
          </tbody>
        </table>
        {page && !page.rows.length && (
          <p className="p-8 text-center text-sm text-primary/65">
            No matching payments.
          </p>
        )}
      </div>
      {page && (
        <footer className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-primary/65">
            {page.total ? skip + 1 : 0}-
            {Math.min(skip + page.rows.length, page.total)} of {page.total}
          </p>
          <div className="flex gap-2">
            <button
              disabled={active.isFetching || skip === 0 || recording}
              onClick={() =>
                updateFilter("skip", String(Math.max(0, skip - 20)))
              }
              className="rounded-lg border border-primary/20 px-3 py-2 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={
                active.isFetching || skip + 20 >= page.total || recording
              }
              onClick={() => updateFilter("skip", String(skip + 20))}
              className="rounded-lg border border-primary/20 px-3 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </footer>
      )}
    </section>
  );
}
