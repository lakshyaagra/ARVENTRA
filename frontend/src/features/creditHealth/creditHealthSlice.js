import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import creditHealthService from "../../services/creditHealthService";

export const fetchCreditHealth = createAsyncThunk(
    "creditHealth/fetchCreditHealth",
    async (_, thunkAPI) => {
        try {
            return await creditHealthService.getCreditHealth();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch credit health data."
            );
        }
    }
);

const initialState = {
    creditHealth: null,
    loading: false,
    error: null,
};

const creditHealthSlice = createSlice({
    name: "creditHealth",
    initialState,

    reducers: {
        clearCreditHealth: (state) => {
            state.creditHealth = null;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchCreditHealth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })


            .addCase(fetchCreditHealth.fulfilled, (state, action) => {
                state.loading = false;
                state.creditHealth = action.payload.creditHealth;
            })

            .addCase(fetchCreditHealth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export const { clearCreditHealth } = creditHealthSlice.actions;
export default creditHealthSlice.reducer;
