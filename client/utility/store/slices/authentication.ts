import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

interface IAuthenticationState {
  token: string | null;
}

const initialState: IAuthenticationState = {
  token: null,
};

const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    tokenFromStorageLoader: (state) => {
      state.token = SecureStore.getItem("token");
    },
    fetchedTokenAssigner: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      SecureStore.setItem("token", action.payload);
    },
    tokenCleaner: (state) => {
      state.token = null;
      SecureStore.deleteItemAsync("token");
    },
  },
});

export const { tokenFromStorageLoader, fetchedTokenAssigner, tokenCleaner } =
  authenticationSlice.actions;
export default authenticationSlice.reducer;
