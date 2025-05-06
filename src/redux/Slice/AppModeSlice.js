// src/redux/Slice/AppModeSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const AppModeSlice = createSlice({
  name: 'appMode',
  initialState: {
    mode: null, // 'production' or 'accounts'
  },
  reducers: {
    setAppMode: (state, action) => {
      state.mode = action.payload;
    },
    clearAppMode: (state) => {
      state.mode = null;
    },
  },
});

export const { setAppMode, clearAppMode } = AppModeSlice.actions;
export default AppModeSlice.reducer;