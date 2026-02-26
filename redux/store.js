import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import cartReducer from "@/redux/slices/cartSlice";
import recommendationReducer from "@/redux/slices/recommendationSlice";
import categoryReducer from "@/redux/slices/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    recommendation: recommendationReducer,
    category: categoryReducer,
  },
});
