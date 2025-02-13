/** @format */
import { configureStore } from "@reduxjs/toolkit";
import dateSlice from "./Slices/dateSlice";
import modalSlices from "./Slices/modalSlices";

const store = configureStore({
  reducer: {
    dates: dateSlice,
    modal: modalSlices,
  },
});

export default store;
