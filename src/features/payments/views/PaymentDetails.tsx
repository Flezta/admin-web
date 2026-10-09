import { Link, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import ConfirmActionModal from "../../../components/ConfirmActionModal";
import {
  useGetBuyerPaymentQuery,
  useGetManualVendorPaymentQuery,
  useRecheckBuyerPaymentMutation,
} from "../../../store/api/paymentsApi";
import {
  formatDate,
  formatMoney,
  getErrorMessage,
} from "../../../lib/utils/helpers";
import BackLinkButton from "../../users/components/BackLinkButton";
import Badge from "../../../lib/components/Badge";

export default function PaymentDetails({
  vendor = false,
}: {
  vendor?: boolean;
}) {
  const { id = "" } = useParams();
  const [params] = useSearchParams();
  const backParams = new URLSearchParams(params);
  backParams.set("tab", vendor ? "vendors" : "buyers");
  const buyer = useGetBuyerPaymentQuery(id, { skip: vendor || !id });
  const manual = useGetManualVendorPaymentQuery(id, { skip: !vendor || !id });
  const active = vendor ? manual : buyer;
  const error = getErrorMessage(active.error);
  const payment = buyer.currentData;
  const record = manual.currentData;
  const [confirming, setConfirming] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [recheck, { isLoading: checking }] = useRecheckBuyerPaymentMutation();
  const verify = async () => {
    if (checking) return;
    setActionError(null);
    try {
      await recheck(id).unwrap();
      setConfirming(false);
    } catch (requestError) {
      setConfirming(false);
      setActionError(
        getErrorMessage(requestError) || "Unable to verify payment.",
      );
      await buyer.refetch();
    }
  };
  return (
    <section className="min-w-0 space-y-5">
      <BackLinkButton
        to={`/payments?${backParams.toString()}`}
        label="Back to payments"
      />
      {active.isFetching && (
        <p className="text-sm text-primary/65">Loading payment...</p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}{" "}
          <button onClick={() => active.refetch()} className="underline">
            Retry
          </button>
        </p>
      )}
      {!vendor && payment && (
        <>
          <header className="space-y-2 border-b border-primary/15 pb-4">
            <h1 className="break-all text-xl font-bold">
              Buyer payment {payment.paystackReference}
            </h1>
            <Badge
              tone={payment.status === "SUCCESSFUL" ? "success" : "neutral"}
            >
              {payment.status}
            </Badge>
            <p className="break-words text-sm text-primary/65">
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
          </header>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-primary/55">Amount paid</dt>
              <dd className="mt-1 font-semibold">
                {formatMoney(payment.amountInNaira, payment.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-primary/55">Items subtotal</dt>
              <dd className="mt-1">
                {payment.itemsSubtotal == null
                  ? "-"
                  : formatMoney(payment.itemsSubtotal, payment.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-primary/55">Delivery fee</dt>
              <dd className="mt-1">
                {payment.deliveryFee == null
                  ? "-"
                  : formatMoney(payment.deliveryFee, payment.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-primary/55">Paid at</dt>
              <dd className="mt-1">{formatDate(payment.paidAt)}</dd>
            </div>
            <div>
              <dt className="text-xs text-primary/55">Created at</dt>
              <dd className="mt-1">{formatDate(payment.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs text-primary/55">Buyer ID</dt>
              <dd className="mt-1 break-all">{payment.buyerId || "-"}</dd>
            </div>
            <div>
              <dt className="text-xs text-primary/55">Verification</dt>
              <dd className="mt-1">
                {payment.verificationMethod || "Not verified"} ·{" "}
                {formatDate(payment.verifiedAt)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-primary/55">Order creation</dt>
              <dd className="mt-1">{payment.orderCreationStatus}</dd>
            </div>
          </dl>
          {payment.failureReason && (
            <p
              role="alert"
              className="border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900"
            >
              Payment: {payment.failureReason}
            </p>
          )}
          {payment.orderCreationFailureReason && (
            <p
              role="alert"
              className="border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900"
            >
              Order creation: {payment.orderCreationFailureReason}
            </p>
          )}
          {payment.orderId ? (
            <Link
              to={`/orders/${encodeURIComponent(payment.orderId)}`}
              className="inline-block text-sm font-semibold underline"
            >
              Open order {payment.orderId}
            </Link>
          ) : (
            <p className="text-sm text-amber-800">
              {payment.status === "SUCCESSFUL"
                ? "Payment received, but no linked order. Order creation needs review."
                : "No linked order."}
            </p>
          )}
          <p className="text-sm text-primary/65">
            Channel: {payment.channel || "-"} · Gateway fees:{" "}
            {payment.feesInKobo != null
              ? formatMoney(payment.feesInKobo / 100, payment.currency)
              : "-"}
          </p>
          {payment.gatewayResponse && (
            <p className="break-words text-sm text-primary/65">
              Gateway result: {payment.gatewayResponse}
            </p>
          )}
          {payment.status !== "CANCELLED" &&
            !(
              payment.status === "SUCCESSFUL" &&
              (payment.orderCreationStatus === "PROCESSING" || payment.orderId)
            ) && (
              <button
                type="button"
                disabled={checking}
                onClick={() => setConfirming(true)}
                className="rounded-lg border border-primary/20 px-3 py-2 text-sm font-semibold"
              >
                Verify payment / retry order
              </button>
            )}
          {actionError && (
            <p role="alert" className="text-sm text-red-700">
              {actionError}
            </p>
          )}
          <section className="border-t border-primary/15 pt-4">
            <h2 className="text-lg font-semibold">Linked sub-orders</h2>
            {!payment.subOrders?.length && (
              <p className="mt-2 text-sm text-primary/65">
                No linked sub-orders.
              </p>
            )}
            <div className="mt-3 divide-y divide-primary/10">
              {payment.subOrders?.map((subOrder) => (
                <div
                  key={subOrder.subOrderId}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <Link
                    to={`/orders/${encodeURIComponent(subOrder.orderId)}`}
                    className="break-all text-sm underline"
                  >
                    {subOrder.subOrderId}
                  </Link>
                  <p className="text-sm">
                    {subOrder.status} · Vendor payout{" "}
                    {subOrder.item.sellerPayout.status}
                  </p>
                  <Link
                    to={`/shops/${encodeURIComponent(subOrder.shopId)}`}
                    className="text-sm underline"
                  >
                    Open shop
                  </Link>
                  {subOrder.item.sellerPayout.manualPaymentId && (
                    <Link
                      to={`/payments/vendors/${encodeURIComponent(subOrder.item.sellerPayout.manualPaymentId)}`}
                      className="text-sm underline"
                    >
                      Vendor payment record
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
          <section className="border-t border-primary/15 pt-4">
            <h2 className="text-lg font-semibold">Refund history</h2>
            {payment.refunds?.length ? (
              payment.refunds.map((refund) => (
                <div key={refund.refundReference} className="mt-3 text-sm">
                  <p>
                    {refund.status} ·{" "}
                    {formatMoney(refund.amount, payment.currency)} ·{" "}
                    {refund.refundReference}
                  </p>
                  <p className="mt-1 break-words text-primary/65">
                    {refund.reason}
                  </p>
                  <p className="mt-1 text-xs text-primary/55">
                    Created {formatDate(refund.createdAt)}
                    {refund.completedAt &&
                      ` · Completed ${formatDate(refund.completedAt)}`}
                  </p>
                </div>
              ))
            ) : (
              <p className="mt-2 text-sm text-primary/65">
                No recorded refunds.
              </p>
            )}
          </section>
        </>
      )}
      {vendor && record && (
        <>
          <header className="space-y-2 border-b border-primary/15 pb-4">
            <h1 className="text-xl font-bold">
              Vendor payment: {record.shopName}
            </h1>
            <Badge tone="success">PAID</Badge>
            <p className="break-all text-xs text-primary/55">
              {record.recordId}
            </p>
          </header>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-primary/55">Amount</dt>
              <dd className="mt-1 font-semibold">
                {formatMoney(record.amountInKobo / 100, record.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-primary/55">Payment date/time</dt>
              <dd className="mt-1">
                {new Date(record.paidAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-primary/55">Reference / method</dt>
              <dd className="mt-1 break-all">
                {record.reference} · {record.method.replaceAll("_", " ")}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-primary/55">Recorded by / at</dt>
              <dd className="mt-1">
                <Link
                  to={`/users/${encodeURIComponent(record.recordedBy.uid)}`}
                  className="underline"
                >
                  {record.recordedBy.name}
                </Link>{" "}
                · {new Date(record.createdAt).toLocaleString()}
              </dd>
            </div>
          </dl>
          <Link
            to={`/shops/${encodeURIComponent(record.shopId)}`}
            className="inline-block text-sm font-semibold underline"
          >
            Open vendor shop
          </Link>
          {record.notes && (
            <p className="whitespace-pre-wrap break-words text-sm text-primary/65">
              {record.notes}
            </p>
          )}
          {record.bankSnapshot?.accountNumber && (
            <p className="text-sm text-primary/65">
              Bank details at recording: {record.bankSnapshot.accountName} ·{" "}
              {record.bankSnapshot.accountNumber} ·{" "}
              {record.bankSnapshot.bankCode}
            </p>
          )}
          <section className="border-t border-primary/15 pt-4">
            <h2 className="text-lg font-semibold">Paid sub-orders</h2>
            <div className="mt-3 divide-y divide-primary/10">
              {record.lines?.map((line) => (
                <div
                  key={line.subOrderId}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
                >
                  <Link
                    to={`/orders/${encodeURIComponent(line.orderId)}`}
                    className="break-all underline"
                  >
                    {line.subOrderId}
                  </Link>
                  <p>
                    {formatMoney(line.grossInKobo / 100, record.currency)} gross
                    · {formatMoney(line.netInKobo / 100, record.currency)} net ·{" "}
                    {formatMoney(line.commissionInKobo / 100, record.currency)}{" "}
                    commission
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section className="border-t border-primary/15 pt-4">
            <h2 className="text-lg font-semibold">Payment activity</h2>
            {record.history?.map((event) => (
              <div key={event.eventId} className="mt-3 text-sm">
                <p>
                  {event.action.replaceAll("_", " ")} · {event.actor.name} ·{" "}
                  {new Date(event.occurredAt).toLocaleString()}
                </p>
                {event.reason && (
                  <p className="mt-1 break-words text-primary/65">
                    {event.reason}
                  </p>
                )}
              </div>
            ))}
          </section>
        </>
      )}
      <ConfirmActionModal
        isOpen={confirming}
        title="Verify buyer payment"
        message={`Verify ${id}?`}
        warning="This checks the payment using the existing verification flow. For an already confirmed successful payment, it may retry order creation. It does not charge the buyer again, issue a refund, or pay a vendor."
        busy={checking}
        onCancel={() => setConfirming(false)}
        onConfirm={verify}
      />
    </section>
  );
}
