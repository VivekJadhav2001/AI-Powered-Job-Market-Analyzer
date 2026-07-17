import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

export const uploadResumeForMatches = createAsyncThunk(
  "aiMatches/uploadResume",
  async (file, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("resume", file);
      const response = await api.post("/resume", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to upload and parse resume",
      );
    }
  },
);

export const generateAiMatches = createAsyncThunk(
  "aiMatches/generateAiMatches",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/matches");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to generate AI matches",
      );
    }
  },
);

const aiMatchSlice = createSlice({
  name: "aiMatches",
  initialState: {
    resume: null,
    profile: null,
    jobs: [],
    careerSummary: "",
    overallAdvice: "",
    totalCandidates: 0,
    scoredCandidates: 0,
    rankedCandidates: 0,
    uploading: false,
    matching: false,
    error: null,
  },
  reducers: {
    clearAiMatchError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(uploadResumeForMatches.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadResumeForMatches.fulfilled, (state, action) => {
        state.uploading = false;
        state.resume = action.payload;
        state.profile = action.payload;
        state.jobs = [];
        state.careerSummary = "";
        state.overallAdvice = "";
      })
      .addCase(uploadResumeForMatches.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      .addCase(generateAiMatches.pending, (state) => {
        state.matching = true;
        state.error = null;
      })
      .addCase(generateAiMatches.fulfilled, (state, action) => {
        state.matching = false;
        state.profile = action.payload.profile;
        state.jobs = action.payload.jobs || [];
        state.careerSummary = action.payload.careerSummary || "";
        state.overallAdvice = action.payload.overallAdvice || "";
        state.totalCandidates = action.payload.totalCandidates || 0;
        state.scoredCandidates = action.payload.scoredCandidates || 0;
        state.rankedCandidates = action.payload.rankedCandidates || 0;
      })
      .addCase(generateAiMatches.rejected, (state, action) => {
        state.matching = false;
        state.error = action.payload;
      }),
});

export const { clearAiMatchError } = aiMatchSlice.actions;
export default aiMatchSlice.reducer;
