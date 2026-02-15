import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/services/apiClient";


export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient("/viewCart"); 
      return res?.data?.items || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default cartSlice.reducer;
