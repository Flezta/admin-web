export const FULFILMENT_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "READY_FOR_QA",
  "QA_IN_PROGRESS",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "FULFILLMENT_REJECTION",
  "FULFILLMENT_EXCEPTION",
] as const;
export type FulfilmentStatus = (typeof FULFILMENT_STATUSES)[number];

export interface LogisticsHub {
  id: string;
  name: string;
  city: string;
  address: string;
  coordinate: { lat: number; lng: number };
  timeZone: string;
}

export interface HandoverTimeSlots {
  timeZone: string;
  today: string;
  date: string | null;
  slots: Array<{ value: string; label: string; startsAt: string | null }>;
}

export interface OrderAction {
  value: FulfilmentStatus;
  actor: "seller" | "admin" | "hub-admin" | "buyer-seller";
  callToAction: string;
}

export interface OrderTimelineEvent {
  eventId: string;
  action:
    | "ORDER_PLACED"
    | "STATUS_CHANGED"
    | "HANDOVER_UPDATED"
    | "STATUS_CORRECTED"
    | "REOPENED";
  fromStatus: FulfilmentStatus | null;
  toStatus: FulfilmentStatus;
  occurredAt: string;
  reason?: string;
  stockEffect?: "RESERVED" | "RELEASED" | "NONE";
  effectsAcknowledged?: boolean;
  actor?: {
    userId?: string;
    uid?: string;
    name: string;
    role: "SYSTEM" | "BUYER" | "SELLER" | "ADMIN" | "SUPER_ADMIN" | "HUB_ADMIN";
    hubId?: string;
  };
  handoverBefore?: {
    hubId: string;
    hubName: string;
    handoverDate: string;
    handoverTime: string;
  };
  handoverAfter?: {
    hubId: string;
    hubName: string;
    handoverDate: string;
    handoverTime: string;
  };
}

export interface OperationalSubOrder {
  subOrderId: string;
  orderId: string;
  shopId: string;
  buyerEmail?: string;
  status: FulfilmentStatus;
  createdAt: string;
  adminHandover?: {
    hubId: string;
    hubName: string;
    handoverDate: string;
    handoverTime: string;
  };
  item: {
    itemType: "single" | "bundle";
    productId?: string;
    productName?: string;
    sku?: string;
    bundleId?: string;
    imageUrl?: string;
    quantity: number;
    price?: number;
    subtotal?: number;
    components?: Array<{
      productId: string;
      productTitle: string;
      imageUrl: string;
      requiredQuantity: number;
    }>;
    sellerPayout?: {
      status: string;
      sellerNetAmount: number;
      platformCommissionAmount: number;
      manualPaymentId?: string;
    };
  };
  allowedActions: OrderAction[];
  correctionStatuses?: FulfilmentStatus[];
  reopenStatuses?: FulfilmentStatus[];
  timeline: {
    timeline: OrderTimelineEvent[];
  };
}

export interface OperationalOrder {
  orderId: string;
  subOrderId?: string;
  buyerEmail?: string;
  createdAt: string;
  totalAmount?: number;
  itemsSubtotal?: number;
  deliveryFee?: number;
  paymentReference?: string;
  vendorPayments?: Array<{ recordId: string; shopId: string; shopName: string; amountInKobo: number; paidAt: string; reference: string; status: string }>;
  currency?: string;
  deliveryDetails?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    region?: string;
    country?: string;
  };
  subOrders: OperationalSubOrder[];
}

export interface OrderFilters {
  hubOnly: boolean;
  view?: "all" | "attention";
  search?: string;
  status?: string;
  shopId?: string;
  hubId?: string;
  from?: string;
  to?: string;
  limit?: number;
  skip?: number;
}
