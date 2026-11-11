import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  login: "",
  isAuthenticated: 0 as 0 | 1,
  loading: false,
  error: null as string | null,
};

const datacenterEngineerSlice = createSlice({
  name: "datacenterEngineer",
  initialState,
  reducers: {
    startDatacenterEngineerRequest(state) {
      state.loading = true;
      state.error = null;
    },
    signInDatacenterEngineer(state, action: PayloadAction<string>) {
      state.login = action.payload;
      state.isAuthenticated = 1;
      state.loading = false;
      state.error = null;
    },
    signOutDatacenterEngineer() {
      return initialState;
    },
    failDatacenterEngineerRequest(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  startDatacenterEngineerRequest, signInDatacenterEngineer,
  signOutDatacenterEngineer, failDatacenterEngineerRequest,
} = datacenterEngineerSlice.actions;
export default datacenterEngineerSlice.reducer;
