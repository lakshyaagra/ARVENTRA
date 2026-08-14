import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import loanService from "../../services/loanService";

export const fetchLoans = createAsyncThunk(
  "loan/fetchLoans",
  async (params = {}, thunkAPI) => {
    try {
      return await loanService.getLoans(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch loans.",
      );
    }
  },
);

export const fetchLoanById = createAsyncThunk(
  "loan/fetchLoanById",
  async (id, thunkAPI) => {
    try {
      return await loanService.getLoanById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch loan.",
      );
    }
  },
);

export const createLoan = createAsyncThunk(
  "loan/createLoan",
  async (loanData, thunkAPI) => {
    try {
      return await loanService.createLoan(loanData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create loan.",
      );
    }
  },
);

export const updateLoan = createAsyncThunk(
  "loan/updateLoan",
  async ({ id, loanData }, thunkAPI) => {
    try {
      return await loanService.updateLoan(id, loanData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update loan.",
      );
    }
  },
);

export const deleteLoan = createAsyncThunk(
  "loan/deleteLoan",
  async (id, thunkAPI) => {
    try {
      return await loanService.deleteLoan(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete loan.",
      );
    }
  },
);


const initialState = {
  loans: [],
  loan: null,

  loading: false,
  loanLoading: false,

  creating: false,
  updating: false,
  deleting: false,

  error: null,
  loanError: null,

  pagination: {
    currPage: 1,
    totalLoans: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

// ===============================
// LOAN SLICE
// ===============================

const loanSlice = createSlice({
  name: "loan",

  initialState,

  reducers: {
    // -------------------------------
    // CLEAR ALL LOANS
    // -------------------------------

    clearLoans: (state) => {
      state.loans = [];
      state.error = null;
      state.pagination = {
        currPage: 1,
        totalLoans: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    },

    // -------------------------------
    // CLEAR SINGLE LOAN
    // -------------------------------

    clearLoan: (state) => {
      state.loan = null;
      state.loanError = null;
    },


    clearLoanError: (state) => {
      state.error = null;
      state.loanError = null;
    },
  },

  extraReducers: (builder) => {
    // =====================================
    // FETCH LOANS
    // =====================================

    builder

      .addCase(fetchLoans.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.loading = false;

        state.loans = action.payload.loans || [];

        state.pagination = {
          currPage: action.payload.currPage || 1,

          totalLoans: action.payload.totalLoans || 0,

          totalPages: action.payload.totalPages || 0,

          hasNextPage: action.payload.hasNextPage || false,

          hasPreviousPage: action.payload.hasPreviousPage || false,
        };
      })

      .addCase(fetchLoans.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });

    // =====================================
    // FETCH LOAN BY ID
    // =====================================

    builder

      .addCase(fetchLoanById.pending, (state) => {
        state.loanLoading = true;

        state.loanError = null;
      })

      .addCase(fetchLoanById.fulfilled, (state, action) => {
        state.loanLoading = false;

        state.loan = action.payload.loan;
      })

      .addCase(fetchLoanById.rejected, (state, action) => {
        state.loanLoading = false;

        state.loanError = action.payload;
      });

    // =====================================
    // CREATE LOAN
    // =====================================

    builder

      .addCase(createLoan.pending, (state) => {
        state.creating = true;

        state.error = null;
      })

      .addCase(createLoan.fulfilled, (state, action) => {
        state.creating = false;

        if (action.payload.loan) {
          state.loans.unshift(action.payload.loan);

          state.pagination.totalLoans += 1;
        }
      })

      .addCase(createLoan.rejected, (state, action) => {
        state.creating = false;

        state.error = action.payload;
      });

    // =====================================
    // UPDATE LOAN
    // =====================================

    builder

      .addCase(updateLoan.pending, (state) => {
        state.updating = true;

        state.error = null;
      })

      .addCase(updateLoan.fulfilled, (state, action) => {
        state.updating = false;

        const updatedLoan = action.payload.loan;

        if (!updatedLoan) {
          return;
        }

        // Update selected loan

        state.loan = updatedLoan;

        // Update loan inside list

        const index = state.loans.findIndex(
          (loan) => loan._id === updatedLoan._id,
        );

        if (index !== -1) {
          state.loans[index] = updatedLoan;
        }
      })

      .addCase(updateLoan.rejected, (state, action) => {
        state.updating = false;

        state.error = action.payload;
      });

    // =====================================
    // DELETE LOAN
    // =====================================

    builder

      .addCase(deleteLoan.pending, (state) => {
        state.deleting = true;

        state.error = null;
      })

      .addCase(deleteLoan.fulfilled, (state, action) => {
        state.deleting = false;

        const deletedLoan = action.payload.loan;

        if (deletedLoan) {
          state.loans = state.loans.filter(
            (loan) => loan._id !== deletedLoan._id,
          );

          state.pagination.totalLoans = Math.max(
            0,
            state.pagination.totalLoans - 1,
          );
        }

        state.loan = null;
      })

      .addCase(deleteLoan.rejected, (state, action) => {
        state.deleting = false;

        state.error = action.payload;
      });
  },
});

export const { clearLoans, clearLoan, clearLoanError } = loanSlice.actions;
export default loanSlice.reducer;
