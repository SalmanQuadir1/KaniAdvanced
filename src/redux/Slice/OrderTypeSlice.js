import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { VIEW_ALL_ORDERTYPE } from "../../Constants/utils";


export const fetchOrderType = createAsyncThunk(
  "fetchOrderType",
  async (accessToken) => {
    const response = await fetch(VIEW_ALL_ORDERTYPE, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  }
);

const OrderTypeSLice = createSlice({
  name: "orderType",
  initialState: {
    loading: false,
    data: null,
    error: false,
  },
  //returned data is in action.payload
  extraReducers: (builder) => {
    builder.addCase(fetchOrderType.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = false;
    });
    builder.addCase(fetchOrderType.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchOrderType.rejected, (state, action) => {
      state.loading = true;
      state.error = action.payload;
    });
  },
});
export default OrderTypeSLice.reducer;
