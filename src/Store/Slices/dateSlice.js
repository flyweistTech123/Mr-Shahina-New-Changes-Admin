/** @format */

import { createSlice } from "@reduxjs/toolkit";

const dateSlice = createSlice({
  name: "dates",
  initialState: {
    item: [],
    date: "",
  },
  reducers: {
    getDates: (state, action) => {
      state.item = action.payload;
    },
    setDateForAppointment: (state, action) => {
      state.date = action.payload;
    },
  },
});

export const { getDates, setDateForAppointment } = dateSlice.actions;
export const dates = (state) => state.dates.item;
export const todayDate = (state) => state.dates.date;
export default dateSlice.reducer;
