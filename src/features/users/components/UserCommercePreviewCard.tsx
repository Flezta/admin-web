import {
  useGetUserCartActivityQuery,
  useGetUserOrdersActivityQuery,
  useGetUserWishlistActivityQuery,
} from "../../../store/api/usersApi";

interface UserCommercePreviewCardProps {
  uid: string;
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
      <p className="text-xs uppercase tracking-[0.13em] text-primary/55">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-primary">{value}</p>
      <p className="text-xs text-primary/60">{hint}</p>
    </div>
  );
}

function extractMessage(error: unknown, fallback: string) {
  return (error as { message?: string } | undefined)?.message || fallback;
}

export default function UserCommercePreviewCard({
  uid,
}: UserCommercePreviewCardProps) {
  const {
    data: ordersActivity,
    error: ordersError,
    isLoading: ordersLoading,
    isFetching: ordersFetching,
  } = useGetUserOrdersActivityQuery(
    { uid, orderLimit: 20, orderSkip: 0 },
    { skip: !uid },
  );

  const {
    data: cartActivity,
    error: cartError,
    isLoading: cartLoading,
    isFetching: cartFetching,
  } = useGetUserCartActivityQuery(uid, { skip: !uid });

  const {
    data: wishlistActivity,
    error: wishlistError,
    isLoading: wishlistLoading,
    isFetching: wishlistFetching,
  } = useGetUserWishlistActivityQuery(uid, { skip: !uid });

  const completedOrders = ordersActivity?.orders.completed.length ?? 0;
  const ongoingOrders = ordersActivity?.orders.ongoing.length ?? 0;
  const totalOrders = completedOrders + ongoingOrders;

  const cartItemCount = cartActivity?.cart.totals.itemCount ?? 0;
  const cartShopCount = cartActivity?.cart.shops.length ?? 0;

  const wishlistTotal =
    wishlistActivity?.wishlist.total ??
    wishlistActivity?.wishlist.items.length ??
    0;
  const availableWishlistCount =
    wishlistActivity?.wishlist.items.filter((item) => item.available).length ??
    0;

  const busy =
    ordersLoading ||
    cartLoading ||
    wishlistLoading ||
    ordersFetching ||
    cartFetching ||
    wishlistFetching;

  const hasOrdersError = Boolean(ordersError);
  const hasCartError = Boolean(cartError);
  const hasWishlistError = Boolean(wishlistError);
  const hasAnyError = hasOrdersError || hasCartError || hasWishlistError;

  return (
    <section className="rounded-2xl border border-primary/10 bg-white p-4">
      <h2 className="text-base font-semibold text-primary">
        Customer Activity
      </h2>
      <p className="mt-1 text-sm text-primary/65">
        Commerce summary sourced from order, cart, and wishlist activity
        endpoints.
      </p>

      {busy ? (
        <p className="mt-3 text-sm text-primary/65">Loading activity...</p>
      ) : null}

      {hasAnyError ? (
        <div className="mt-3 space-y-2">
          {hasOrdersError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              Orders:{" "}
              {extractMessage(ordersError, "Failed to load order activity")}
            </p>
          ) : null}
          {hasCartError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              Cart: {extractMessage(cartError, "Failed to load cart activity")}
            </p>
          ) : null}
          {hasWishlistError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              Wishlist:{" "}
              {extractMessage(
                wishlistError,
                "Failed to load wishlist activity",
              )}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric
          label="Orders"
          value={String(totalOrders)}
          hint={`${ongoingOrders} ongoing • ${completedOrders} completed`}
        />
        <Metric
          label="Cart Items"
          value={String(cartItemCount)}
          hint={`${cartShopCount} shop${cartShopCount === 1 ? "" : "s"} in cart`}
        />
        <Metric
          label="Wishlist Items"
          value={String(wishlistTotal)}
          hint={`${availableWishlistCount} currently available`}
        />
      </div>
    </section>
  );
}
