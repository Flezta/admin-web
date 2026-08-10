import type { User } from "../../types/user";
import { baseApi } from "./baseApi";
import { normalizeApiError, unwrapApiData } from "./responseTransformers";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => "/users/me",
      transformResponse: unwrapApiData<User>,
      transformErrorResponse: normalizeApiError,
      providesTags: ["User"],
    }),
  }),
});

export const { useGetCurrentUserQuery, useLazyGetCurrentUserQuery } = authApi;
