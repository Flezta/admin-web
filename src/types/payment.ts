export interface PaymentPage<Row> {
  rows: Row[];
  total: number;
  limit: number;
  skip: number;
}
export interface BuyerPayment {
  buyerId?: string;
  buyerUid?: string;
  paystackReference: string;
  buyerEmail: string;
  status: string;
  amountInNaira: number;
  currency: string;
  orderId?: string;
  orderCreationStatus: string;
  orderCreationFailureReason?: string;
  failureReason?: string;
  paidAt?: string;
  createdAt: string;
  verifiedAt?: string;
  verificationMethod?: string;
  itemsSubtotal?: number;
  deliveryFee?: number;
  channel?: string;
  feesInKobo?: number | null;
  gatewayResponse?: string;
  refunds?: Array<{
    refundReference: string;
    amount: number;
    reason: string;
    status: string;
    createdAt: string;
    completedAt?: string;
  }>;
  subOrders?: Array<{
    subOrderId: string;
    orderId: string;
    shopId: string;
    status: string;
    item: {
      productName?: string;
      sellerPayout: { status: string; manualPaymentId?: string };
    };
  }>;
}
export interface EligibleVendorPayout {
  subOrderId: string;
  orderId: string;
  shopId: string;
  shopName: string;
  productName: string;
  deliveredAt: string;
  eligibleAt: string;
  grossInKobo: number;
  commissionInKobo: number;
  netInKobo: number;
}
export interface ManualVendorPayment {
  recordId: string;
  shopId: string;
  shopName: string;
  amountInKobo: number;
  currency: string;
  status: "PAID";
  paidAt: string;
  reference: string;
  method: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  recordedBy: { uid: string; name: string };
  bankSnapshot?: {
    bankCode: string;
    accountName: string;
    accountNumber: string;
  };
  lines?: Array<{
    subOrderId: string;
    orderId: string;
    grossInKobo: number;
    commissionInKobo: number;
    netInKobo: number;
  }>;
  history?: Array<{
    eventId: string;
    action: string;
    actor: { uid: string; name: string };
    occurredAt: string;
    reason?: string;
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  }>;
}
export interface PaymentFilters {
  search?: string;
  status?: string;
  buyerId?: string;
  orderId?: string;
  shopId?: string;
  from?: string;
  to?: string;
  attention?: string;
  limit?: number;
  skip?: number;
}
export interface ManualPaymentInput {
  shopId: string;
  subOrderIds: string[];
  amountInKobo: number;
  paidAt: string;
  reference: string;
  method: string;
  notes?: string;
  requestKey: string;
  acknowledged: boolean;
}
