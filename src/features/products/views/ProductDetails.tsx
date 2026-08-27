import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfirmActionModal from "../../../components/ConfirmActionModal";
import AlertMessage from "../../../lib/components/AlertMessage";
import Badge from "../../../lib/components/Badge";
import ControlGroup from "../../../lib/components/ControlGroup";
import KeyValue from "../../../lib/components/KeyValue";
import SectionCard from "../../../lib/components/SectionCard";
import StatCard from "../../../lib/components/StatCard";
import ControlIcon from "../../../lib/icons/ControlIcon";
import {
  formatDate,
  formatMoney,
  getErrorMessage,
  statusLabel,
} from "../../../lib/utils/helpers";
import {
  useGetNextProductInQueueQuery,
  useGetProductByProductIdQuery,
  useToggleProductDeletedMutation,
  useUpdateProductStatusMutation,
} from "../../../store/api/productsApi";
import type { ProductStatus } from "../../../types/product";
import BackLinkButton from "../../users/components/BackLinkButton";
import ProductAttributeList from "../components/ProductAttributeList";
import ProductDetailsSkeleton from "../components/ProductDetailsSkeleton";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductMediaCoverage from "../components/ProductMediaCoverage";
import ProductRejectionHistory from "../components/ProductRejectionHistory";
import ProductTimeline from "../components/ProductTimeline";
import ProductVariantsTable from "../components/ProductVariantsTable";
import RejectProductModal from "../components/RejectProductModal";
import WaitingBadge from "../components/WaitingBadge";
import {
  getPriceRange,
  getProductShop,
  getTotalStock,
  isSoldOut,
  productStatusTone,
} from "../utils/product.helpers";

type ConfirmAction =
  | { kind: "status"; value: ProductStatus }
  | { kind: "toggleDelete"; value: "delete" | "restore" };

