import { createSlice } from "@reduxjs/toolkit";

const greenHeading = createSlice({
  name: "greenHeading",
  initialState: {
    greenHeading: [],
  },
  reducers: {
    setGreenHeading: (state, action) => {
      state.greenHeading = action.payload;
    },
  },
});

export const { setGreenHeading } = greenHeading.actions;

export default greenHeading.reducer;
