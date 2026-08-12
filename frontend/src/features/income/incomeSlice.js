import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import incomeService from "../../services/incomeService";

export const fetchIncomes = createAsyncThunk(
    "income/fetchIncomes",
    async (params = {}, thunkAPI) => {
        try {
            return await incomeService.getIncomes(params);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch incomes."
            );
        }
    }
);

export const fetchIncomeById = createAsyncThunk(
    "income/fetchIncomeById",
    async (id, thunkAPI) => {
        try {
            return await incomeService.getIncomeById(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch income."
            );
        }
    }
);

export const createIncome = createAsyncThunk(
    "income/createIncome",
    async (incomeData, thunkAPI) => {
        try {
            return await incomeService.createIncome(incomeData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create income."
            );
        }
    }
);

export const updateIncome = createAsyncThunk(
    "income/updateIncome",
    async ({ id, incomeData }, thunkAPI) => {
        try {
            return await incomeService.updateIncome(id, incomeData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update income."
            );
        }
    }
);

export const deleteIncome = createAsyncThunk(
    "income/deleteIncome",
    async (id, thunkAPI) => {
        try {
            return await incomeService.deleteIncome(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete income."
            );
        }
    }
);

const initialState = {
    incomes: [],
    income: null,

    loading: false,
    incomeLoading: false,

    creating: false,
    updating: false,
    deleting: false,

    error: null,
    incomeError: null,

    pagination: {
        currPage: 1,
        totalIncomes: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    },
};
const incomeSlice = createSlice({
    name: "income",

    initialState,

    reducers: {
        clearIncomes: (state) => {
            state.incomes = [];
            state.error = null;

            state.pagination = {
                currPage: 1,
                totalIncomes: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
            };
        },

        clearIncome: (state) => {
            state.income = null;
            state.incomeError = null;
        },

        clearIncomeError: (state) => {
            state.error = null;
            state.incomeError = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchIncomes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchIncomes.fulfilled, (state, action) => {
                state.loading = false;

                state.incomes =
                    action.payload.incomes || [];

                state.pagination = {
                    currPage:
                        action.payload.currPage || 1,

                    totalIncomes:
                        action.payload.totalIncomes || 0,

                    totalPages:
                        action.payload.totalPages || 0,

                    hasNextPage:
                        action.payload.hasNextPage || false,

                    hasPreviousPage:
                        action.payload.hasPreviousPage || false,
                };
            })

            .addCase(fetchIncomes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchIncomeById.pending, (state) => {
                state.incomeLoading = true;
                state.incomeError = null;
            })

            .addCase(fetchIncomeById.fulfilled, (state, action) => {
                state.incomeLoading = false;
                state.income = action.payload.income;
            })

            .addCase(fetchIncomeById.rejected, (state, action) => {
                state.incomeLoading = false;
                state.incomeError = action.payload;
            });

        builder
            .addCase(createIncome.pending, (state) => {
                state.creating = true;
                state.error = null;
            })

            .addCase(createIncome.fulfilled, (state, action) => {
                state.creating = false;

                if (action.payload.income) {
                    state.incomes.unshift(
                        action.payload.income
                    );

                    state.pagination.totalIncomes += 1;
                }
            })

            .addCase(createIncome.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
            });

        builder
            .addCase(updateIncome.pending, (state) => {
                state.updating = true;
                state.error = null;
            })

            .addCase(updateIncome.fulfilled, (state, action) => {
                state.updating = false;

                const updatedIncome =
                    action.payload.income;

                if (!updatedIncome) {
                    return;
                }

                state.income = updatedIncome;

                const index = state.incomes.findIndex(
                    (income) =>
                        income._id === updatedIncome._id
                );

                if (index !== -1) {
                    state.incomes[index] = updatedIncome;
                }
            })

            .addCase(updateIncome.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
            });

        builder
            .addCase(deleteIncome.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })

            .addCase(deleteIncome.fulfilled, (state, action) => {
                state.deleting = false;

                const deletedIncome =
                    action.payload.income;

                if (deletedIncome) {
                    state.incomes =
                        state.incomes.filter(
                            (income) =>
                                income._id !==
                                deletedIncome._id
                        );

                    state.pagination.totalIncomes =
                        Math.max(
                            0,
                            state.pagination.totalIncomes - 1
                        );
                }

                state.income = null;
            })

            .addCase(deleteIncome.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearIncomes,
    clearIncome,
    clearIncomeError,
} = incomeSlice.actions;

export default incomeSlice.reducer;