import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { VIEW_ALL_ORDER_URL } from "../../Constants/utils";


export const fetchorder = createAsyncThunk(
  "fetchorder",
  async (accessToken) => {
    const response = await fetch(VIEW_ALL_ORDER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    data: null,
    error: false,
  },
  //returned data is in action.payload
  extraReducers: (builder) => {
    builder.addCase(fetchorder.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = false;
    });
    builder.addCase(fetchorder.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchorder.rejected, (state, action) => {
      state.loading = true;
      state.error = action.payload;
    });
  },
});
export default orderSlice.reducer;
