import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import settingsService from "../../services/settingsService";

/* =========================================================
   FETCH SETTINGS
========================================================= */

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, thunkAPI) => {
    try {
      return await settingsService.getSettings();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load settings."
      );
    }
  }
);

/* =========================================================
   UPDATE SETTINGS
========================================================= */

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (settingsData, thunkAPI) => {
    try {
      return await settingsService.updateSettings(settingsData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update settings."
      );
    }
  }
);

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  settings: null,

  loading: false,
  updating: false,

  error: null,
  updateError: null,

  updateSuccess: false,
};

/* =========================================================
   SLICE
========================================================= */

const settingsSlice = createSlice({
  name: "settings",

  initialState,

  reducers: {
    clearSettingsError: (state) => {
      state.error = null;
      state.updateError = null;
    },

    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },

    clearSettings: (state) => {
      state.settings = null;
      state.error = null;
      state.updateError = null;
      state.updateSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =====================================================
         FETCH SETTINGS
      ===================================================== */

      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload.settings || action.payload || null;
      })

      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* =====================================================
         UPDATE SETTINGS
      ===================================================== */

      .addCase(updateSettings.pending, (state) => {
        state.updating = true;
        state.updateError = null;
        state.updateSuccess = false;
      })

      .addCase(updateSettings.fulfilled, (state, action) => {
        state.updating = false;

        if (action.payload.settings) {
          state.settings = action.payload.settings;
        } else if (action.payload) {
          state.settings = action.payload;
        }

        state.updateSuccess = true;
      })

      .addCase(updateSettings.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      });
  },
});

export const {
  clearSettingsError,
  clearUpdateSuccess,
  clearSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;