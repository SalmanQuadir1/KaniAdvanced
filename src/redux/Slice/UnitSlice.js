import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchunit = createAsyncThunk(
  "fetchunit",
  async (accessToken) => {
    const response = await fetch("http://localhost:8081/unit/viewAll", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  }
);

const unitSlice = createSlice({
  name: "unit",
  initialState: {
    loading: false,
    data: null,
    error: false,
  },
  //returned data is in action.payload
  extraReducers: (builder) => {
    builder.addCase(fetchunit.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = false;
    });
    builder.addCase(fetchunit.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchunit.rejected, (state, action) => {
      state.loading = true;
      state.error = action.payload;
    });
  },
});
export default unitSlice.reducer;