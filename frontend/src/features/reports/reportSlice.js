import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reportService from "../../services/reportService";

export const fetchSummaryReport = createAsyncThunk(
  "report/fetchSummaryReport",
  async (params = {}, thunkAPI) => {
    try {
      return await reportService.getSummaryReport(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch summary report.",
      );
    }
  },
);

export const fetchIncomeCategoryReport = createAsyncThunk(
  "report/fetchIncomeCategoryReport",
  async (params = {}, thunkAPI) => {
    try {
      return await reportService.getIncomeCategoryReport(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch income category report.",
      );
    }
  },
);

export const fetchExpenseCategoryReport = createAsyncThunk(
  "report/fetchExpenseCategoryReport",
  async (params = {}, thunkAPI) => {
    try {
      return await reportService.getExpenseCategoryReport(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch expense category report.",
      );
    }
  },
);

export const fetchMonthlyIncomeReport = createAsyncThunk(
  "report/fetchMonthlyIncomeReport",
  async (_, thunkAPI) => {
    try {
      return await reportService.getMonthlyIncomeReport();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch monthly income report.",
      );
    }
  },
);

export const fetchMonthlyExpenseReport = createAsyncThunk(
  "report/fetchMonthlyExpenseReport",
  async (_, thunkAPI) => {
    try {
      return await reportService.getMonthlyExpenseReport();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch monthly expense report.",
      );
    }
  },
);

export const fetchLoanStatusReport = createAsyncThunk(
  "report/fetchLoanStatusReport",
  async (_, thunkAPI) => {
    try {
      return await reportService.getLoanStatusReport();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch loan status report.",
      );
    }
  },
);

export const fetchGoalStatusReport = createAsyncThunk(
  "report/fetchGoalStatusReport",
  async (_, thunkAPI) => {
    try {
      return await reportService.getGoalStatusReport();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch goal status report.",
      );
    }
  },
);

const initialState = {
  summary: null,

  incomeCategory: [],
  expenseCategory: [],

  monthlyIncome: [],
  monthlyExpense: [],

  loanStatus: [],
  goalStatus: [],

  loading: false,
  summaryLoading: false,
  incomeCategoryLoading: false,
  expenseCategoryLoading: false,
  monthlyIncomeLoading: false,
  monthlyExpenseLoading: false,
  loanStatusLoading: false,
  goalStatusLoading: false,

  error: null,

  summaryError: null,
  incomeCategoryError: null,
  expenseCategoryError: null,
  monthlyIncomeError: null,
  monthlyExpenseError: null,
  loanStatusError: null,
  goalStatusError: null,
};

const reportSlice = createSlice({
  name: "report",

  initialState,

  reducers: {
    clearReports: (state) => {
      state.summary = null;

      state.incomeCategory = [];
      state.expenseCategory = [];

      state.monthlyIncome = [];
      state.monthlyExpense = [];

      state.loanStatus = [];
      state.goalStatus = [];

      state.error = null;
      state.summaryError = null;
      state.incomeCategoryError = null;
      state.expenseCategoryError = null;
      state.monthlyIncomeError = null;
      state.monthlyExpenseError = null;
      state.loanStatusError = null;
      state.goalStatusError = null;
    },

    clearReportErrors: (state) => {
      state.error = null;
      state.summaryError = null;
      state.incomeCategoryError = null;
      state.expenseCategoryError = null;
      state.monthlyIncomeError = null;
      state.monthlyExpenseError = null;
      state.loanStatusError = null;
      state.goalStatusError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSummaryReport.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })

      .addCase(fetchSummaryReport.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload.report || null;
      })

      .addCase(fetchSummaryReport.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.payload;
      });

    builder
      .addCase(fetchIncomeCategoryReport.pending, (state) => {
        state.incomeCategoryLoading = true;
        state.incomeCategoryError = null;
      })

      .addCase(fetchIncomeCategoryReport.fulfilled, (state, action) => {
        state.incomeCategoryLoading = false;
        state.incomeCategory = action.payload.report || [];
      })

      .addCase(fetchIncomeCategoryReport.rejected, (state, action) => {
        state.incomeCategoryLoading = false;
        state.incomeCategoryError = action.payload;
      });

    builder
      .addCase(fetchExpenseCategoryReport.pending, (state) => {
        state.expenseCategoryLoading = true;
        state.expenseCategoryError = null;
      })

      .addCase(fetchExpenseCategoryReport.fulfilled, (state, action) => {
        state.expenseCategoryLoading = false;
        state.expenseCategory = action.payload.report || [];
      })

      .addCase(fetchExpenseCategoryReport.rejected, (state, action) => {
        state.expenseCategoryLoading = false;
        state.expenseCategoryError = action.payload;
      });

    builder
      .addCase(fetchMonthlyIncomeReport.pending, (state) => {
        state.monthlyIncomeLoading = true;
        state.monthlyIncomeError = null;
      })

      .addCase(fetchMonthlyIncomeReport.fulfilled, (state, action) => {
        state.monthlyIncomeLoading = false;
        state.monthlyIncome = action.payload.report || [];
      })

      .addCase(fetchMonthlyIncomeReport.rejected, (state, action) => {
        state.monthlyIncomeLoading = false;
        state.monthlyIncomeError = action.payload;
      });

    builder
      .addCase(fetchMonthlyExpenseReport.pending, (state) => {
        state.monthlyExpenseLoading = true;
        state.monthlyExpenseError = null;
      })

      .addCase(fetchMonthlyExpenseReport.fulfilled, (state, action) => {
        state.monthlyExpenseLoading = false;
        state.monthlyExpense = action.payload.report || [];
      })

      .addCase(fetchMonthlyExpenseReport.rejected, (state, action) => {
        state.monthlyExpenseLoading = false;
        state.monthlyExpenseError = action.payload;
      });

    builder
      .addCase(fetchLoanStatusReport.pending, (state) => {
        state.loanStatusLoading = true;
        state.loanStatusError = null;
      })

      .addCase(fetchLoanStatusReport.fulfilled, (state, action) => {
        state.loanStatusLoading = false;
        state.loanStatus = action.payload.report || [];
      })

      .addCase(fetchLoanStatusReport.rejected, (state, action) => {
        state.loanStatusLoading = false;
        state.loanStatusError = action.payload;
      });

    builder
      .addCase(fetchGoalStatusReport.pending, (state) => {
        state.goalStatusLoading = true;
        state.goalStatusError = null;
      })

      .addCase(fetchGoalStatusReport.fulfilled, (state, action) => {
        state.goalStatusLoading = false;
        state.goalStatus = action.payload.report || [];
      })

      .addCase(fetchGoalStatusReport.rejected, (state, action) => {
        state.goalStatusLoading = false;
        state.goalStatusError = action.payload;
      });
  },
});

export const { clearReports, clearReportErrors } = reportSlice.actions;
export default reportSlice.reducer;
