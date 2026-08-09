
import type { User } from "../../types/user";
import { baseApi } from "./baseApi";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
  }),
});

export const { useGetCurrentUserQuery, useLazyGetCurrentUserQuery } = authApi;
