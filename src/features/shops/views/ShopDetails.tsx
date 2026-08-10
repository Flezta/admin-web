import { useState } from "react";
import { useParams } from "react-router-dom";
import ConfirmActionModal from "../../../components/ConfirmActionModal";
import BackLinkButton from "../../users/components/BackLinkButton";
import UserTile from "../../users/components/UserTile";
import {
  type Shop,
  type ShopAnalytics,
  type ShopStatus,
  type ShopVerificationStatus,
} from "../../../types/shop";
import {
  useGetShopAnalyticsQuery,
  useGetShopByShopIdQuery,
  useGetShopBankDetailsQuery,
  useGetShopPayoutRevenueHistoryQuery,
  useUpdateShopStatusMutation,
  useUpdateShopVerificationStatusMutation,
} from "../../../store/api/shopsApi";
import SectionCard from "../../../lib/components/SectionCard";
import ControlIcon from "../../../lib/icons/ControlIcon";
import StatCard from "../../../lib/components/StatCard";
import Badge from "../../../lib/components/Badge";
import {
  formatDate,
  formatMoney,
  getErrorMessage,
} from "../../../lib/utils/helpers";
import ControlGroup from "../../../lib/components/ControlGroup";
import ShopDetailsSkeleton from "../components/ShopDetailsSkeleton";
import RevenueTile from "../components/RevenueTile";
import RevenueTable from "../components/RevenueTable";

type ConfirmAction =
  | { kind: "status"; value: ShopStatus }
  | { kind: "verification"; value: ShopVerificationStatus };

function KeyValue({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.14em] text-primary/55">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-primary">{value}</p>
    </div>
  );
}

function shopStatusTone(status?: ShopStatus) {
  if (status === "active") return "success";
  if (status === "pending") return "warning";
  if (status === "suspended" || status === "rejected") return "danger";
  return "neutral";
}

function verificationTone(status?: ShopVerificationStatus) {
  if (status === "verified") return "success";
  if (status === "pending") return "warning";
  if (status === "rejected") return "danger";
  return "neutral";
}

function statusLabel(status?: string) {
  if (!status) return "Unknown";
  return status.replaceAll("_", " ").toLowerCase();
}

