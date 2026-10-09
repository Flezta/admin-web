import type { HubProfile, PartnerHub } from "../../types/hub";
import type { LogisticsHub } from "../../types/order";
import { baseApi } from "./baseApi";
import { normalizeApiError, unwrapApiData } from "./responseTransformers";

export const hubsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPartnerHubProfile: builder.query<
      LogisticsHub & { enabled: boolean },
      void
    >({
      query: () => "/hub/profile",
      transformResponse: unwrapApiData<LogisticsHub & { enabled: boolean }>,
      transformErrorResponse: normalizeApiError,
      providesTags: ["Hubs"],
    }),
    getHubs: builder.query<PartnerHub[], void>({
      query: () => "/admin/hubs",
      transformResponse: unwrapApiData<PartnerHub[]>,
      transformErrorResponse: normalizeApiError,
      providesTags: ["Hubs"],
    }),
    getHub: builder.query<PartnerHub, string>({
      query: (hubId) => `/admin/hubs/${encodeURIComponent(hubId)}`,
      transformResponse: unwrapApiData<PartnerHub>,
      transformErrorResponse: normalizeApiError,
      providesTags: ["Hubs"],
    }),
    createHub: builder.mutation<PartnerHub, HubProfile>({
      query: (body) => ({ url: "/admin/hubs", method: "POST", body }),
      transformResponse: unwrapApiData<PartnerHub>,
      transformErrorResponse: normalizeApiError,
      invalidatesTags: ["Hubs"],
    }),
    updateHub: builder.mutation<
      PartnerHub,
      { hubId: string; profile: HubProfile; expectedUpdatedAt: string }
    >({
      query: ({ hubId, profile, expectedUpdatedAt }) => ({
        url: `/admin/hubs/${encodeURIComponent(hubId)}`,
        method: "PUT",
        body: { ...profile, expectedUpdatedAt },
      }),
      transformResponse: unwrapApiData<PartnerHub>,
      transformErrorResponse: normalizeApiError,
      invalidatesTags: ["Hubs"],
    }),
    setHubEnabled: builder.mutation<
      PartnerHub,
      {
        hubId: string;
        enabled: boolean;
        reason: string;
        expectedUpdatedAt: string;
      }
    >({
      query: ({ hubId, ...body }) => ({
        url: `/admin/hubs/${encodeURIComponent(hubId)}/enabled`,
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapApiData<PartnerHub>,
      transformErrorResponse: normalizeApiError,
      invalidatesTags: ["Hubs"],
    }),
    setHubAccess: builder.mutation<
      void,
      {
        uid: string;
        hubId: string | null;
        expectedHubId: string | null;
        reason: string;
      }
    >({
      query: ({ uid, ...body }) => ({
        url: `/users/${encodeURIComponent(uid)}/hub-access`,
        method: "PATCH",
        body,
      }),
      transformErrorResponse: normalizeApiError,
      invalidatesTags: ["Hubs", "User", "Users", "Orders"],
    }),
  }),
});
export const {
  useGetPartnerHubProfileQuery,
  useGetHubsQuery,
  useGetHubQuery,
  useCreateHubMutation,
  useUpdateHubMutation,
  useSetHubEnabledMutation,
  useSetHubAccessMutation,
} = hubsApi;
