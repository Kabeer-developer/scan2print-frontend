import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import uploadService from "../../api/uploadService";

const initialState = {
  files: [],
  loading: false,
  error: null,
};

export const fetchStoreFiles = createAsyncThunk(
  "uploads/fetch",
  async (storeId, thunkAPI) => {
    try {
      return await uploadService.getStoreFiles(storeId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteFile = createAsyncThunk(
  "uploads/delete",
  async (fileId, thunkAPI) => {
    try {
      await uploadService.deleteFile(fileId);
      return fileId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

const uploadSlice = createSlice({
  name: "uploads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStoreFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchStoreFiles.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(
          (f) => f._id !== action.payload
        );
      });
  },
});

export default uploadSlice.reducer;
