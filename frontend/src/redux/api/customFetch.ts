import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout } from "../features/user.slice";

// const baseUrl = `${process.env.REACT_APP_SERVER_ENDPOINT}/`;
const baseUrl = `http://localhost:3000/`;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers: Headers) => {
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  },
});

const customFetchBase: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    try {
      api.dispatch(logout());
      window.location.href = "/";
    } catch (e) {
      console.log(e);
    }
  }

  return result;
};

export default customFetchBase;
