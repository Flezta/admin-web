import type {
  ShopBankDetails,
  Shop,
  ShopAnalytics,
  ShopPayoutRevenueHistory,
  ShopStatus,
  ShopVerificationStatus,
} from "../../types/shop";
import { baseApi } from "./baseApi";
import { normalizeApiError, unwrapApiData } from "./responseTransformers";

export const shopsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShops: builder.query<Shop[], { status?: ShopStatus | "all" } | void>({
      query: (args) => {
        const status = args && "status" in args ? args.status : undefined;
        return {
          url: "/shops",
          params: status && status !== "all" ? { status } : undefined,
        };
      },
      transformResponse: unwrapApiData<Shop[]>,
      transformErrorResponse: normalizeApiError,
      providesTags: (result) => [
        { type: "Shops", id: "LIST" },
        ...(result ?? []).map((shop) => ({
          type: "Shop" as const,
          id: shop.shopId,
        })),
      ],
    }),
    getShopByShopId: builder.query<Shop, string>({
      query: (shopId) => `/shops/${shopId}`,
      transformResponse: unwrapApiData<Shop>,
      transformErrorResponse: normalizeApiError,
      providesTags: (_result, _error, shopId) => [{ type: "Shop", id: shopId }],
    }),
    getShopAnalytics: builder.query<ShopAnalytics, string>({
      query: (shopId) => `/shops/${shopId}/analytics`,
      transformResponse: unwrapApiData<ShopAnalytics>,
      transformErrorResponse: normalizeApiError,
      providesTags: (_result, _error, shopId) => [{ type: "Shop", id: shopId }],
    }),
    getShopBankDetails: builder.query<ShopBankDetails | null, string>({
      query: (shopId) => `/payments/admin/shops/${shopId}/bank-details`,
      transformResponse: unwrapApiData<ShopBankDetails | null>,
      transformErrorResponse: normalizeApiError,
      providesTags: (_result, _error, shopId) => [{ type: "Shop", id: shopId }],
    }),
    getShopPayoutRevenueHistory: builder.query<
      ShopPayoutRevenueHistory,
      { shopId: string; payoutStatus?: string; limit?: number; skip?: number }
    >({
      query: ({ shopId, payoutStatus, limit = 20, skip = 0 }) => ({
        url: `/admin/shops/${shopId}/payouts/revenue`,
        params: {
          ...(payoutStatus ? { payoutStatus } : {}),
          limit,
          skip,
        },
      }),
      transformResponse: unwrapApiData<ShopPayoutRevenueHistory>,
      transformErrorResponse: normalizeApiError,
      providesTags: (_result, _error, arg) => [
        { type: "Shop", id: arg.shopId },
      ],
    }),
    updateShopStatus: builder.mutation<
      Shop,
      { shopId: string; status: ShopStatus }
    >({
      query: ({ shopId, status }) => ({
        url: `/shops/${shopId}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: unwrapApiData<Shop>,
      transformErrorResponse: normalizeApiError,
      invalidatesTags: (_result, _error, arg) => [
        { type: "Shop", id: arg.shopId },
        { type: "Shops", id: "LIST" },
      ],
    }),
    updateShopVerificationStatus: builder.mutation<
      { shopId: string; status: ShopVerificationStatus },
      { shopId: string; status: ShopVerificationStatus }
    >({
      query: ({ shopId, status }) => ({
        url: `/shops/${shopId}/verify-status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: unwrapApiData<{
        shopId: string;
        status: ShopVerificationStatus;
      }>,
      transformErrorResponse: normalizeApiError,
      invalidatesTags: (_result, _error, arg) => [
        { type: "Shop", id: arg.shopId },
        { type: "Shops", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetShopsQuery,
  useGetShopByShopIdQuery,
  useGetShopAnalyticsQuery,
  useGetShopBankDetailsQuery,
  useGetShopPayoutRevenueHistoryQuery,
  useUpdateShopStatusMutation,
  useUpdateShopVerificationStatusMutation,
} = shopsApi;
