import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import expenseService from "../../services/expenseService";

export const fetchExpenses = createAsyncThunk(
    "expense/fetchExpenses",
    async (params = {}, thunkAPI) => {
        try {
            return await expenseService.getExpenses(params);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch expenses."
            );
        }
    }
);

export const fetchExpenseById = createAsyncThunk(
    "expense/fetchExpenseById",
    async (id, thunkAPI) => {
        try {
            return await expenseService.getExpenseById(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch expense."
            );
        }
    }
);

export const createExpense = createAsyncThunk(
    "expense/createExpense",
    async (expenseData, thunkAPI) => {
        try {
            return await expenseService.createExpense(expenseData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create expense."
            );
        }
    }
);

export const updateExpense = createAsyncThunk(
    "expense/updateExpense",
    async ({ id, expenseData }, thunkAPI) => {
        try {
            return await expenseService.updateExpense(id, expenseData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update expense."
            );
        }
    }
);

export const deleteExpense = createAsyncThunk(
    "expense/deleteExpense",
    async (id, thunkAPI) => {
        try {
            return await expenseService.deleteExpense(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete expense."
            );
        }
    }
);

const initialState = {
    expenses: [],
    expense: null,

    loading: false,
    creating: false,
    updating: false,
    deleting: false,

    error: null,
    expenseLoading: false,
    expenseError: null,

    pagination: {
        currPage: 1,
        totalPages: 0,
        totalExpenses: 0,
        hasPreviousPage: false,
        hasNextPage: false,
    },
};
const expenseSlice = createSlice({
    name: "expenses",

    initialState,

    reducers: {
        clearExpenses: (state) => {
            state.expenses = [];
            state.error = null;

            state.pagination = {
                currPage: 1,
                totalExpenses: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
            };
        },

        clearExpense: (state) => {
            state.expense = null;
            state.expenseError = null;
        },

        clearExpenseError: (state) => {
            state.error = null;
            state.expenseError = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;

                state.expenses =
                    action.payload.expenses || [];

                state.pagination = {
                    currPage:
                        action.payload.currPage || 1,

                    totalExpenses:
                        action.payload.totalExpenses || 0,

                    totalPages:
                        action.payload.totalPages || 0,

                    hasNextPage:
                        action.payload.hasNextPage || false,

                    hasPreviousPage:
                        action.payload.hasPreviousPage || false,
                };
            })

            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchExpenseById.pending, (state) => {
                state.expenseLoading = true;
                state.expenseError = null;
            })

            .addCase(fetchExpenseById.fulfilled, (state, action) => {
                state.expenseLoading = false;
                state.expense = action.payload.expense;
            })

            .addCase(fetchExpenseById.rejected, (state, action) => {
                state.expenseLoading = false;
                state.expenseError = action.payload;
            });

        builder
            .addCase(createExpense.pending, (state) => {
                state.creating = true;
                state.error = null;
            })

            .addCase(createExpense.fulfilled, (state, action) => {
                state.creating = false;

                if (action.payload.expense) {
                    state.expenses.unshift(
                        action.payload.expense
                    );

                    state.pagination.totalExpenses += 1;
                }
            })

            .addCase(createExpense.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
            });

        builder
            .addCase(updateExpense.pending, (state) => {
                state.updating = true;
                state.error = null;
            })

            .addCase(updateExpense.fulfilled, (state, action) => {
                state.updating = false;

                const updatedExpense =
                    action.payload.expense;

                if (!updatedExpense) {
                    return;
                }

                state.expense = updatedExpense;

                const index = state.expenses.findIndex(
                    (expense) =>
                        expense._id === updatedExpense._id
                );

                if (index !== -1) {
                    state.expenses[index] = updatedExpense;
                }
            })

            .addCase(updateExpense.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
            });

        builder
            .addCase(deleteExpense.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })

            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.deleting = false;

                const deletedExpense =
                    action.payload.expense;

                if (deletedExpense) {
                    state.expenses =
                        state.expenses.filter(
                            (expense) =>
                                expense._id !==
                                deletedExpense._id
                        );

                    state.pagination.totalExpenses =
                        Math.max(
                            0,
                            state.pagination.totalExpenses - 1
                        );
                }

                state.expense = null;
            })

            .addCase(deleteExpense.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearExpenses,
    clearExpense,
    clearExpenseError,
} = expenseSlice.actions;

export default expenseSlice.reducer;