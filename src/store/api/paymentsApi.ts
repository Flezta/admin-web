import type {
  BuyerPayment,
  EligibleVendorPayout,
  ManualPaymentInput,
  ManualVendorPayment,
  PaymentFilters,
  PaymentPage,
} from "../../types/payment";
import { baseApi } from "./baseApi";
import { normalizeApiError, unwrapApiData } from "./responseTransformers";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBuyerPayments: builder.query<PaymentPage<BuyerPayment>, PaymentFilters>({
      query: (params) => ({ url: "/admin/payments/buyers", params }),
      transformResponse: unwrapApiData<PaymentPage<BuyerPayment>>,
      transformErrorResponse: normalizeApiError,
      providesTags: ["Payments"],
    }),
    getBuyerPayment: builder.query<BuyerPayment, string>({
      query: (reference) =>
        `/admin/payments/buyers/${encodeURIComponent(reference)}`,
      transformResponse: unwrapApiData<BuyerPayment>,
      transformErrorResponse: normalizeApiError,
      providesTags: ["Payments"],
    }),
    recheckBuyerPayment: builder.mutation<BuyerPayment, string>({
      query: (reference) => ({
        url: `/admin/payments/buyers/${encodeURIComponent(reference)}/verify`,
        method: "POST",
        body: { acknowledged: true },
      }),
      transformResponse: unwrapApiData<BuyerPayment>,
      transformErrorResponse: normalizeApiError,
      invalidatesTags: ["Payments", "Orders"],
    }),
    getEligibleVendorPayouts: builder.query<
      PaymentPage<EligibleVendorPayout>,
      PaymentFilters
    >({
      query: (params) => ({
        url: "/admin/payments/vendor-eligibility",
        params,
      }),
      transformResponse: unwrapApiData<PaymentPage<EligibleVendorPayout>>,
      transformErrorResponse: normalizeApiError,
      providesTags: ["Payments", "Orders"],
    }),
    getManualVendorPayments: builder.query<
      PaymentPage<ManualVendorPayment>,
      PaymentFilters
    >({
      query: (params) => ({ url: "/admin/payments/vendors", params }),
      transformResponse: unwrapApiData<PaymentPage<ManualVendorPayment>>,
      transformErrorResponse: normalizeApiError,
      providesTags: ["Payments"],
    }),
    getManualVendorPayment: builder.query<ManualVendorPayment, string>({
      query: (recordId) =>
        `/admin/payments/vendors/${encodeURIComponent(recordId)}`,
      transformResponse: unwrapApiData<ManualVendorPayment>,
      transformErrorResponse: normalizeApiError,
      providesTags: ["Payments"],
    }),
    recordManualVendorPayment: builder.mutation<
      ManualVendorPayment,
      ManualPaymentInput
    >({
      query: (body) => ({
        url: "/admin/payments/vendors",
        method: "POST",
        body,
      }),
      transformResponse: unwrapApiData<ManualVendorPayment>,
      transformErrorResponse: normalizeApiError,
      invalidatesTags: ["Payments", "Orders", "Shop", "Shops", "User"],
    }),
  }),
});
export const {
  useRecheckBuyerPaymentMutation,
  useGetBuyerPaymentsQuery,
  useGetBuyerPaymentQuery,
  useGetEligibleVendorPayoutsQuery,
  useGetManualVendorPaymentsQuery,
  useGetManualVendorPaymentQuery,
  useRecordManualVendorPaymentMutation,
} = paymentsApi;
