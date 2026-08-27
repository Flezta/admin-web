import type {
  Product,
  ProductListQuery,
  ProductListResponse,
  ProductQueueNext,
  ProductStatus,
  ProductStatusChangeResult,
  ProductToggleDeleteResult,
} from "../../types/product";
import { baseApi } from "./baseApi";
import { normalizeApiError, unwrapApiData } from "./responseTransformers";

interface RawProductListResponse {
  message?: string;
  data?: Product[];
  meta?: ProductListResponse["meta"];
  counts?: ProductListResponse["counts"];
}

const EMPTY_COUNTS: ProductListResponse["counts"] = {
  draft: 0,
  under_review: 0,
  live: 0,
  rejected: 0,
  all: 0,
  disabled: 0,
  soldOut: 0,
};

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, ProductListQuery | void>({
      query: (args) => {
        const {
          page = 1,
          limit = 24,
          status,
          disabled,
          shopId,
          brand,
          categoryId,
          search,
          sort,
          stock,
        } = args ?? {};

        return {
          url: "/admin/products",
          params: {
            page,
            limit,
            ...(status && status !== "all" ? { status } : {}),
            ...(disabled ? { disabled } : {}),
            ...(shopId ? { shopId } : {}),
            ...(brand ? { brand } : {}),
            ...(categoryId ? { categoryId } : {}),
            ...(search ? { search } : {}),
            ...(sort ? { sort } : {}),
            ...(stock ? { stock } : {}),
          },
        };
      },
      transformResponse: (
        response: RawProductListResponse,
      ): ProductListResponse => ({
        data: response.data ?? [],
        meta: response.meta ?? {
          page: 1,
          limit: 24,
          total: 0,
          totalPages: 1,
        },
        counts: response.counts ?? EMPTY_COUNTS,
      }),
      transformErrorResponse: normalizeApiError,
      providesTags: (result) => [
        { type: "Products", id: "LIST" },
        ...(result?.data ?? []).map((product) => ({
          type: "Product" as const,
          id: product.productId,
        })),
      ],
    }),

    getProductByProductId: builder.query<Product, string>({
      query: (productId) => `/admin/products/${productId}`,
      transformResponse: unwrapApiData<Product>,
      transformErrorResponse: normalizeApiError,
      providesTags: (_result, _error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    getNextProductInQueue: builder.query<
      ProductQueueNext,
      { status?: ProductStatus; excludeProductId?: string }
    >({
      query: ({ status = "under_review", excludeProductId }) => ({
        url: "/admin/products/queue/next",
        params: {
          status,
          ...(excludeProductId ? { excludeProductId } : {}),
        },
      }),
      transformResponse: unwrapApiData<ProductQueueNext>,
      transformErrorResponse: normalizeApiError,
      providesTags: [{ type: "Products", id: "QUEUE" }],
    }),

    updateProductStatus: builder.mutation<
      ProductStatusChangeResult,
      { productId: string; status: ProductStatus; rejectionReasons?: string[] }
    >({
      query: ({ productId, status, rejectionReasons }) => ({
        url: `/products/${productId}/status`,
        method: "PATCH",
        body: {
          status,
          ...(rejectionReasons?.length ? { rejectionReasons } : {}),
        },
      }),
      transformResponse: unwrapApiData<ProductStatusChangeResult>,
      transformErrorResponse: normalizeApiError,
      invalidatesTags: (_result, _error, arg) => [
        { type: "Product", id: arg.productId },
        { type: "Products", id: "LIST" },
        { type: "Products", id: "QUEUE" },
      ],
    }),

    toggleProductDeleted: builder.mutation<
      ProductToggleDeleteResult,
      { productId: string; action: "delete" | "restore" }
    >({
      query: ({ productId, action }) => ({
        url: `/products/${productId}/toggle-delete`,
        method: "PUT",
        body: { action },
      }),
      transformResponse: unwrapApiData<ProductToggleDeleteResult>,
      transformErrorResponse: normalizeApiError,
      invalidatesTags: (_result, _error, arg) => [
        { type: "Product", id: arg.productId },
        { type: "Products", id: "LIST" },
        { type: "Products", id: "QUEUE" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByProductIdQuery,
  useGetNextProductInQueueQuery,
  useUpdateProductStatusMutation,
  useToggleProductDeletedMutation,
} = productsApi;
