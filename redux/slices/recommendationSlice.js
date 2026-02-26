import { createSlice } from "@reduxjs/toolkit";

const recommendationSlice = createSlice({
  name: "recommendation",
  initialState: {
    recommended: [],
    recentlyViewed: [],
  },
  reducers: {
    setRecommended: (state, action) => {
      state.recommended = action.payload;
    },
    addRecentlyViewed: (state, action) => {
      const exists = state.recentlyViewed.find(
        (p) => p._id === action.payload._id
      );
      if (!exists) {
        state.recentlyViewed.unshift(action.payload);
      }
    },
  },
});

export const { setRecommended, addRecentlyViewed } =
  recommendationSlice.actions;
export default recommendationSlice.reducer;
