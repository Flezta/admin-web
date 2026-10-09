import { Link } from "react-router-dom";
import { useAuth } from "../../auth/context/use-auth";
import { useGetPartnerHubProfileQuery } from "../../../store/api/hubsApi";
import { useGetOperationalOrdersQuery } from "../../../store/api/ordersApi";
import { getErrorMessage } from "../../../lib/utils/helpers";
import Badge from "../../../lib/components/Badge";
import { statusLabel, statusTone } from "../../orders/utils";

const HubDashboard = () => {
  const { user } = useAuth();
  const {
    data: hub,
    isLoading,
    error,
  } = useGetPartnerHubProfileQuery(undefined, { skip: !user?.hubId });
  const {
    data: queue,
    error: queueError,
    isLoading: queueLoading,
  } = useGetOperationalOrdersQuery(
    { hubOnly: true, view: "attention", limit: 5 },
    { skip: !user?.hubId },
  );
  if (!user?.hubId)
    return (
      <p role="alert" className="text-sm text-amber-800">
        No hub access assigned. Contact a super-admin.{" "}
        <Link to="/hub/guide" className="font-semibold underline">
          Read the hub guide
        </Link>
      </p>
    );
  if (isLoading)
    return (
      <p className="text-sm text-primary/65">Loading your partner hub...</p>
    );
  if (error || !hub)
    return (
      <p role="alert" className="text-sm text-red-700">
        {getErrorMessage(error) || "Unable to load your hub."}{" "}
        <Link to="/hub/guide" className="font-semibold underline">
          Read the hub guide
        </Link>
      </p>
    );
  return (
    <section className="min-w-0 space-y-5">
      <header className="border-b border-primary/15 pb-4">
        <h1 className="break-words text-2xl font-bold">{hub.name}</h1>
        <p className="mt-2 break-words text-sm text-primary/65">
          {hub.address}, {hub.city}
        </p>
        <Link
          to="/hub/guide"
          className="mt-3 inline-block text-sm font-semibold text-primary underline underline-offset-4"
        >
          How to use the hub app
        </Link>
      </header>
      {!hub.enabled && (
        <p
          role="status"
          className="border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900"
        >
          Closed to new handovers. Existing assigned sub-orders can still be
          processed.
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">
          Needs attention{" "}
          {queue && <span className="text-primary/55">({queue.total})</span>}
        </h2>
        <Link
          to="/hub/orders?view=attention"
          className="text-sm font-semibold underline"
        >
          Open queue
        </Link>
      </div>
      {queueLoading && (
        <p className="text-sm text-primary/65">Loading sub-orders...</p>
      )}
      {Boolean(queueError) && (
        <p role="alert" className="text-sm text-red-700">
          {getErrorMessage(queueError)}
        </p>
      )}
      <div className="divide-y divide-primary/15">
        {queue?.rows.map((order) => {
          const subOrder = order.subOrders[0];
          return (
            <Link
              key={subOrder.subOrderId}
              to={`/hub/orders/${encodeURIComponent(subOrder.subOrderId)}`}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                {subOrder.item.imageUrl && (
                  <img
                    src={subOrder.item.imageUrl}
                    alt={subOrder.item.productName || "Ordered item"}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold">
                    {subOrder.item.productName || "Bundle"}
                  </p>
                  <p className="mt-1 break-all text-xs text-primary/55">
                    {subOrder.subOrderId} · Quantity {subOrder.item.quantity}
                  </p>
                </div>
              </div>
              <Badge tone={statusTone(subOrder.status)}>
                {statusLabel(subOrder.status)}
              </Badge>
            </Link>
          );
        })}
      </div>
      {queue && !queue.rows.length && (
        <p className="text-sm text-primary/65">
          No assigned sub-orders need attention.
        </p>
      )}
      <Link
        to="/hub/orders"
        className="inline-block text-sm font-semibold underline"
      >
        View all assigned sub-orders
      </Link>
    </section>
  );
};

export default HubDashboard;
