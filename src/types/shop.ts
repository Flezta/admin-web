import type { User } from "./user";

export type ShopStatus = "pending" | "active" | "suspended" | "rejected";

export interface ShopAddress {
  country?: string;
  state?: string;
  address?: string;
  zipCode?: string;
}

export interface ShopContactInfo {
  contactEmail?: string;
  contactPhoneNumber?: string;
}

export interface ShopIdentificationDocument {
  documentType?: string;
  documentNumber?: string;
  documentUrl?: {
    link?: string;
    name?: string;
    filetype?: string;
  };
  expiresAt?: string;
}

export interface ShopComplianceMeta {
  idUploadReminderSentForDate?: string;
  idUploadReminderSentAt?: string;
  bankSetupReminderSentForDate?: string;
  bankSetupReminderSentAt?: string;
}

export interface ShopBankDetails {
  shop?: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ShopPayoutStatus =
  | "PENDING"
  | "READY"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "ON_HOLD";

export interface ShopPayoutRevenueItem {
  itemId: string;
  title: string;
  quantity: number;
  amount: number;
  status: ShopPayoutStatus;
  paidAt?: string;
}

export interface ShopPayoutRevenueRow {
  orderId: string;
  subOrderId: string;
  shopId: string;
  items: ShopPayoutRevenueItem[];
  amount: number;
  status: ShopPayoutStatus | "MIXED";
  paidAt?: string;
  updatedAt: string;
}

export interface ShopPayoutRevenueHistory {
  rows: ShopPayoutRevenueRow[];
  total: number;
  limit: number;
  skip: number;
}

export interface Shop {
  _id: string;
  shopId: string;
  owner?: string;
  name: string;
  description?: string;
  legalName?: string;
  address?: ShopAddress;
  contactInfo?: ShopContactInfo;
  status?: ShopStatus;
  idVerificationStatus?: "verified" | "unverified" | "pending" | "rejected";
  identificationDocument?: ShopIdentificationDocument;
  complianceMeta?: ShopComplianceMeta;
  bankDetailsId?: string;
  defaultHandoverHubId?: string;
  ownerUser?: User | null;
  createdAt?: string;
  updatedAt?: string;
}

export type ShopVerificationStatus =
  | "verified"
  | "unverified"
  | "pending"
  | "rejected";

export interface ShopAnalyticsTopProduct {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface ShopAnalyticsPayouts {
  totalItems: number;
  totalGrossAmount: number;
  totalPlatformCommissionAmount: number;
  totalSellerNetAmount: number;
  totalPendingNetAmount: number;
  totalReadyNetAmount: number;
  totalProcessingNetAmount: number;
  totalPaidNetAmount: number;
  totalFailedNetAmount: number;
  totalOnHoldNetAmount: number;
  statusCounts: Record<
    "PENDING" | "READY" | "PROCESSING" | "PAID" | "FAILED" | "ON_HOLD",
    number
  >;
}

export interface ShopAnalytics {
  revenue: {
    total: number;
    currency: string;
  };
  orders: {
    total: number;
    byStatus: Record<string, number>;
  };
  topProducts: ShopAnalyticsTopProduct[];
  payouts: ShopAnalyticsPayouts;
}
