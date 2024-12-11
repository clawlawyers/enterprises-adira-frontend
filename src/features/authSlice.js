import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NODE_API_ENDPOINT } from "../utils/utils";

export const retrieveDrafterAuth = createAsyncThunk(
  "auth/retrieveAuth",
  async () => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const parsedUser = await JSON.parse(storedAuth);
      console.log(parsedUser);
      const props = await fetch(`${NODE_API_ENDPOINT}/client/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedUser.jwt}`,
        },
      });
      const parsedProps = await props.json();
      console.log(parsedProps);
      return {
        user: parsedUser,
      };
    } else return null;
  }
);

const initialState = {
  user: { jwt: "aasdsa" },
  isOtpVerified: false,
  fileBlob: false,
  status: "unfullfilled",
  userLoading: false,
  props: null,
  PlanData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { ambassador, ...user } = action.payload;
      state.user = user;
      state.props = { ambassador };
      state.autologout = false;
      localStorage.setItem("auth", JSON.stringify(user));
      return;
    },
    setUser: (state, action) => {
      // console.log(action)
      // const {user, props}=action.payload
      state.user = action.payload;
      // state.props = props;
      console.log(action.payload);
      state.status = "success";
      localStorage.setItem("auth", JSON.stringify(action.payload));
    },
    setOtpVerified: (state, action) => {
      state.isOtpVerified = action.payload;
    },
    resetAuth: (state) => {
      return initialState;
    },
    setFileBlob: (state, action) => {
      state.fileBlob = action.payload;
    },
    setLoadingTrue: (state) => {
      state.userLoading = true;
    },
    setLoadingFalse: (state) => {
      state.userLoading = false;
    },
    setPlanData: (state, action) => {
      state.PlanData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(retrieveDrafterAuth.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(retrieveDrafterAuth.fulfilled, (state, action) => {
      if (action.payload && action.payload.user) {
        state.user = action.payload.user;
      }
      state.status = "success";
    });
    builder.addCase(retrieveDrafterAuth.rejected, (state) => {
      state.status = "unfullfilled";
      state.user = null;
    });
  },
});

export const {
  setUser,
  setOtpVerified,
  resetAuth,
  setFileBlob,
  setLoadingTrue,
  setLoadingFalse,
  login,
  setPlanData,
} = authSlice.actions;

export default authSlice.reducer;
