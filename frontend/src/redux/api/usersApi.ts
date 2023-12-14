import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "./customFetch";
import { IPostResponse } from "./types";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: customFetchBase,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    createUser: builder.mutation<any, FormData>({
      query(post) {
        return {
          url: "/users",
          method: "POST",
          credentials: "include",
          body: post,
        };
      },
      invalidatesTags: [{ type: "Users", id: "LIST" }],
      transformResponse: (result: any) => result.data,
    }),
    updateUser: builder.mutation<any, { id: string; user: FormData }>({
      query({ id, user }) {
        return {
          url: `/users/${id}`,
          method: "PATCH",
          credentials: "include",
          body: user,
        };
      },
      invalidatesTags: (result, error, { id }) =>
        result
          ? [
              { type: "Users", id },
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
      transformResponse: (response: any) => response.data,
    }),
    getUser: builder.query<any, string>({
      query(id) {
        return {
          url: `/users/${id}`,
          credentials: "include",
        };
      },
      providesTags: (result, error, id) => [{ type: "Users", id }],
      transformResponse: (response: any) => response.data,
    }),
    getAllUsers: builder.query<any, { page: number; limit: number }>({
      query({ page, limit }) {
        return {
          url: `/users?page=${page}&limit=${limit}`,
          credentials: "include",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result?.users?.map(({ id }) => ({
                type: "Users" as const,
                id,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
      transformResponse: (results: any) => results.data,
    }),
    deleteUser: builder.mutation<any, string>({
      query(id) {
        return {
          url: `/users/${id}`,
          method: "Delete",
          credentials: "include",
        };
      },
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});

export const { useCreateUserMutation, useDeleteUserMutation, useUpdateUserMutation, useGetAllUsersQuery, useGetUserQuery } = usersApi;
