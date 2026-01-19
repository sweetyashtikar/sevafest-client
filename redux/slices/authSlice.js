import { createSlice } from "@reduxjs/toolkit";

const isBrowser = typeof window !== "undefined";

const getStoredAuth = () => {
  if (!isBrowser) return null;
  try {
    const data = localStorage.getItem("auth");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const storedAuth = getStoredAuth();

const initialState = {
  isAuthenticated: !!storedAuth,
  user: storedAuth?.user || null,
  token: storedAuth?.token || null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;

      if (isBrowser) {
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: action.payload.user,
            token: action.payload.token,
          })
        );
      }
    },

    loginFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      if (isBrowser) {
        localStorage.removeItem("auth");
      }
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;

      if (isBrowser) {
        localStorage.removeItem("auth");
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
