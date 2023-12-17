import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "./customFetch";
import { setUser } from "../features/user.slice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query(data) {
        return {
          url: "auth/login",
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
      transformResponse: (result: { data: { access_token: string; user: any } }) => result.data,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
          window.location.href = "/dashboard";
        } catch (error) {}
      },
    }),
  }),
});

export const { useLoginUserMutation } = authApi;
