import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.push({
        id: action.payload.id,
        msg: action.payload.msg,
        alertType: action.payload.alertType,
      });
    },
    removeAlert: (state, action) => {
      return state.filter((alert) => alert.id !== action.payload);
    },
  },
});

export const { setAlert, removeAlert } = alertSlice.actions;

export default alertSlice.reducer;
