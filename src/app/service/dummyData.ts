import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

export interface Product {
    id: number;
    title: string;
    description: string;
    brand: string;
}

type PostProduct = {
    id?: number;
    title: string;
    description: string;
    brand: string;
};

type UpdateBody = {
    title: string;
    description: string;
    brand: string;
};

interface UpdateProduct {
    id: number;
    newProduct: UpdateBody;
}

export const fetchData = createApi({
    reducerPath: "products",
    baseQuery: fetchBaseQuery({ baseUrl: "https://dummyjson.com" }),
    tagTypes: ["Products"],
    endpoints: (builder) => ({
        getAllProducts: builder.query<{ products: Product[] }, void>({
            query: () => "/products",
            providesTags: ["Products"],
        }),

        getProductById: builder.query<Product, number>({
            query: (id: number) => `/products/${id}`,
        }),

        addNewProduct: builder.mutation<Product, PostProduct>({
            query: (postProduct) => ({
                url: "/products/add",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: postProduct,
            }),
            async onQueryStarted(newProduct, { dispatch }) {
                try {
                    dispatch(
                        fetchData.util.updateQueryData(
                            "getAllProducts",
                            undefined,
                            (draft) => {
                                const newId = draft.products.length > 0 ? draft.products[draft.products.length - 1].id + 1 : 1

                                draft.products.push({
                                    ...newProduct, id: newId
                                })
                            }
                        )
                    );
                } catch(error) {
                    console.error(error);
                }
            },
        }),
        deleteProduct: builder.mutation<{ isDeleted?: boolean }, { id: number }>({
            query: ({ id }) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    fetchData.util.updateQueryData(
                        "getAllProducts",
                        undefined,
                        (draft) => {
                            draft.products = draft.products.filter((p) => p.id !== id);
                        }
                    )
                );
                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
                }
            },
        }),

        updateProduct: builder.mutation<Product, UpdateProduct>({
            query: ({ id, newProduct }) => ({
                url: `/products/${id}`,
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: newProduct,
            }),
            async onQueryStarted({ id, newProduct }, { dispatch, queryFulfilled }) {
                // Optimistic update: actualiza en cache inmediatamente
                const patch = dispatch(
                    fetchData.util.updateQueryData(
                        "getAllProducts",
                        undefined,
                        (draft) => {
                            const idx = draft.products.findIndex((p) => p.id === id);
                            if (idx !== -1) {
                                draft.products[idx] = {
                                    ...draft.products[idx],
                                    ...newProduct,
                                    id,
                                };
                            }
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
                }
            },
        }),
    }),
});

export const {
    useDeleteProductMutation,
    useGetAllProductsQuery,
    useGetProductByIdQuery,
    useUpdateProductMutation,
    useAddNewProductMutation,
} = fetchData;
