import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  hydrated: false, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
   
    hydrateAuth: (state, action) => {
      console.log("🔁 [REDUX] hydrateAuth", action.payload);
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.hydrated = true;
    },

    loginStart: (state) => {
      state.loading = true;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.hydrated = true; 
    },

    loginFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.hydrated = true; 
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.hydrated = true; 
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  hydrateAuth,
} = authSlice.actions;

export default authSlice.reducer;
