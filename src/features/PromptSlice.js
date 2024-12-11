import { createSlice } from "@reduxjs/toolkit";

const PromptSlice = createSlice({
  name: "Prompt",
  initialState: {
    prompt: null,
  },
  reducers: {
    setPrompt: (state, action) => {
        state.prompt = action.payload
    },
  },
});

export const {
    setPrompt
} = PromptSlice.actions

export default PromptSlice.reducer;