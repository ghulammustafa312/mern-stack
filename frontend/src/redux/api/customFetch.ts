import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { logout } from "../features/user.slice";

// const baseUrl = `${process.env.REACT_APP_SERVER_ENDPOINT}/`;
const baseUrl = `http://localhost:3000/`;

// Create a new mutex
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers: Headers) => {
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  },
});

const customFetchBase: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  // await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    // if (!mutex.isLocked()) {
    // const release = await mutex.acquire();
    try {
      api.dispatch(logout());
      window.location.href = "/";
    } catch (e) {
      console.log(e);
    } finally {
      // release();
    }
    // } else {
    //   await mutex.waitForUnlock();
    //   result = await baseQuery(args, api, extraOptions);
    // }
  }

  return result;
};

export default customFetchBase;
