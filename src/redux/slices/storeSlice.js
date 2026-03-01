import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import storeService from "../../api/storeService";

const initialState = {
  storeInfo: null,
  token: null,
  loading: false,
  error: null,
};

export const registerStore = createAsyncThunk(
  "store/register",
  async (formData, thunkAPI) => {
    try {
      return await storeService.registerStore(formData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const loginStore = createAsyncThunk(
  "store/login",
  async (data, thunkAPI) => {
    try {
      return await storeService.loginStore(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    logout(state) {
      state.storeInfo = null;
      state.token = null;
      localStorage.removeItem("storeInfo");
    },
    loadUserFromStorage(state) {
      const raw = localStorage.getItem("storeInfo");
      if (raw) {
        const parsed = JSON.parse(raw);
        state.storeInfo = parsed.store;
        state.token = parsed.token;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerStore.fulfilled, (state, action) => {
        state.loading = false;
        state.storeInfo = action.payload.store;
        state.token = action.payload.token;
        localStorage.setItem("storeInfo", JSON.stringify(action.payload));
      })
      .addCase(registerStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginStore.fulfilled, (state, action) => {
        state.loading = false;
        state.storeInfo = action.payload.store;
        state.token = action.payload.token;
        localStorage.setItem("storeInfo", JSON.stringify(action.payload));
      })
      .addCase(loginStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, loadUserFromStorage } = storeSlice.actions;
export default storeSlice.reducer;
