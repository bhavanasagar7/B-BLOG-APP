import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for login
export const userAuthorLoginThunk = createAsyncThunk(
  "user-author-login",
  async (userCredObj, thunkApi) => {
    try {
      const endpoint =
        userCredObj.userType === "author"
          ? "author-api/login"
          : "user-api/login";
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/${endpoint}`,
        userCredObj
      );
      return res.data;
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response?.data || { message: "Network error" }
      );
    }
  }
);

export const userAuthorSlice = createSlice({
  name: "user-author-login",
  initialState: {
    isPending: false,
    loginUserStatus: false,
    currentUser: null,
    errorOccurred: false,
    errMsg: "",
  },
  reducers: {
    resetState: (state) => {
      state.isPending = false;
      state.loginUserStatus = false;
      state.currentUser = null;
      state.errorOccurred = false;
      state.errMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userAuthorLoginThunk.pending, (state) => {
        state.isPending = true;
        state.errorOccurred = false;
        state.errMsg = "";
      })
      .addCase(userAuthorLoginThunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.currentUser = action.payload && action.payload.user ? action.payload.user : null;
        state.loginUserStatus = !!(action.payload && action.payload.user);
        state.errMsg = action.payload && action.payload.message && !action.payload.user ? action.payload.message : "";
        state.errorOccurred = !!(action.payload && action.payload.message && !action.payload.user);
      })
      .addCase(userAuthorLoginThunk.rejected, (state, action) => {
        state.isPending = false;
        state.currentUser = null;
        state.loginUserStatus = false;
        state.errMsg = action.payload?.message || "Login failed";
        state.errorOccurred = true;
      });
  },
});

export const { resetState } = userAuthorSlice.actions;
export default userAuthorSlice.reducer;