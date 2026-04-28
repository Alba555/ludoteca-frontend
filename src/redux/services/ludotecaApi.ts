import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Game } from "../../types/Game";
import type { Category } from "../../types/Category";
import type { Author, AuthorResponse } from "../../types/Author";
import type { Client } from "../../types/Client";
import type { Loan } from "../../types/Loan";

export const ludotecaAPI = createApi({
  reducerPath: "ludotecaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
  }),
  tagTypes: ["Category", "Author", "Game", "Client", "Loan"],

  endpoints: (builder) => ({

    getCategories: builder.query<Category[], null>({
      query: () => "category",
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation({
      query: (payload) => ({
        url: "/category",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (id: string) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: (payload: Category) => ({
        url: `category/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Category"],
    }),



    getAllAuthors: builder.query<Author[], null>({
      query: () => "author",
      providesTags: ["Author"],
    }),

    getAuthors: builder.query<
      AuthorResponse,
      { pageNumber: number; pageSize: number }
    >({
      query: ({ pageNumber, pageSize }) => {
        return {
          url: "author",
          method: "POST",
          body: {
            pageable: {
              pageNumber,
              pageSize,
            },
          },
        };
      },
      providesTags: ["Author"],
    }),

    createAuthor: builder.mutation({
      query: (payload) => ({
        url: "/author",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Author"],
    }),

    deleteAuthor: builder.mutation({
      query: (id: string) => ({
        url: `/author/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Author"],
    }),

    updateAuthor: builder.mutation({
      query: (payload: Author) => ({
        url: `author/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Author", "Game"],
    }),



    getGames: builder.query<Game[], { title: string; idCategory: string | null }>({
      query: ({ title, idCategory }) => {
        const params: any = {};

        if (title) params.title = title;
        if (idCategory) params.idCategory = idCategory;

        return {
          url: "game",
          params,
        };
      },
      providesTags: ["Game"],
    }),

    createGame: builder.mutation({
      query: (payload: Game) => ({
        url: "/game",
        method: "PUT",
        body: { ...payload },
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Game"],
    }),

    updateGame: builder.mutation({
      query: (payload: Game) => ({
        url: `game/${payload.id}`,
        method: "PUT",
        body: { ...payload },
      }),
      invalidatesTags: ["Game"],
    }),



    getClients: builder.query<Client[], null>({
      query: () => "client",
      providesTags: ["Client"],
    }),

    createClient: builder.mutation({
      query: (payload) => ({
        url: "client",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Client"],
    }),

    updateClient: builder.mutation({
      query: (payload: Client) => ({
        url: `client/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Client"],
    }),

    deleteClient: builder.mutation({
      query: (id) => ({
        url: `client/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Client"],
    }),


    getLoans: builder.mutation<any, any>({
  query: (payload) => ({
    url: "loan",
    method: "POST",
    body: payload,
  }),
}),

createLoan: builder.mutation({
  query: (payload: Loan) => ({
    url: "loan",
    method: "PUT",
    body: payload,
  }),
}),

updateLoan: builder.mutation({
  query: (payload: Loan) => ({
    url: `loan/${payload.id}`,
    method: "PUT",
    body: payload,
  }),
}),

deleteLoan: builder.mutation({
  query: (id: number) => ({
    url: `loan/${id}`,
    method: "DELETE",
  }),
  }),

  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,

  useCreateAuthorMutation,
  useDeleteAuthorMutation,
  useGetAllAuthorsQuery,
  useGetAuthorsQuery,
  useUpdateAuthorMutation,

  useCreateGameMutation,
  useGetGamesQuery,
  useUpdateGameMutation,

  useCreateClientMutation,
  useDeleteClientMutation,
  useGetClientsQuery,
  useUpdateClientMutation,
  
  useGetLoansMutation,
  useCreateLoanMutation,
  useUpdateLoanMutation,
  useDeleteLoanMutation,

} = ludotecaAPI;