import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  breakoutData: null,
  loading: false,
  error: null,
  // greenHeading: [],
};

const breakoutSlice = createSlice({
  name: "breakout",
  initialState,
  reducers: {
    setBreakoutData: (state, action) => {
      state.breakoutData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearBreakoutData: (state) => {
      state.breakoutData = null;
      state.loading = false;
      state.error = null;
    },
    // setGreenHeading: (state, action) => {
    //   state.greenHeading = action.payload;
    // },
  },
});

export const {
  setBreakoutData,
  setLoading,
  setError,
  clearBreakoutData,
  // setGreenHeading,
} = breakoutSlice.actions;

export default breakoutSlice.reducer;
