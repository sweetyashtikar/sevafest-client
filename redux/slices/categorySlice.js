import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/services/apiClient";

export const fetchActiveCategories = createAsyncThunk(
  "category/fetchActiveCategories",
  async (_, { getState, rejectWithValue }) => {
    const { category } = getState();

    if (category.categories && category.categories.data?.length > 0) {
      return category.categories; 
    }

    try {
      const res = await apiClient("/category/status-true");
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveCategories.pending, (state) => {

        if (!state.categories) {
          state.loading = true;
        }
      })
      .addCase(fetchActiveCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchActiveCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
