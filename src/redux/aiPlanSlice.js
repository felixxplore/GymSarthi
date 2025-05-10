import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "./adminSlice";
 
// 👉 Async Thunk
export const generateAIPlan = createAsyncThunk(
  "aiPlan/generate",
  async (formData, { rejectWithValue }) => {
    try {

      console.log("form data : ",formData)
      const res = await api.post("/generate-plan", formData);
      console.log("gemini answer:",res);
      return res.data;
    } catch (err) {
      console.log("gemini error",err1  )
      return rejectWithValue(
        err.response?.data?.error || "AI Plan generation failed"
      );
    }
  }
);

const aiPlanSlice = createSlice({
  name: "aiPlan",
  initialState: {
    loading: false,
    data: "",
    error: null,
  },
  reducers: {
    clearPlan: (state) => {
      state.data = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAIPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateAIPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(generateAIPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPlan } = aiPlanSlice.actions;
export default aiPlanSlice.reducer;
