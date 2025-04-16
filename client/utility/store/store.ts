import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import accountDataManagementSlice from "./slices/account";
import authenticationSlice from "./slices/authentication";
import detailsManagementSlice from "./slices/details";
import signalRManagementSlice from "./slices/signalR";

export const store = configureStore({
  reducer: {
    accountDataManager: accountDataManagementSlice,
    authentication: authenticationSlice,
    detailsManager: detailsManagementSlice,
    signalRDataManager: signalRManagementSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useCharmrDispatch = () => useDispatch<AppDispatch>();
export const useCharmrSelector: TypedUseSelectorHook<RootState> = useSelector;
