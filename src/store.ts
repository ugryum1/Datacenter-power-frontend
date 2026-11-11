import { configureStore } from "@reduxjs/toolkit";
import datacenterDevicesReducer from "./slices/datacenterDevicesSlice.ts";
import datacenterEngineerReducer from "./slices/datacenterEngineerSlice.ts";

export const store = configureStore({
  reducer: {
    datacenterDevices: datacenterDevicesReducer,
    datacenterEngineer: datacenterEngineerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
