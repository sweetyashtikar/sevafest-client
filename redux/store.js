import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import cartReducer from "@/redux/slices/cartSlice";
import recommendationReducer from "@/redux/slices/recommendationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    recommendation: recommendationReducer,
  },
});
