import type { User } from "../../types/user";
import { baseApi } from "./baseApi";
import { normalizeApiError, unwrapApiData } from "./responseTransformers";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<
      User,
      { firstName: string; lastName: string; email: string }
    >({
      query: (body) => ({ url: "/users", method: "POST", body }),
      transformResponse: unwrapApiData<User>,
      transformErrorResponse: normalizeApiError,
      invalidatesTags: ["User", "Users"],
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => "/users/me",
      transformResponse: unwrapApiData<User>,
      transformErrorResponse: normalizeApiError,
      providesTags: ["User"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
} = authApi;
