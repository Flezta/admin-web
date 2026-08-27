import { Link } from "react-router-dom";
import Badge from "../../../lib/components/Badge";
import {
  formatDate,
  formatMoney,
  statusLabel,
} from "../../../lib/utils/helpers";
import type { Product } from "../../../types/product";
import {
  getDefaultImage,
  getPriceRange,
  getProductShop,
  getTotalStock,
  groupImagesByAxis,
  isSoldOut,
  productStatusTone,
  resolveImageAxisKey,
} from "../utils/product.helpers";
import WaitingBadge from "./WaitingBadge";

function PlaceholderThumb() {
  return (
    <div className="grid h-full w-full place-items-center bg-primary/5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/40">
      No image
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const image = getDefaultImage(product);
  const priceRange = getPriceRange(product);
  const stock = getTotalStock(product);
  const soldOut = isSoldOut(product);
  const shop = getProductShop(product);
  const variantCount = product.variants?.length ?? 0;

  const images = product.images ?? [];
  const imageGroups = groupImagesByAxis(images, resolveImageAxisKey(images));

  return (
    <Link
      to={`/products/${product.productId}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-[0_14px_30px_-26px_rgba(0,54,37,0.5)] transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_20px_36px_-24px_rgba(0,54,37,0.55)]"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-primary/5">
        {image ? (
          <img
            src={image.sizes?.medium || image.sizes?.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <PlaceholderThumb />
        )}

        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          <Badge tone={productStatusTone(product.status)}>
            {statusLabel(product.status)}
          </Badge>
          {product.disabled ? <Badge tone="danger">deleted</Badge> : null}
          {product.status === "live" && soldOut ? (
            <Badge tone="warning">sold out</Badge>
          ) : null}
        </div>

        {product.isMockup ? (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-primary/85 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
            mockup
          </span>
        ) : null}

        {imageGroups.length > 1 ? (
          <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1">
            {imageGroups.slice(0, 4).map((group) => (
              <span
                key={group.value}
                title={`${group.value}: ${group.images.length} image(s)`}
                className="rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold capitalize text-primary/75 backdrop-blur-sm"
              >
                {group.value}
              </span>
            ))}
            {imageGroups.length > 4 ? (
              <span className="rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold text-primary/75 backdrop-blur-sm">
                +{imageGroups.length - 4}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div>
          <p className="line-clamp-2 text-sm font-semibold leading-5 text-primary">
            {product.title}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-primary/45">
            {product.brandName || "No brand"} · {product.productId}
          </p>
        </div>

        <p className="line-clamp-1 text-xs text-primary/55">
          {product.categoryPath || "Uncategorised"}
        </p>

        <div className="mt-auto space-y-2 border-t border-primary/10 pt-2.5">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-primary/45">
                Price
              </p>
              <p className="text-sm font-bold text-primary">
                {priceRange
                  ? priceRange.min === priceRange.max
                    ? formatMoney(priceRange.min)
                    : `${formatMoney(priceRange.min)} - ${formatMoney(priceRange.max)}`
                  : "Not priced"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.12em] text-primary/45">
                Stock
              </p>
              <p
                className={`text-sm font-bold ${stock > 0 ? "text-primary" : "text-red-600"}`}
              >
                {stock}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-[11px] text-primary/55">
            <span className="line-clamp-1">{shop?.name || "Unknown shop"}</span>
            <span className="shrink-0">
              {variantCount} variant{variantCount === 1 ? "" : "s"}
              {imageGroups.length > 1 ? ` · ${imageGroups.length} options` : ""}
            </span>
          </div>

          <p className="text-[11px] text-primary/45">
            Updated {formatDate(product.updatedAt)}
          </p>

          {product.status === "under_review" ? (
            <WaitingBadge since={product.statusChangedAt} label="in review" />
          ) : null}
        </div>
      </div>
    </Link>
  );
}
