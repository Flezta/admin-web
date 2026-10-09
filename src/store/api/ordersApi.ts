import type {
  FulfilmentStatus,
  LogisticsHub,
  HandoverTimeSlots,
  OperationalOrder,
  OperationalSubOrder,
  OrderFilters,
} from "../../types/order";
import { baseApi } from "./baseApi";
import {
  normalizeApiError,
  unwrapApiData,
  type ApiResponseEnvelope,
} from "./responseTransformers";

interface OrderPage {
  rows: OperationalOrder[];
  total: number;
  limit: number;
  skip: number;
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLogisticsHubs: builder.query<LogisticsHub[], void>({
      query: () => "/logistics-hubs",
      transformResponse: unwrapApiData<LogisticsHub[]>,
      transformErrorResponse: normalizeApiError,
      providesTags: ["Hubs"],
    }),
    getHandoverTimeSlots: builder.query<
      HandoverTimeSlots,
      { hubId?: string; date?: string }
    >({
      query: (params) => ({
        url: "/logistics-hubs/handover-time-slots",
        params,
      }),
      transformResponse: unwrapApiData<HandoverTimeSlots>,
      transformErrorResponse: normalizeApiError,
      providesTags: ["Hubs"],
    }),
    getOperationalOrders: builder.query<OrderPage, OrderFilters>({
      query: ({ hubOnly, ...params }) => ({
        url: hubOnly ? "/hub/sub-orders" : "/admin/orders",
        params,
      }),
      transformResponse: (response: unknown, _meta, arg) => {
        if (!arg.hubOnly)
          return unwrapApiData<OrderPage>(
            response as ApiResponseEnvelope<OrderPage>,
          );
        const page = unwrapApiData(
          response as ApiResponseEnvelope<
            Omit<OrderPage, "rows"> & { rows: OperationalSubOrder[] }
          >,
        );
        return {
          ...page,
          rows: page.rows.map((row) => ({
            orderId: row.orderId,
            subOrderId: row.subOrderId,
            buyerEmail: row.buyerEmail,
            createdAt: row.createdAt,
            subOrders: [row],
          })),
        };
      },
      transformErrorResponse: normalizeApiError,
      providesTags: ["Orders"],
    }),
    getOperationalOrder: builder.query<
      OperationalOrder,
      { hubOnly: boolean; id: string }
    >({
      query: ({ hubOnly, id }) =>
        `${hubOnly ? "/hub/sub-orders" : "/admin/orders"}/${encodeURIComponent(id)}`,
      transformResponse: unwrapApiData<OperationalOrder>,
      transformErrorResponse: normalizeApiError,
      providesTags: ["Orders"],
    }),
    updateFulfilment: builder.mutation<
      void,
      {
        orderId: string;
        subOrderId: string;
        status: FulfilmentStatus;
        hubId?: string;
        handoverDate?: string;
        handoverTime?: string;
        cancellationReason?: string;
        returnReason?: string;
        fulfillmentRejectionReason?: string;
        expectedStatus?: FulfilmentStatus;
        acknowledgeEffects?: boolean;
      }
    >({
      query: ({ orderId, subOrderId, ...body }) => ({
        url: `/orders/${encodeURIComponent(orderId)}/sub-orders/${encodeURIComponent(subOrderId)}/status`,
        method: "PATCH",
        body,
      }),
      transformErrorResponse: normalizeApiError,
      invalidatesTags: [
        "Orders",
        "Shop",
        "Shops",
        "User",
        "Product",
        "Products",
      ],
    }),
    correctOrderStatus: builder.mutation<
      void,
      {
        orderId: string;
        subOrderId: string;
        status: FulfilmentStatus;
        expectedStatus: FulfilmentStatus;
        reason: string;
        acknowledgeEffects: boolean;
        reopen: boolean;
      }
    >({
      query: ({ orderId, subOrderId, reopen, ...body }) => ({
        url: `/admin/orders/${encodeURIComponent(orderId)}/sub-orders/${encodeURIComponent(subOrderId)}/${reopen ? "reopen" : "correct-status"}`,
        method: "PATCH",
        body,
      }),
      transformErrorResponse: normalizeApiError,
      invalidatesTags: [
        "Orders",
        "Shop",
        "Shops",
        "User",
        "Product",
        "Products",
      ],
    }),
  }),
});

export const {
  useGetLogisticsHubsQuery,
  useGetHandoverTimeSlotsQuery,
  useGetOperationalOrdersQuery,
  useGetOperationalOrderQuery,
  useUpdateFulfilmentMutation,
  useCorrectOrderStatusMutation,
} = ordersApi;
