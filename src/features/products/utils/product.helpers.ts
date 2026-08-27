import type { Tone } from "../../../lib/utils/constants";
import type {
  Product,
  ProductImage,
  ProductShopSummary,
  ProductStatus,
  ProductTimelineActor,
} from "../../../types/product";

export function productStatusTone(status?: ProductStatus): Tone {
  if (status === "live") return "success";
  if (status === "under_review") return "warning";
  if (status === "rejected") return "danger";
  return "neutral";
}

export function getDefaultImage(product: Product): ProductImage | undefined {
  const images = product.images ?? [];
  return images.find((image) => image.isDefault) || images[0];
}

export function getPriceRange(product: Product) {
  const prices = (product.variants ?? [])
    .map((variant) => variant.price)
    .filter((price) => typeof price === "number");

  if (prices.length === 0) return null;

  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getTotalStock(product: Product) {
  return (product.variants ?? []).reduce(
    (total, variant) => total + (variant.stock || 0),
    0,
  );
}

// Mirrors the API: sold out only once every variant is at zero.
export function isSoldOut(product: Product) {
  const variants = product.variants ?? [];
  return (
    variants.length > 0 &&
    variants.every((variant) => (variant.stock || 0) <= 0)
  );
}

export function getProductShop(
  product?: Product,
): ProductShopSummary | undefined {
  const shop = product?.shop;
  return shop && typeof shop === "object" ? shop : undefined;
}

export function getActorName(actor?: ProductTimelineActor | string | null) {
  if (!actor) return "System";
  if (typeof actor === "string") return actor;

  const fullName = [actor.firstName, actor.lastName].filter(Boolean).join(" ");
  return fullName || actor.userName || actor.email || actor.uid || "System";
}

// Property/variant values are stored as string or string[] on the product doc.
export function toValueList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (value === null || value === undefined || value === "") return [];
  return [String(value)];
}

const COLOR_KEYS = ["color", "Color", "colour", "Colour"];

// Images are tagged with the variant axis they belong to, usually colour.
export function resolveImageAxisKey(images: ProductImage[]): string | null {
  const keys = new Set<string>();
  images.forEach((image) => {
    Object.keys(image.attributes ?? {}).forEach((key) => keys.add(key));
  });

  const colorKey = COLOR_KEYS.find((key) => keys.has(key));
  return colorKey || [...keys][0] || null;
}

export interface ProductImageGroup {
  value: string;
  images: ProductImage[];
}

export function groupImagesByAxis(
  images: ProductImage[],
  axisKey: string | null,
): ProductImageGroup[] {
  if (!axisKey) return [];

  const groups = new Map<string, ProductImage[]>();

  images.forEach((image) => {
    const value = image.attributes?.[axisKey];
    if (!value) return;
    groups.set(value, [...(groups.get(value) ?? []), image]);
  });

  return [...groups.entries()].map(([value, groupImages]) => ({
    value,
    images: groupImages,
  }));
}
