import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dashboardService from "../../services/dashboardService";

export const fetchDashboard = createAsyncThunk(
    "dashboard/fetchDashboard",
    async (_, thunkAPI) => {
        try {
            return await dashboardService.getDashboard();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch dashboard data."
            );
        }
    }
);

const initialState = {
    dashboard: null,
    loading: false,
    error: null
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        clearDashboard: (state) => {
            state.dashboard = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })


        .addCase(fetchDashboard.fulfilled, (state, action) => {
            state.loading = false;
            state.dashboard = action.payload.dashboard;
        })

        .addCase(fetchDashboard.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
}

    });

export const { clearDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;
