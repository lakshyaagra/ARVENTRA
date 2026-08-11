import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import goalService from "../../services/goalService";

/* ============================================================
FETCH GOALS
============================================================ */

export const fetchGoals = createAsyncThunk(
    "goals/fetchGoals",
    async (params = {}, thunkAPI) => {
        try {
            return await goalService.getGoals(params);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch goals."
            );
        }
    }
);

/* ============================================================
FETCH GOAL BY ID
============================================================ */

export const fetchGoalById = createAsyncThunk(
    "goals/fetchGoalById",
    async (id, thunkAPI) => {
        try {
            return await goalService.getGoalById(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch goal."
            );
        }
    }
);

/* ============================================================
CREATE GOAL
============================================================ */

export const createGoal = createAsyncThunk(
    "goals/createGoal",
    async (goalData, thunkAPI) => {
        try {
            return await goalService.createGoal(goalData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create goal."
            );
        }
    }
);

/* ============================================================
UPDATE GOAL
============================================================ */

export const updateGoal = createAsyncThunk(
    "goals/updateGoal",
    async ({ id, goalData }, thunkAPI) => {
        try {
            return await goalService.updateGoal(id, goalData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update goal."
            );
        }
    }
);

/* ============================================================
DELETE GOAL
============================================================ */

export const deleteGoal = createAsyncThunk(
    "goals/deleteGoal",
    async (id, thunkAPI) => {
        try {
            return await goalService.deleteGoal(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete goal."
            );
        }
    }
);

/* ============================================================
INITIAL STATE
============================================================ */

const initialState = {
    goals: [],
    goal: null,
    loading: false,
    goalLoading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
    goalError: null,
    pagination: {
        currPage: 1,
        totalGoals: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    },
};

/* ============================================================
SLICE
============================================================ */

const goalSlice = createSlice({
    name: "goals",
    initialState,
    reducers: {
        clearGoals: (state) => {
            state.goals = [];
            state.error = null;
            state.pagination = {
                currPage: 1,
                totalGoals: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
            };
        },
        clearGoal: (state) => {
            state.goal = null;
            state.goalError = null;
        },
        clearGoalError: (state) => {
            state.error = null;
            state.goalError = null;
        },
    },

    extraReducers: (builder) => {
        /* ========================================================
           FETCH GOALS
        ======================================================== */

        builder
            .addCase(fetchGoals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGoals.fulfilled, (state, action) => {
                state.loading = false;
                state.goals = action.payload.goals || [];
                state.pagination = {
                    currPage: action.payload.currPage || 1,
                    totalGoals: action.payload.totalGoals || 0,
                    totalPages: action.payload.totalPages || 0,
                    hasNextPage: action.payload.hasNextPage || false,
                    hasPreviousPage:
                        action.payload.hasPreviousPage || false,
                };
            })
            .addCase(fetchGoals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* ========================================================
           FETCH GOAL BY ID
        ======================================================== */

        builder
            .addCase(fetchGoalById.pending, (state) => {
                state.goalLoading = true;
                state.goalError = null;
            })
            .addCase(fetchGoalById.fulfilled, (state, action) => {
                state.goalLoading = false;
                state.goal = action.payload.goal;
            })
            .addCase(fetchGoalById.rejected, (state, action) => {
                state.goalLoading = false;
                state.goalError = action.payload;
            });

        /* ========================================================
           CREATE GOAL
        ======================================================= */

        builder
            .addCase(createGoal.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createGoal.fulfilled, (state, action) => {
                state.creating = false;
                if (action.payload.goal) {
                    state.goals.unshift(action.payload.goal);
                    state.pagination.totalGoals += 1;
                }
            })
            .addCase(createGoal.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
            });

        /* ========================================================
           UPDATE GOAL
        ======================================================== */

        builder
            .addCase(updateGoal.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateGoal.fulfilled, (state, action) => {
                state.updating = false;
                const updatedGoal = action.payload.goal;
                if (!updatedGoal) {
                    return;
                }
                state.goal = updatedGoal;
                const index = state.goals.findIndex(
                    (goal) => goal._id === updatedGoal._id
                );
                if (index !== -1) {
                    state.goals[index] = updatedGoal;
                }
            })
            .addCase(updateGoal.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
            });

        /* ========================================================
           DELETE GOAL
        ======================================================== */

        builder
            .addCase(deleteGoal.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })
            .addCase(deleteGoal.fulfilled, (state, action) => {
                state.deleting = false;
                const deletedGoal = action.payload.goal;
                if (deletedGoal) {
                    state.goals = state.goals.filter(
                        (goal) => goal._id !== deletedGoal._id
                    );
                    state.pagination.totalGoals = Math.max(
                        0,
                        state.pagination.totalGoals - 1
                    );
                }
                state.goal = null;
            })
            .addCase(deleteGoal.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
            });
    },
});

export const { clearGoals,clearGoal,clearGoalError } = goalSlice.actions;
export default goalSlice.reducer;