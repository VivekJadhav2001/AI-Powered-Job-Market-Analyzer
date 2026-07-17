import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

export const getTopSkills = createAsyncThunk(
  "dashboard/getTopSkills",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/dashboard/getTopSkills");

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top skills",
      );
    }
  },
);

export const getFastestGrowingRoles = createAsyncThunk(
  "dashboard/getFastestGrowingRoles",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/dashboard/fastestGrowingRoles");

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch fastest growing roles",
      );
    }
  },
);

export const getDashboardMetrics = createAsyncThunk(
  "dashboard/getDashboardMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/dashboard/getDashboardMetrics");

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard metrics",
      );
    }
  },
);

export const getMarketMomentum = createAsyncThunk(
  "dashboard/getMarketMomentum",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/dashboard/getMarketMomentum");

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch market momentum"
      );
    }
  }
);

const initialState = {
  topSkills: [],
  fastestGrowingRoles: [],
  metrics: [],
  marketMomentum: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getTopSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getTopSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.topSkills = action.payload;
      })

      .addCase(getTopSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getFastestGrowingRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getFastestGrowingRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.fastestGrowingRoles = action.payload;
      })

      .addCase(getFastestGrowingRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getDashboardMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })

      .addCase(getDashboardMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMarketMomentum.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(getMarketMomentum.fulfilled, (state, action) => {
  state.loading = false;
  state.marketMomentum = action.payload;
})

.addCase(getMarketMomentum.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
  },
});

export default dashboardSlice.reducer;