const STATUS_OPTIONS: ProductStatus[] = [
  "draft",
  "under_review",
  "live",
  "rejected",
];

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    isFetching,
    error,
  } = useGetProductByProductIdQuery(productId || "", { skip: !productId });

  const inReview = product?.status === "under_review";

  const { data: queue } = useGetNextProductInQueueQuery(
    { status: "under_review", excludeProductId: productId },
    { skip: !productId || !inReview },
  );

  const [updateProductStatus, { isLoading: updatingStatus }] =
    useUpdateProductStatusMutation();
  const [toggleProductDeleted, { isLoading: togglingDelete }] =
    useToggleProductDeletedMutation();

  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null,
  );
  const [rejectOpen, setRejectOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [nextAfterDecision, setNextAfterDecision] = useState<string | null>(
    null,
  );

  const requestError = getErrorMessage(error);
  const busy = updatingStatus || togglingDelete;

  const resetMessages = () => {
    setActionError(null);
    setActionSuccess(null);
    setNextAfterDecision(null);
  };

  const goToNext = (targetProductId: string) => {
    setNextAfterDecision(null);
    setActionSuccess(null);
    navigate(`/products/${targetProductId}`);
  };

  const handleStatusSelect = (value: ProductStatus) => {
    resetMessages();
    if (value === "rejected") {
      setRejectOpen(true);
      return;
    }
    setConfirmAction({ kind: "status", value });
  };

  const handleReject = async (reasons: string[]) => {
    if (!productId) return;

    // Captured before the mutation, since approving refetches the queue.
    const queuedNext = queue?.productId ?? null;

    try {
      resetMessages();
      await updateProductStatus({
        productId,
        status: "rejected",
        rejectionReasons: reasons,
      }).unwrap();
      setActionSuccess("Product rejected and the seller has been notified.");
      setNextAfterDecision(queuedNext);
    } catch (rejectError) {
      setActionError(
        getErrorMessage(rejectError) || "Unable to reject this product.",
      );
    } finally {
      setRejectOpen(false);
    }
  };

  const handleApproveAndNext = async () => {
    if (!productId) return;

    const queuedNext = queue?.productId ?? null;

    try {
      resetMessages();
      await updateProductStatus({ productId, status: "live" }).unwrap();

      if (queuedNext) {
        goToNext(queuedNext);
        return;
      }

      setActionSuccess("Product approved. The review queue is now empty.");
    } catch (approveError) {
      setActionError(
        getErrorMessage(approveError) || "Unable to approve this product.",
      );
    }
  };

  const handleConfirm = async () => {
    if (!productId || !confirmAction) return;

    const queuedNext = queue?.productId ?? null;

    try {
      resetMessages();

      if (confirmAction.kind === "status") {
        await updateProductStatus({
          productId,
          status: confirmAction.value,
        }).unwrap();
        setActionSuccess(
          `Product status updated to ${statusLabel(confirmAction.value)}.`,
        );
        if (inReview) setNextAfterDecision(queuedNext);
      }

      if (confirmAction.kind === "toggleDelete") {
        await toggleProductDeleted({
          productId,
          action: confirmAction.value,
        }).unwrap();
        setActionSuccess(
          confirmAction.value === "delete"
            ? "Product removed from the marketplace."
            : "Product restored.",
        );
      }
    } catch (confirmError) {
      setActionError(
        getErrorMessage(confirmError) || "Unable to update this product.",
      );
    } finally {
      setConfirmAction(null);
    }
  };

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (requestError || !product) {
    return (
      <div className="space-y-4">
        <BackLinkButton to="/products" label="Back to products" />
        <AlertMessage
          tone="error"
          message={requestError || "Product not found"}
        />
      </div>
    );
  }

  const shop = getProductShop(product);
  const images = product.images ?? [];
  const variants = product.variants ?? [];
  const priceRange = getPriceRange(product);
  const totalStock = getTotalStock(product);
  const variantAxes = Object.keys(product.variantProperties ?? {});
  const outOfStockVariants = variants.filter(
    (variant) => (variant.stock || 0) === 0,
  ).length;
  const rejectionHistory = product.rejectionHistory ?? [];
  const isRepeatOffender = rejectionHistory.length >= 2;
  const soldOut = isSoldOut(product);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BackLinkButton to="/products" label="Back to products" />
        {inReview && queue ? (
          <p className="text-sm text-primary/60">
            {queue.remaining} more waiting in the review queue
          </p>
        ) : null}
      </div>

      <div className="rounded-3xl border border-primary/10 bg-white p-4 shadow-[0_14px_30px_-24px_rgba(0,54,37,0.45)] sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <ProductImageGallery images={images} />

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={productStatusTone(product.status)}>
                {statusLabel(product.status)}
              </Badge>
              {product.disabled ? <Badge tone="danger">deleted</Badge> : null}
              {product.isMockup ? <Badge>mockup</Badge> : null}
              {product.lastStage ? (
                <Badge>stage: {statusLabel(product.lastStage)}</Badge>
              ) : null}
              {inReview ? (
                <WaitingBadge
                  since={product.statusChangedAt}
                  label="in review"
                />
              ) : null}
              {isRepeatOffender ? (
                <Badge tone="warning">
                  rejected {rejectionHistory.length}x
                </Badge>
              ) : null}
              {product.status === "live" && soldOut ? (
                <Badge tone="warning">sold out</Badge>
              ) : null}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              {product.title}
            </h1>

            <p className="text-sm text-primary/70">
              {product.brandName || "No brand"} · {product.productId}
            </p>
            <p className="text-sm text-primary/55">
              {product.categoryPath || "Uncategorised"}
            </p>

            <p className="max-w-3xl text-sm leading-6 whitespace-pre-line text-primary/65">
              {product.description || "No description provided by the seller."}
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              <StatCard
                label="Price"
                value={
                  priceRange
                    ? priceRange.min === priceRange.max
                      ? formatMoney(priceRange.min)
                      : `${formatMoney(priceRange.min)} - ${formatMoney(priceRange.max)}`
                    : "Not priced"
                }
                hint={`${variants.length} variant${variants.length === 1 ? "" : "s"} saved`}
              />
              <StatCard
                label="Total stock"
                value={String(totalStock)}
                hint={
                  soldOut
                    ? "Every variant is at zero, so buyers cannot see it"
                    : `${outOfStockVariants} variant(s) out of stock`
                }
              />
            </div>

            {shop ? (
              <Link
                to={`/shops/${shop.shopId}`}
                className="inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5"
              >
                Seller: {shop.name || shop.shopId}
              </Link>
            ) : null}
          </div>
        </div>

        {isFetching ? (
          <p className="mt-4 text-sm text-primary/65">
            Refreshing product data...
          </p>
        ) : null}
      </div>

      {product.status === "live" && soldOut && !product.disabled ? (
        <AlertMessage
          tone="info"
          message="Every variant is out of stock, so this listing is hidden from browsing, search and recommendations. It stays live and returns automatically once the seller restocks."
        />
      ) : null}

      {inReview ? (
        <div className="flex flex-col gap-3 rounded-3xl border border-primary/15 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              This listing is waiting for a decision
            </p>
            <p className="mt-0.5 text-xs text-primary/60">
              Approving publishes it immediately and moves you to the next
              longest-waiting submission.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                resetMessages();
                setRejectOpen(true);
              }}
              className="cursor-pointer rounded-xl border border-red-300 bg-white px-3.5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reject
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={handleApproveAndNext}
              className="cursor-pointer rounded-xl border border-primary bg-primary px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updatingStatus
                ? "Approving..."
                : queue?.productId
                  ? "Approve & next"
                  : "Approve"}
            </button>
          </div>
        </div>
      ) : null}

      {nextAfterDecision ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-primary/15 bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-primary/70">
            Decision saved. Continue with the next item in the queue.
          </p>
          <button
            type="button"
            onClick={() => goToNext(nextAfterDecision)}
            className="cursor-pointer rounded-xl border border-primary bg-primary px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Next in queue
          </button>
        </div>
      ) : null}

      {product.status === "rejected" && product.rejectionReasons?.length ? (
        <SectionCard
          title="Rejection Reasons"
          description="Notes shared with the seller during the last review."
        >
          <ul className="list-inside list-disc space-y-1 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {product.rejectionReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </SectionCard>
      ) : null}

      <section className="overflow-hidden rounded-3xl border border-primary-dark/40 bg-[linear-gradient(150deg,#003625_0%,#0a4e39_60%,#0b3f2f_100%)] shadow-[0_20px_50px_-24px_rgba(0,54,37,0.55)]">
        <div className="flex items-center gap-2.5 border-b border-white/10 bg-black/10 px-4 py-3 sm:px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white">
            <ControlIcon />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Admin Controls</p>
            <p className="text-xs text-white/60">
              Moderation only. Product content is managed by the seller.
            </p>
          </div>
        </div>

        <div className="grid gap-6 p-4 sm:p-5 md:grid-cols-2">
          <ControlGroup<ProductStatus>
            label="Listing Status"
            options={STATUS_OPTIONS}
            activeValue={product.status}
            busyValue={
              busy && confirmAction?.kind === "status"
                ? confirmAction.value
                : null
            }
            disabled={busy}
            toneFor={productStatusTone}
            onSelect={handleStatusSelect}
          />

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
              Marketplace Availability
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={busy || Boolean(product.disabled)}
                onClick={() => {
                  resetMessages();
                  setConfirmAction({ kind: "toggleDelete", value: "delete" });
                }}
                className="cursor-pointer rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white transition hover:border-white/45 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Remove listing
              </button>
              <button
                type="button"
                disabled={busy || !product.disabled}
                onClick={() => {
                  resetMessages();
                  setConfirmAction({ kind: "toggleDelete", value: "restore" });
                }}
                className="cursor-pointer rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white transition hover:border-white/45 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Restore listing
              </button>
            </div>
            <p className="mt-2.5 text-xs text-white/55">
              Removing hides the listing from buyers and seller catalogues
              without deleting its history.
            </p>
          </div>
        </div>

        {actionError || actionSuccess ? (
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
        ) : null}
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Listing Overview"
          description="Catalogue metadata captured during the seller's submission."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <KeyValue label="Product ID" value={product.productId} />
            <KeyValue label="Brand" value={product.brandName || "-"} />
            <KeyValue label="Brand slug" value={product.brandSlug || "-"} />
            <KeyValue
              label="Category path"
              value={product.categoryPath || "-"}
            />
            <KeyValue
              label="Multiple variants"
              value={product.hasMultipleVariants ? "Yes" : "No"}
            />
            <KeyValue label="Images" value={String(images.length)} />
            <KeyValue label="Created" value={formatDate(product.createdAt)} />
            <KeyValue label="Updated" value={formatDate(product.updatedAt)} />
            <KeyValue
              label="Last stage"
              value={statusLabel(product.lastStage)}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Seller"
          description="Shop that owns and maintains this listing."
        >
          {shop ? (
            <div className="grid gap-3">
              <KeyValue label="Shop name" value={shop.name || "-"} />
              <KeyValue label="Shop ID" value={shop.shopId} />
              <KeyValue label="Shop status" value={statusLabel(shop.status)} />
              <KeyValue
                label="ID verification"
                value={statusLabel(shop.idVerificationStatus)}
              />
              <KeyValue
                label="Contact email"
                value={shop.contactInfo?.contactEmail || "-"}
              />
              <Link
                to={`/products?shopId=${shop.shopId}&tab=all`}
                className="inline-flex justify-center rounded-xl border border-primary/20 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5"
              >
                View all listings from this shop
              </Link>
            </div>
          ) : (
            <p className="text-sm text-primary/65">
              No shop record was returned with this product.
            </p>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Product Attributes"
          description="Non-variant category properties supplied by the seller."
        >
          <ProductAttributeList
            attributes={product.properties}
            emptyLabel="No category properties were provided."
          />
        </SectionCard>

        <SectionCard
          title="Variant Options"
          description="Axes the seller used to build variant combinations."
        >
          <ProductAttributeList
            attributes={product.variantProperties}
            emptyLabel="This product has no variant axes."
          />
        </SectionCard>
      </div>

      <SectionCard
        title="Media Coverage"
        description="Image count per variant option, so gaps are easy to spot before approving."
      >
        <ProductMediaCoverage product={product} />
      </SectionCard>

      <SectionCard
        title="Variants & Inventory"
        description="SKU level pricing and stock for this listing."
      >
        <ProductVariantsTable variants={variants} axes={variantAxes} />
      </SectionCard>

      <SectionCard
        title="Rejection History"
        description={
          isRepeatOffender
            ? `This listing has been rejected ${rejectionHistory.length} times. Consider escalating instead of re-reviewing.`
            : "Every rejection ever issued, kept after the seller resubmits."
        }
      >
        <ProductRejectionHistory records={rejectionHistory} />
      </SectionCard>

      <SectionCard
        title="Activity Timeline"
        description="Every workflow and moderation action recorded on this product."
      >
        <ProductTimeline entries={product.timeLine ?? []} />
      </SectionCard>

      <ConfirmActionModal
        isOpen={Boolean(confirmAction)}
        title={
          confirmAction?.kind === "status"
            ? "Confirm Listing Status"
            : "Confirm Availability Change"
        }
        message={
          confirmAction?.kind === "status"
            ? `Set listing status to ${statusLabel(confirmAction.value)}?`
            : confirmAction
              ? confirmAction.value === "delete"
                ? "Remove this listing from the marketplace?"
                : "Restore this listing to the marketplace?"
              : ""
        }
        confirmLabel={busy ? "Working..." : "Confirm"}
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
      />

      <RejectProductModal
        isOpen={rejectOpen}
        productTitle={product.title}
        submitting={updatingStatus}
        onCancel={() => setRejectOpen(false)}
        onConfirm={handleReject}
      />
    </section>
  );
}
