import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { VIEW_ALL_CUSTOMERGROUP } from "../../Constants/utils";


export const fetchCustomerGroup = createAsyncThunk(
  "fetchCustomerGroup",
  async (accessToken) => {
    const response = await fetch(VIEW_ALL_CUSTOMERGROUP, {
      headers: {
        Authorization: `Bearer ${accessToken}` ,
      },
    });
    return response.json();
  }
);

const CustomerGroupSLice = createSlice({
  name: "customerGroup",
  initialState: {
    loading: false,
    data: null,
    error: false,
  },
  //returned data is in action.payload
  extraReducers: (builder) => {
    builder.addCase(fetchCustomerGroup.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = false;
    });
    builder.addCase(fetchCustomerGroup.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchCustomerGroup.rejected, (state, action) => {
      state.loading = true;
      state.error = action.payload;
    });
  },
});
export default CustomerGroupSLice.reducer;
