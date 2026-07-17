import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchCurrentUser = createAsyncThunk("profile/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try { return (await api.get("/user/me")).data.data; }
  catch (error) { return rejectWithValue(error.response?.data?.message || "Unable to load your profile"); }
});

export const calculateAtsScores = createAsyncThunk("profile/calculateAtsScores", async (_, { rejectWithValue }) => {
  try { return (await api.post("/user/ats-scores")).data.data; }
  catch (error) { return rejectWithValue(error.response?.data?.message || "Unable to calculate job matches"); }
});

const profileSlice = createSlice({
  name: "profile",
  initialState: { user: null, loading: false, scoring: false, error: null },
  reducers: { setProfileUser: (state, action) => { state.user = action.payload; } },
  extraReducers: (builder) => builder
    .addCase(fetchCurrentUser.pending, (state) => { state.loading = true; state.error = null; })
    .addCase(fetchCurrentUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
    .addCase(fetchCurrentUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
    .addCase(calculateAtsScores.pending, (state) => { state.scoring = true; state.error = null; })
    .addCase(calculateAtsScores.fulfilled, (state, action) => { state.scoring = false; if (state.user) state.user.atsScores = action.payload.matches; })
    .addCase(calculateAtsScores.rejected, (state, action) => { state.scoring = false; state.error = action.payload; }),
});

export const { setProfileUser } = profileSlice.actions;
export default profileSlice.reducer;
