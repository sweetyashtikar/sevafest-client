import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import cartReducer from "@/redux/slices/cartSlice";
import recommendationReducer from "@/redux/slices/recommendationSlice";
<<<<<<< HEAD
=======
import categoryReducer from "@/redux/slices/categorySlice";
>>>>>>> 83ee919e76c7a582c04ebc4e7accb2b6b62fe26d

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    recommendation: recommendationReducer,
<<<<<<< HEAD
=======
    category: categoryReducer,
>>>>>>> 83ee919e76c7a582c04ebc4e7accb2b6b62fe26d
  },
});
