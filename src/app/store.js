import { configureStore } from "@reduxjs/toolkit";
import storeReducer from "../redux/slices/storeSlice";
import uploadReducer from "../redux/slices/uploadSlice";

const store = configureStore({
  reducer: {
    store: storeReducer,
    uploads: uploadReducer,
  },
});

export default store;
