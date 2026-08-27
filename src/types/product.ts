export type ProductStatus = "draft" | "under_review" | "live" | "rejected";

export type ProductStatusFilter =
  | ProductStatus
  | "all"
  | "disabled"
  | "sold_out";

export type ProductStage =
  | "basicInfo"
  | "categoryProperties"
  | "variantProperties"
  | "productImages"
  | "variants"
  | "submitted";

export type ProductSort =
  | "newest"
  | "oldest"
  | "recently_updated"
  | "title_asc"
  | "longest_waiting";

export interface ProductImageSizes {
  thumbnail: string;
  medium: string;
  large: string;
}

export interface ProductImage {
  name: string;
  sizes: ProductImageSizes;
  isDefault?: boolean;
  attributes?: Record<string, string>;
}

export interface ProductVariant {
  sku: string;
  price: number;
  stock: number;
  attributes?: Record<string, string>;
}

export interface ProductShopSummary {
  _id: string;
  shopId: string;
  name?: string;
  status?: string;
  idVerificationStatus?: string;
  contactInfo?: {
    contactEmail?: string;
    contactPhoneNumber?: string;
  };
}

export interface ProductTimelineActor {
  _id?: string;
  uid?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

export interface ProductTimelineEntry {
  date: string;
  description: string;
  actionBy?: ProductTimelineActor | string | null;
  metadata?: Record<string, unknown>;
}

// Admin-only audit trail; kept after the seller-facing reasons are cleared.
export interface ProductRejectionRecord {
  reasons: string[];
  rejectedAt: string;
  rejectedBy?: ProductTimelineActor | string | null;
  resolvedAt?: string;
  resolvedStatus?: "draft" | "under_review" | "live";
}

export interface Product {
  _id: string;
  productId: string;
  title: string;
  description?: string;
  brandName?: string;
  brandSlug?: string;
  shop?: ProductShopSummary | string;
  status: ProductStatus;
  disabled?: boolean;
  hasMultipleVariants?: boolean;
  lastStage?: ProductStage;
  category?: string;
  categoryPath?: string;
  properties?: Record<string, string[] | string>;
  variantProperties?: Record<string, string[]>;
  images?: ProductImage[];
  variants?: ProductVariant[];
  timeLine?: ProductTimelineEntry[];
  rejectionReasons?: string[];
  rejectionHistory?: ProductRejectionRecord[];
  statusChangedAt?: string;
  isMockup?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductStatusCounts {
  draft: number;
  under_review: number;
  live: number;
  rejected: number;
  all: number;
  disabled: number;
  soldOut: number;
}

export interface ProductListResponse {
  data: Product[];
  meta: ProductListMeta;
  counts: ProductStatusCounts;
}

export interface ProductListQuery {
  page?: number;
  limit?: number;
  status?: ProductStatus | "all";
  disabled?: "true" | "false" | "all";
  shopId?: string;
  brand?: string;
  categoryId?: string;
  search?: string;
  sort?: ProductSort;
  stock?: "sold_out" | "in_stock";
}

export interface ProductStatusChangeResult {
  productId: string;
  previousStatus: ProductStatus;
  currentStatus: ProductStatus;
}

export interface ProductToggleDeleteResult {
  product_id: string;
  disabled: boolean;
  lastStage?: ProductStage;
}

export interface ProductQueueNext {
  productId: string | null;
  title: string | null;
  remaining: number;
}
