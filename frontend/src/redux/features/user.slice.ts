import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../api/types";

interface IUserState {
  user: IUser | null;
  access_token: string;
}
const getUserFromLocalStorage = (): IUser | null => {
  const userString = localStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
};
const initialState: IUserState = {
  user: getUserFromLocalStorage(),
  access_token: localStorage.getItem("token") || "",
};

export const userSlice = createSlice({
  initialState,
  name: "userSlice",
  reducers: {
    logout: () => initialState,
    setUser: (state, action: PayloadAction<{ user: IUser; access_token: string }>) => {
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.access_token);
    },
  },
});

export default userSlice.reducer;

export const { logout, setUser } = userSlice.actions;
