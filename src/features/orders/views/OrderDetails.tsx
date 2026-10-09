import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../auth/context/use-auth";
import { useGetOperationalOrderQuery } from "../../../store/api/ordersApi";
import BackLinkButton from "../../users/components/BackLinkButton";
import Badge from "../../../lib/components/Badge";
import {
  formatDate,
  formatMoney,
  getErrorMessage,
} from "../../../lib/utils/helpers";
import FulfilmentActions from "../components/FulfilmentActions";
import StatusCorrectionActions from "../components/StatusCorrectionActions";
import { statusLabel, statusTone } from "../utils";

export default function OrderDetails({
  hubOnly = false,
}: {
  hubOnly?: boolean;
}) {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const {
    currentData: order,
    isFetching,
    error,
    refetch,
  } = useGetOperationalOrderQuery(
    { hubOnly, id },
    { skip: !id || (hubOnly && !user?.hubId) },
  );
  const basePath = hubOnly ? "/hub/orders" : "/orders";
  const requestError = getErrorMessage(error);
  return (
    <section className="min-w-0 space-y-5">
      <BackLinkButton to={basePath} label="Back to orders" />
      {hubOnly && !user?.hubId ? (
        <p role="alert" className="text-sm text-amber-800">
          No hub assigned. Please contact a super-admin.
        </p>
      ) : requestError ? (
        <p role="alert" className="bg-red-50 p-4 text-sm text-red-700">
          {requestError}{" "}
          <button onClick={() => refetch()} className="font-semibold underline">
            Retry
          </button>
        </p>
      ) : !order ? (
        <p className="text-sm text-primary/65">Loading order details...</p>
      ) : (
        <>
          <header className="border-b border-primary/15 pb-4">
            <h1 className="break-words text-2xl font-bold text-primary">
              Order {order.orderId}
            </h1>
            <p className="mt-2 break-words text-sm text-primary/65">
              {!hubOnly && order.buyerEmail ? `${order.buyerEmail} · ` : ""}
              {formatDate(order.createdAt)}
            </p>
            {isFetching && (
              <p role="status" className="mt-2 text-xs text-primary/55">
                Refreshing order...
              </p>
            )}
          </header>
          <div className="grid gap-6 border-b border-primary/15 pb-5 md:grid-cols-2">
            <section className="min-w-0">
              <h2 className="text-base font-semibold">Delivery</h2>
              <p className="mt-2 text-sm">
                {[
                  order.deliveryDetails?.firstName,
                  order.deliveryDetails?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ") || "-"}
              </p>
              <p className="mt-1 break-words text-sm text-primary/70">
                {[
                  order.deliveryDetails?.address,
                  order.deliveryDetails?.region,
                  order.deliveryDetails?.country,
                ]
                  .filter(Boolean)
                  .join(", ") || "No delivery address available"}
              </p>
              <p className="mt-1 text-sm text-primary/70">
                {order.deliveryDetails?.phoneNumber || "-"}
              </p>
            </section>
            {!hubOnly && (
              <section className="min-w-0">
                <h2 className="text-base font-semibold">Payment</h2>
                <dl className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt>Items</dt>
                    <dd>
                      {formatMoney(
                        order.itemsSubtotal || 0,
                        order.currency || "NGN",
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Delivery fee</dt>
                    <dd>
                      {formatMoney(
                        order.deliveryFee || 0,
                        order.currency || "NGN",
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3 font-semibold">
                    <dt>Total</dt>
                    <dd>
                      {formatMoney(
                        order.totalAmount || 0,
                        order.currency || "NGN",
                      )}
                    </dd>
                  </div>
                  <div className="pt-2">
                    <dt className="text-primary/55">Payment reference</dt>
                    <dd className="break-all">
                      {order.paymentReference ? (
                        <Link
                          to={`/payments/buyers/${encodeURIComponent(order.paymentReference)}`}
                          className="underline"
                        >
                          {order.paymentReference}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </dd>
                  </div>
                </dl>
                <Link
                  to={`/payments?tab=vendors&orderId=${encodeURIComponent(order.orderId)}`}
                  className="mt-3 inline-block text-sm font-semibold underline"
                >
                  Vendor payment history for this order
                </Link>
              </section>
            )}
          </div>
          <h2 className="text-lg font-semibold">
            Sub-orders{" "}
            <span className="text-primary/55">({order.subOrders.length})</span>
          </h2>
          {order.subOrders.map((subOrder) => (
            <article
              key={subOrder.subOrderId}
              className="min-w-0 rounded-lg border border-primary/15 bg-white p-4 sm:p-5"
            >
              <header className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="break-all text-sm font-semibold">
                  {subOrder.subOrderId}
                </h3>
                <Badge tone={statusTone(subOrder.status)}>
                  {statusLabel(subOrder.status)}
                </Badge>
              </header>
              <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_1fr]">
                <div className="min-w-0">
                  <div className="flex items-start gap-3">
                    {subOrder.item.imageUrl && (
                      <img
                        src={subOrder.item.imageUrl}
                        alt={subOrder.item.productName || "Ordered bundle"}
                        className="h-20 w-20 shrink-0 rounded-lg border border-primary/10 object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="break-words font-semibold">
                        {subOrder.item.productName ||
                          `Bundle ${subOrder.item.bundleId || ""}`}
                      </p>
                      <p className="mt-1 text-sm text-primary/65">
                        Quantity: {subOrder.item.quantity}
                        {!hubOnly && subOrder.item.subtotal !== undefined && (
                          <> · {formatMoney(subOrder.item.subtotal, "NGN")}</>
                        )}
                      </p>
                      {subOrder.item.sku && (
                        <p className="mt-1 break-all text-xs text-primary/55">
                          SKU: {subOrder.item.sku}
                        </p>
                      )}
                      {!hubOnly && subOrder.item.productId && (
                        <Link
                          to={`/products/${encodeURIComponent(subOrder.item.productId)}`}
                          className="mt-2 inline-block text-sm font-semibold underline"
                        >
                          View product
                        </Link>
                      )}
                    </div>
                  </div>
                  {subOrder.item.components?.map((component) => (
                    <div
                      key={component.productId}
                      className="mt-3 flex items-center gap-3 text-sm"
                    >
                      {component.imageUrl && (
                        <img
                          src={component.imageUrl}
                          alt={component.productTitle}
                          className="h-12 w-12 shrink-0 rounded-lg object-cover"
                        />
                      )}
                      <span className="break-words">
                        {component.productTitle} × {component.requiredQuantity}
                      </span>
                    </div>
                  ))}
                  <dl className="mt-4 space-y-2 text-sm">
                    <div>
                      <dt className="text-xs text-primary/55">Shop</dt>
                      <dd className="break-all">
                        {hubOnly ? (
                          subOrder.shopId
                        ) : (
                          <Link
                            to={`/shops/${encodeURIComponent(subOrder.shopId)}`}
                            className="font-semibold underline"
                          >
                            {subOrder.shopId}
                          </Link>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-primary/55">Handover hub</dt>
                      <dd>
                        {subOrder.adminHandover?.hubName || "Not assigned"}
                      </dd>
                    </div>
                    {subOrder.adminHandover && (
                      <div>
                        <dt className="text-xs text-primary/55">
                          Handover schedule
                        </dt>
                        <dd>
                          {formatDate(subOrder.adminHandover.handoverDate)} ·{" "}
                          {subOrder.adminHandover.handoverTime}
                        </dd>
                      </div>
                    )}
                    {!hubOnly && (
                      <div>
                        <dt className="text-xs text-primary/55">
                          Seller payout
                        </dt>
                        <dd>
                          {subOrder.item.sellerPayout?.status || "-"} ·{" "}
                          {formatMoney(
                            subOrder.item.sellerPayout?.sellerNetAmount || 0,
                            "NGN",
                          )}{" "}
                          net
                        </dd>
                        <dd className="text-xs text-primary/55">
                          Commission:{" "}
                          {formatMoney(
                            subOrder.item.sellerPayout
                              ?.platformCommissionAmount || 0,
                            "NGN",
                          )}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
                <section className="min-w-0">
                  <h4 className="text-sm font-semibold">Activity history</h4>
                  <ol className="mt-3 space-y-3 border-l border-primary/20 pl-4">
                    {subOrder.timeline.timeline.map((event) => (
                      <li key={event.eventId} className="text-sm">
                        <p className="font-semibold text-primary">
                          {event.action === "ORDER_PLACED"
                            ? "Order placed"
                            : event.action === "HANDOVER_UPDATED"
                              ? "Handover updated"
                              : event.action === "STATUS_CORRECTED"
                                ? `Status corrected: ${event.fromStatus ? statusLabel(event.fromStatus) : ""} to ${statusLabel(event.toStatus)}`
                                : event.action === "REOPENED"
                                  ? `Order reopened: ${statusLabel(event.toStatus)}`
                                  : `${event.fromStatus ? statusLabel(event.fromStatus) : ""} to ${statusLabel(event.toStatus)}`}
                        </p>
                        <time
                          dateTime={event.occurredAt}
                          className="mt-0.5 block text-xs text-primary/55"
                        >
                          {new Date(event.occurredAt).toLocaleString(
                            undefined,
                            {
                              timeZone: "Africa/Lagos",
                              dateStyle: "medium",
                              timeStyle: "medium",
                            },
                          )}{" "}
                          (Lagos)
                        </time>
                        {event.actor && (
                          <p className="mt-1 break-words text-xs text-primary/65">
                            {event.actor.name} ·{" "}
                            {event.actor.role
                              .toLowerCase()
                              .replaceAll("_", " ")}
                          </p>
                        )}
                        {event.stockEffect && event.stockEffect !== "NONE" && (
                          <p className="mt-1 text-xs text-primary/65">
                            Stock {event.stockEffect.toLowerCase()}
                          </p>
                        )}
                        {event.reason && (
                          <p className="mt-1 break-words text-sm text-red-700">
                            {event.reason}
                          </p>
                        )}
                        {event.handoverBefore &&
                          event.action === "HANDOVER_UPDATED" && (
                            <p className="mt-1 break-words text-xs text-primary/55">
                              Previous: {event.handoverBefore.hubName} ·{" "}
                              {formatDate(event.handoverBefore.handoverDate)} ·{" "}
                              {event.handoverBefore.handoverTime}
                            </p>
                          )}
                        {event.handoverAfter && (
                          <p className="mt-1 break-words text-xs text-primary/65">
                            Handover: {event.handoverAfter.hubName} ·{" "}
                            {formatDate(event.handoverAfter.handoverDate)} ·{" "}
                            {event.handoverAfter.handoverTime}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                  {!subOrder.timeline.timeline.length && (
                    <p className="mt-2 text-sm text-primary/55">
                      No recorded activity.
                    </p>
                  )}
                </section>
              </div>
              {!hubOnly && subOrder.item.sellerPayout?.manualPaymentId && (
                <Link
                  to={`/payments/vendors/${encodeURIComponent(subOrder.item.sellerPayout.manualPaymentId)}`}
                  className="mt-3 inline-block text-sm font-semibold underline"
                >
                  Open vendor payment record
                </Link>
              )}
              <FulfilmentActions subOrder={subOrder} />
              {!hubOnly && <StatusCorrectionActions subOrder={subOrder} />}
            </article>
          ))}
          {!order.subOrders.length && (
            <p className="text-sm text-primary/65">No sub-orders found.</p>
          )}
        </>
      )}
    </section>
  );
}
