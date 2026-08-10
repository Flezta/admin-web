import type { User } from "../../types/user";
import { baseApi } from "./baseApi";
import { normalizeApiError, unwrapApiData } from "./responseTransformers";

interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  isHubAdmin?: boolean;
}

export type AdminRole = "ADMIN" | "SUPER_ADMIN" | "HUB_ADMIN" | "NONE";

interface AdminRoleAssignmentResult {
  uid: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isHubAdmin: boolean;
}

interface ActivityTargetUser {
  _id: string;
  uid: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface OrdersActivityItem {
  orderId: string;
  status: string;
  completionPercentage?: number;
  createdAt?: string;
}

interface OrdersActivityData {
  user: ActivityTargetUser;
  orders: {
    completed: OrdersActivityItem[];
    ongoing: OrdersActivityItem[];
  };
  pagination: {
    limit: number;
    skip: number;
  };
}

interface CartActivityData {
  user: ActivityTargetUser;
  cart: {
    shops: Array<{
      shopId: string;
      ownerFirstName: string | null;
      itemCount: number;
      subtotal: number;
      deliveryCost: number;
      total: number;
    }>;
    totals: {
      subtotal: number;
      itemCount: number;
      deliveryCost: number;
      total: number;
    };
  };
}

interface WishlistActivityItem {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  status: string;
  available: boolean;
  addedAt: string;
}

interface WishlistActivityData {
  user: ActivityTargetUser;
  wishlist: {
    items: WishlistActivityItem[];
    total: number;
  };
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      transformResponse: unwrapApiData<User[]>,
      transformErrorResponse: normalizeApiError,
      providesTags: (result) => [
        { type: "Users", id: "LIST" },
        ...(result ?? []).map((user) => ({
          type: "User" as const,
          id: user.uid,
        })),
      ],
    }),
    getUserByUid: builder.query<User, string>({
      query: (uid) => `/users/${uid}`,
      transformResponse: unwrapApiData<User>,
      transformErrorResponse: normalizeApiError,
      providesTags: (_result, _error, uid) => [{ type: "User", id: uid }],
    }),
    getUserOrdersActivity: builder.query<
      OrdersActivityData,
      { uid: string; orderLimit?: number; orderSkip?: number }
    >({
      query: ({ uid, orderLimit = 20, orderSkip = 0 }) => ({
        url: `/users/${uid}/activity/orders`,
        params: {
          orderLimit,
          orderSkip,
        },
      }),
      transformResponse: unwrapApiData<OrdersActivityData>,
      transformErrorResponse: normalizeApiError,
      providesTags: (_result, _error, arg) => [{ type: "User", id: arg.uid }],
    }),
    getUserCartActivity: builder.query<CartActivityData, string>({
      query: (uid) => `/users/${uid}/activity/cart`,
      transformResponse: unwrapApiData<CartActivityData>,
      transformErrorResponse: normalizeApiError,
      providesTags: (_result, _error, uid) => [{ type: "User", id: uid }],
    }),
    getUserWishlistActivity: builder.query<WishlistActivityData, string>({
      query: (uid) => `/users/${uid}/activity/wishlist`,
      transformResponse: unwrapApiData<WishlistActivityData>,
      transformErrorResponse: normalizeApiError,
      providesTags: (_result, _error, uid) => [{ type: "User", id: uid }],
    }),
    disableUser: builder.mutation<User, string>({
      query: (uid) => ({
        url: `/users/${uid}`,
        method: "PATCH",
      }),
      transformResponse: unwrapApiData<User>,
      transformErrorResponse: normalizeApiError,
      invalidatesTags: (_result, _error, uid) => [
        { type: "User", id: uid },
        { type: "Users", id: "LIST" },
      ],
    }),
    restoreUser: builder.mutation<User, string>({
      query: (uid) => ({
        url: `/users/${uid}/restore`,
        method: "PATCH",
      }),
      transformResponse: unwrapApiData<User>,
      transformErrorResponse: normalizeApiError,
      invalidatesTags: (_result, _error, uid) => [
        { type: "User", id: uid },
        { type: "Users", id: "LIST" },
      ],
    }),
    updateUser: builder.mutation<
      User,
      { uid: string; payload: UpdateUserPayload }
    >({
      query: ({ uid, payload }) => ({
        url: `/users/${uid}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: unwrapApiData<User>,
      transformErrorResponse: normalizeApiError,
      invalidatesTags: (_result, _error, arg) => [
        { type: "User", id: arg.uid },
        { type: "Users", id: "LIST" },
      ],
    }),
    assignUserAdminRole: builder.mutation<
      AdminRoleAssignmentResult,
      { uid: string; role: AdminRole }
    >({
      query: ({ uid, role }) => ({
        url: `/users/${uid}/admin-role`,
        method: "PATCH",
        body: { role },
      }),
      transformResponse: unwrapApiData<AdminRoleAssignmentResult>,
      transformErrorResponse: normalizeApiError,
      invalidatesTags: (_result, _error, arg) => [
        { type: "User", id: arg.uid },
        { type: "Users", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByUidQuery,
  useGetUserOrdersActivityQuery,
  useGetUserCartActivityQuery,
  useGetUserWishlistActivityQuery,
  useDisableUserMutation,
  useRestoreUserMutation,
  useUpdateUserMutation,
  useAssignUserAdminRoleMutation,
} = usersApi;
