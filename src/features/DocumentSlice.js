import { createSlice } from "@reduxjs/toolkit";

const documentSlice = createSlice({
  name: "document",
  initialState: {
    docId: null,
    uploadDocText: null,
    // uploadDocText: null,
    essentialRequirements: [], // Storing the list of essential requirements
    optionalRequirements: [], // Storing the list of optional requirements
    IsGenerateDocCalled: false,
    IsThisByprompt: false,
  },
  reducers: {
    setIsGenerateDocCalledTrue: (state) => {
      state.IsGenerateDocCalled = true;
    },
    setIsGenerateDocCalledFalse: (state) => {
      state.IsGenerateDocCalled = false;
    },
    setIsThisBypromptTrue: (state) => {
      state.IsThisByprompt = true;
    },
    setIsThisBypromptFalse: (state) => {
      state.IsThisByprompt = false;
    },
    setDocId: (state, action) => {
      state.docId = action.payload;
    },
    // setUploadDocText: (state, action) => {

    //   state.uploadDocText = action.payload;
    // },
    setUploadDocText: (state, action) => {
      state.uploadDocText = action.payload;
    },
    setEssentialRequirements: (state, action) => {
      state.essentialRequirements = action.payload;
    },
    setOptionalRequirements: (state, action) => {
      state.optionalRequirements = action.payload;
    },
    clearDocId: (state) => {
      state.docId = ""; // or null, depending on how you handle empty states
    },
    clearDocumentState: (state) => {
      state.docId = null;
      state.uploadDocText = null;
      state.essentialRequirements = [];
      state.optionalRequirements = [];
    },
  },
});

export const {
  setDocId,
  setUploadDocText,
  setEssentialRequirements,
  setOptionalRequirements,
  clearDocId,
  clearDocumentState,
  setIsGenerateDocCalledTrue,
  setIsGenerateDocCalledFalse,
  setIsThisBypromptTrue,
  setIsThisBypromptFalse,
} = documentSlice.actions;

export default documentSlice.reducer;