export default function ShopDetails() {
  const { shopId } = useParams<{ shopId: string }>();
  const {
    data: shop,
    isLoading: shopLoading,
    isFetching: shopFetching,
    error: shopError,
  } = useGetShopByShopIdQuery(shopId || "", { skip: !shopId });

  const {
    data: analytics,
    isLoading: analyticsLoading,
    isFetching: analyticsFetching,
    error: analyticsError,
  } = useGetShopAnalyticsQuery(shopId || "", { skip: !shopId });

  const {
    data: revenueHistory,
    isLoading: revenueHistoryLoading,
    isFetching: revenueHistoryFetching,
    error: revenueHistoryError,
  } = useGetShopPayoutRevenueHistoryQuery(
    { shopId: shopId || "", limit: 20, skip: 0 },
    { skip: !shopId },
  );

  const {
    data: bankDetails,
    isLoading: bankDetailsLoading,
    isFetching: bankDetailsFetching,
    error: bankDetailsError,
  } = useGetShopBankDetailsQuery(shopId || "", { skip: !shopId });

  const [updateShopStatus, { isLoading: updatingStatus }] =
    useUpdateShopStatusMutation();
  const [updateShopVerificationStatus, { isLoading: updatingVerification }] =
    useUpdateShopVerificationStatusMutation();

  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const requestError = getErrorMessage(shopError);
  const analyticsRequestError = getErrorMessage(analyticsError);
  const bankDetailsRequestError = getErrorMessage(bankDetailsError);
  const revenueHistoryRequestError = getErrorMessage(revenueHistoryError);

  const currentShop = shop as Shop | undefined;
  const currentAnalytics = analytics as ShopAnalytics | undefined;

  const busy = updatingStatus || updatingVerification;

  const confirmLabel = confirmAction
    ? confirmAction.kind === "status"
      ? `Set ${confirmAction.value}`
      : `Set ${confirmAction.value}`
    : "Confirm";

  const handleConfirm = async () => {
    if (!shopId || !confirmAction) return;

    try {
      setActionError(null);
      setActionSuccess(null);

      if (confirmAction.kind === "status") {
        await updateShopStatus({
          shopId,
          status: confirmAction.value,
        }).unwrap();
        setActionSuccess(`Shop status updated to ${confirmAction.value}.`);
      }

      if (confirmAction.kind === "verification") {
        await updateShopVerificationStatus({
          shopId,
          status: confirmAction.value,
        }).unwrap();
        setActionSuccess(
          `Verification status updated to ${confirmAction.value}.`,
        );
      }
    } catch (error) {
      setActionError(
        getErrorMessage(error) || "Unable to update shop settings right now.",
      );
    } finally {
      setConfirmAction(null);
    }
  };

  if (shopLoading) {
    return <ShopDetailsSkeleton />;
  }

  if (requestError || !currentShop) {
    return (
      <div className="space-y-4">
        <BackLinkButton to="/shops" label="Back to shops" />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {requestError || "Shop not found"}
        </div>
      </div>
    );
  }

  const revenue = currentAnalytics?.revenue;
  const orders = currentAnalytics?.orders;
  const payouts = currentAnalytics?.payouts;
  const topProducts = currentAnalytics?.topProducts ?? [];
  const verificationStatus = currentShop.idVerificationStatus || "unverified";

  return (
    <section className="space-y-5">
      <BackLinkButton to="/shops" label="Back to shops" />

      <div className="rounded-3xl border border-primary/10 bg-white p-4 shadow-[0_14px_30px_-24px_rgba(0,54,37,0.45)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                {currentShop.name}
              </h1>
              <Badge tone={shopStatusTone(currentShop.status)}>
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.08em] text-primary/60">
                    status
                  </p>
                  {currentShop.status || "pending"}
                </div>
              </Badge>
              <Badge tone={verificationTone(verificationStatus)}>
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.08em] text-primary/60">
                    verification
                  </p>
                  {verificationStatus || "unverified"}
                </div>
              </Badge>
            </div>
            <p className="mt-2 text-sm text-primary/70">
              Shop ID: {currentShop.shopId}
            </p>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-primary/65">
              {currentShop.description ||
                "No shop description is available yet."}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <StatCard
              label="Revenue"
              value={formatMoney(
                revenue?.total ?? 0,
                revenue?.currency || "NGN",
              )}
              hint="All-time delivered seller revenue"
            />
            <StatCard
              label="Orders"
              value={String(orders?.total ?? 0)}
              hint="All-time order count from analytics"
            />
          </div>
        </div>

        {(shopFetching || analyticsFetching) && (
          <p className="mt-4 text-sm text-primary/65">
            Refreshing shop data...
          </p>
        )}

        {(actionError || actionSuccess) && (
          <div className="mt-4 space-y-2">
            {actionError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {actionError}
              </p>
            ) : null}
            {actionSuccess ? (
              <p className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {actionSuccess}
              </p>
            ) : null}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pending payouts"
          value={formatMoney(
            payouts?.totalPendingNetAmount ?? 0,
            revenue?.currency || "NGN",
          )}
          hint="Net amount awaiting payout"
        />
        <StatCard
          label="Ready payouts"
          value={formatMoney(
            payouts?.totalReadyNetAmount ?? 0,
            revenue?.currency || "NGN",
          )}
          hint="Eligible for processing"
        />
        <StatCard
          label="Paid payouts"
          value={formatMoney(
            payouts?.totalPaidNetAmount ?? 0,
            revenue?.currency || "NGN",
          )}
          hint="Already paid out to seller"
        />
        <StatCard
          label="Top products"
          value={String(topProducts.length)}
          hint="Highest revenue products in this shop"
        />
      </div>
      <section className="overflow-hidden rounded-3xl border border-primary-dark/40 bg-[linear-gradient(150deg,#003625_0%,#0a4e39_60%,#0b3f2f_100%)] shadow-[0_20px_50px_-24px_rgba(0,54,37,0.55)]">
        <div className="flex items-center gap-2.5 border-b border-white/10 bg-black/10 px-4 py-3 sm:px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white">
            <ControlIcon />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Admin Controls</p>
            <p className="text-xs text-white/60">
              Changes apply immediately and are logged against this shop.
            </p>
          </div>
        </div>

        <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-2">
          <ControlGroup<ShopStatus>
            label="Shop Status"
            options={["pending", "active", "suspended", "rejected"]}
            activeValue={currentShop.status}
            busyValue={
              busy && confirmAction?.kind === "status"
                ? confirmAction.value
                : null
            }
            disabled={busy}
            toneFor={shopStatusTone}
            onSelect={(value) => setConfirmAction({ kind: "status", value })}
          />

          <ControlGroup<ShopVerificationStatus>
            label="Verification Status"
            options={["verified", "pending", "unverified", "rejected"]}
            activeValue={verificationStatus}
            busyValue={
              busy && confirmAction?.kind === "verification"
                ? confirmAction.value
                : null
            }
            disabled={busy}
            toneFor={verificationTone}
            onSelect={(value) =>
              setConfirmAction({ kind: "verification", value })
            }
          />
        </div>

        {(actionError || actionSuccess) && (
          <div className="space-y-2 px-4 pb-4 sm:px-5">
            {actionError ? (
              <p className="rounded-xl border border-red-300/40 bg-red-500/15 px-3 py-2 text-sm text-red-100">
                {actionError}
              </p>
            ) : null}
            {actionSuccess ? (
              <p className="rounded-xl border border-green-300/40 bg-green-500/15 px-3 py-2 text-sm text-green-100">
                {actionSuccess}
              </p>
            ) : null}
          </div>
        )}
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Shop Overview"
          description="Core profile and contact information for this shop."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <KeyValue label="Legal name" value={currentShop.legalName || "-"} />
            <KeyValue
              label="Created"
              value={formatDate(currentShop.createdAt)}
            />
            <KeyValue
              label="Updated"
              value={formatDate(currentShop.updatedAt)}
            />
            <KeyValue
              label="Contact email"
              value={currentShop.contactInfo?.contactEmail || "-"}
            />
            <KeyValue
              label="Contact phone"
              value={currentShop.contactInfo?.contactPhoneNumber || "-"}
            />
            <KeyValue
              label="Country"
              value={currentShop.address?.country || "-"}
            />
            <KeyValue label="State" value={currentShop.address?.state || "-"} />
            <KeyValue
              label="Address"
              value={currentShop.address?.address || "-"}
            />
            <KeyValue
              label="Zip code"
              value={currentShop.address?.zipCode || "-"}
            />
            <KeyValue
              label="Default hub"
              value={currentShop.defaultHandoverHubId || "Not set"}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Shop Owner"
          description="Primary user account linked to this shop."
        >
          {currentShop.ownerUser ? (
            <UserTile
              user={currentShop.ownerUser}
              showDisableRestoreButtons={false}
            />
          ) : (
            <p className="text-sm text-primary/65">
              No owner profile data was returned for this shop.
            </p>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Verification & Compliance"
          description="Document state and reminder metadata from the shop record."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <KeyValue label="Verification" value={verificationStatus} />
            <KeyValue
              label="Document type"
              value={currentShop.identificationDocument?.documentType || "-"}
            />
            <KeyValue
              label="Document number"
              value={currentShop.identificationDocument?.documentNumber || "-"}
            />
            <KeyValue
              label="Document expiry"
              value={formatDate(currentShop.identificationDocument?.expiresAt)}
            />
            <KeyValue
              label="Reminder sent for"
              value={
                currentShop.complianceMeta?.idUploadReminderSentForDate || "-"
              }
            />
            <KeyValue
              label="Reminder sent at"
              value={formatDate(
                currentShop.complianceMeta?.idUploadReminderSentAt,
              )}
            />
            <KeyValue
              label="Bank reminder for"
              value={
                currentShop.complianceMeta?.bankSetupReminderSentForDate || "-"
              }
            />
            <KeyValue
              label="Bank reminder at"
              value={formatDate(
                currentShop.complianceMeta?.bankSetupReminderSentAt,
              )}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-primary/10 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/55">
              Document URL
            </p>
            {currentShop.identificationDocument?.documentUrl?.link ? (
              <a
                href={currentShop.identificationDocument.documentUrl.link}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-sm font-semibold text-primary underline decoration-primary/35 underline-offset-4"
              >
                Open uploaded verification document
              </a>
            ) : (
              <p className="mt-2 text-sm text-primary/65">
                No document uploaded yet.
              </p>
            )}
          </div>
        </SectionCard>
        <SectionCard
          title="Bank Details"
          description="Dedicated payout information fetched from the admin payments endpoint."
        >
          {bankDetailsLoading || bankDetailsFetching ? (
            <p className="text-sm text-primary/65">Loading bank details...</p>
          ) : bankDetailsRequestError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {bankDetailsRequestError}
            </p>
          ) : bankDetails ? (
            <div className="grid gap-3 grid-cols-1">
              <KeyValue
                label="Account name"
                value={bankDetails.accountName || "-"}
              />
              <KeyValue label="Bank code" value={bankDetails.bankCode || "-"} />
              <KeyValue
                label="Account number"
                value={bankDetails.accountNumber || "-"}
              />
              <KeyValue
                label="Created"
                value={formatDate(bankDetails.createdAt)}
              />
            </div>
          ) : (
            <p className="text-sm text-primary/65">
              No bank details found for this shop.
            </p>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Orders Breakdown"
          description="Order activity grouped by status from analytics."
        >
          {orders ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Object.entries(orders.byStatus).map(([status, count]) => (
                <div
                  key={status}
                  className="rounded-2xl border border-primary/10 bg-white p-3"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-primary/55">
                    {statusLabel(status)}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    {count}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-primary/65">
              {analyticsLoading
                ? "Loading analytics..."
                : analyticsRequestError || "Failed to load shop analytics"}
            </p>
          )}
        </SectionCard>

        <SectionCard
          title="Top Products"
          description="Highest revenue items currently associated with the shop."
        >
          {topProducts.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-primary/5 text-left text-xs uppercase tracking-[0.14em] text-primary/65">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Qty sold</th>
                    <th className="px-4 py-3">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr
                      key={product.productId}
                      className="border-t border-primary/10"
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-primary">
                          {product.productName}
                        </p>
                        <p className="text-xs text-primary/60">
                          {product.productId}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-primary/75">
                        {product.quantitySold}
                      </td>
                      <td className="px-4 py-3 text-primary/75">
                        {formatMoney(
                          product.revenue,
                          revenue?.currency || "NGN",
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-primary/65">
              {analyticsLoading
                ? "Loading analytics..."
                : "No top products available."}
            </p>
          )}
        </SectionCard>
      </div>
      <SectionCard
        title="Revenue History"
        description="Time-series payout rows from the admin revenue endpoint."
      >
        {revenueHistoryLoading || revenueHistoryFetching ? (
          <p className="text-sm text-primary/65">Loading revenue history...</p>
        ) : revenueHistoryRequestError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {revenueHistoryRequestError}
          </p>
        ) : revenueHistory?.rows?.length ? (
          <>
            {/* Desktop / tablet table */}
            <div className="hidden overflow-hidden rounded-2xl border border-primary/10 bg-white sm:block">
              <RevenueTable
                rows={revenueHistory.rows}
                currency={revenue?.currency || "NGN"}
              />

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-primary/10 px-4 py-3 text-xs text-primary/60">
                <p>
                  Showing {revenueHistory.rows.length} of {revenueHistory.total}{" "}
                  rows
                </p>
                <p>
                  Page size {revenueHistory.limit} · offset{" "}
                  {revenueHistory.skip}
                </p>
              </div>
            </div>

            {/* Mobile tiles */}
            <div className="space-y-3 sm:hidden">
              {revenueHistory.rows.map((row) => (
                <RevenueTile
                  key={row.subOrderId}
                  row={row}
                  currency={revenue?.currency || "NGN"}
                />
              ))}

              <div className="flex items-center justify-between px-1 pt-1 text-xs text-primary/60">
                <p>
                  {revenueHistory.rows.length} of {revenueHistory.total}
                </p>
                <p>
                  Page{" "}
                  {Math.floor(revenueHistory.skip / revenueHistory.limit) + 1}
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-primary/65">
            No payout revenue rows found for this shop.
          </p>
        )}
      </SectionCard>

      <ConfirmActionModal
        isOpen={Boolean(confirmAction)}
        title={
          confirmAction?.kind === "status"
            ? "Confirm Shop Status"
            : "Confirm Verification Status"
        }
        message={
          confirmAction?.kind === "status"
            ? `Set shop status to ${confirmAction.value}?`
            : confirmAction
              ? `Set verification status to ${confirmAction.value}?`
              : ""
        }
        confirmLabel={confirmLabel}
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        confirmButtonClassName="rounded-lg border border-primary bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
      />
    </section>
  );
}
