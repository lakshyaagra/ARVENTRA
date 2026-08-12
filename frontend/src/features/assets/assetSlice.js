import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import assetService from "../../services/assetService";

export const fetchAssets = createAsyncThunk(
    "asset/fetchAssets",
    async (params = {}, thunkAPI) => {
        try {
            return await assetService.getAssets(params);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch assets."
            );
        }
    }
);

export const fetchAssetById = createAsyncThunk(
    "asset/fetchAssetById",
    async (id, thunkAPI) => {
        try {
            return await assetService.getAssetById(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch asset."
            );
        }
    }
);

export const createAsset = createAsyncThunk(
    "asset/createAsset",
    async (assetData, thunkAPI) => {
        try {
            return await assetService.createAsset(assetData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create asset."
            );
        }
    }
);

export const updateAsset = createAsyncThunk(
    "asset/updateAsset",
    async ({ id, assetData }, thunkAPI) => {
        try {
            return await assetService.updateAsset(id, assetData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update asset."
            );
        }
    }
);

export const deleteAsset = createAsyncThunk(
    "asset/deleteAsset",
    async (id, thunkAPI) => {
        try {
            return await assetService.deleteAsset(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete asset."
            );
        }
    }
);

const initialState = {
    assets: [],
    asset: null,

    loading: false,
    assetLoading: false,

    creating: false,
    updating: false,
    deleting: false,

    error: null,
    assetError: null,

    pagination: {
        currPage: 1,
        totalAssets: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    },
};

const assetSlice = createSlice({
    name: "asset",

    initialState,

    reducers: {
        clearAssets: (state) => {
            state.assets = [];
            state.error = null;

            state.pagination = {
                currPage: 1,
                totalAssets: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
            };
        },

        clearAsset: (state) => {
            state.asset = null;
            state.assetError = null;
        },

        clearAssetError: (state) => {
            state.error = null;
            state.assetError = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchAssets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAssets.fulfilled, (state, action) => {
                state.loading = false;

                state.assets =
                    action.payload.assets || [];

                state.pagination = {
                    currPage:
                        action.payload.currPage || 1,

                    totalAssets:
                        action.payload.totalAssets || 0,

                    totalPages:
                        action.payload.totalPages || 0,

                    hasNextPage:
                        action.payload.hasNextPage || false,

                    hasPreviousPage:
                        action.payload.hasPreviousPage || false,
                };
            })

            .addCase(fetchAssets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchAssetById.pending, (state) => {
                state.assetLoading = true;
                state.assetError = null;
            })

            .addCase(fetchAssetById.fulfilled, (state, action) => {
                state.assetLoading = false;
                state.asset = action.payload.asset;
            })

            .addCase(fetchAssetById.rejected, (state, action) => {
                state.assetLoading = false;
                state.assetError = action.payload;
            });

        builder
            .addCase(createAsset.pending, (state) => {
                state.creating = true;
                state.error = null;
            })

            .addCase(createAsset.fulfilled, (state, action) => {
                state.creating = false;

                if (action.payload.asset) {
                    state.assets.unshift(
                        action.payload.asset
                    );

                    state.pagination.totalAssets += 1;
                }
            })

            .addCase(createAsset.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
            });

        builder
            .addCase(updateAsset.pending, (state) => {
                state.updating = true;
                state.error = null;
            })

            .addCase(updateAsset.fulfilled, (state, action) => {
                state.updating = false;

                const updatedAsset =
                    action.payload.asset;

                if (!updatedAsset) {
                    return;
                }

                state.asset = updatedAsset;

                const index = state.assets.findIndex(
                    (asset) =>
                        asset._id === updatedAsset._id
                );

                if (index !== -1) {
                    state.assets[index] = updatedAsset;
                }
            })

            .addCase(updateAsset.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
            });

        builder
            .addCase(deleteAsset.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })

            .addCase(deleteAsset.fulfilled, (state, action) => {
                state.deleting = false;

                const deletedAsset =
                    action.payload.asset;

                if (deletedAsset) {
                    state.assets =
                        state.assets.filter(
                            (asset) =>
                                asset._id !==
                                deletedAsset._id
                        );

                    state.pagination.totalAssets =
                        Math.max(
                            0,
                            state.pagination.totalAssets - 1
                        );
                }

                state.asset = null;
            })

            .addCase(deleteAsset.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearAssets,
    clearAsset,
    clearAssetError,
} = assetSlice.actions;

export default assetSlice.reducer;