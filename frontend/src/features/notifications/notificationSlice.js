import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import notificationService from "../../services/notificationService";

export const fetchNotifications = createAsyncThunk(
    "notifications/fetchNotifications",
    async (params = {}, thunkAPI) => {
        try {
            return await notificationService.getNotifications(params);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch notifications."
            );
        }
    }
);

export const fetchUnreadCount = createAsyncThunk(
    "notifications/fetchUnreadCount",
    async (_, thunkAPI) => {
        try {
            return await notificationService.getUnreadCount();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch unread count."
            );
        }
    }
);

export const markNotificationRead = createAsyncThunk(
    "notifications/markNotificationRead",
    async (id, thunkAPI) => {
        try {
            return await notificationService.markNotificationAsRead(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to mark notification as read."
            );
        }
    }
);

export const markAllNotificationsRead = createAsyncThunk(
    "notifications/markAllNotificationsRead",
    async (_, thunkAPI) => {
        try {
            return await notificationService.markAllNotificationsAsRead();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to mark all notifications as read."
            );
        }
    }
);

export const deleteNotificationById = createAsyncThunk(
    "notifications/deleteNotificationById",
    async (id, thunkAPI) => {
        try {
            const response = await notificationService.deleteNotification(id);
            return { ...response, id };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete notification."
            );
        }
    }
);

export const deleteAllNotifications = createAsyncThunk(
    "notifications/deleteAllNotifications",
    async (_, thunkAPI) => {
        try {
            return await notificationService.deleteAllNotifications();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete all notifications."
            );
        }
    }
);

const initialState = {
    notifications: [],
    unreadCount: 0,

    loading: false,
    markingRead: false,
    deleting: false,

    error: null,

    pagination: {
        currPage: 1,
        totalPages: 0,
        totalNotifications: 0,
        hasPreviousPage: false,
        hasNextPage: false,
    },
};

const notificationSlice = createSlice({
    name: "notifications",

    initialState,

    reducers: {
        clearNotificationsError: (state) => {
            state.error = null;
        },

        notificationReceived: (state, action) => {
            state.notifications.unshift(action.payload);
            state.pagination.totalNotifications += 1;
            // Only increment unreadCount if the incoming notification is unread
            if (!action.payload.isRead) {
                state.unreadCount += 1;
            }
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload.notifications || [];
                state.pagination = {
                    currPage: action.payload.currPage || 1,
                    totalPages: action.payload.totalPages || 0,
                    totalNotifications: action.payload.totalNotifications || 0,
                    hasNextPage: action.payload.hasNextPage || false,
                    hasPreviousPage: action.payload.hasPreviousPage || false,
                };
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // 🟢 FIX 1: Support common response structures for unreadCount
        builder
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                const count = 
                    action.payload?.unreadCount ?? 
                    action.payload?.count ?? 
                    action.payload?.unread ?? 
                    (typeof action.payload === "number" ? action.payload : 0);

                state.unreadCount = Number(count) || 0;
            });

        // 🟢 FIX 2: Always decrement unreadCount when marking as read
        builder
            .addCase(markNotificationRead.pending, (state) => {
                state.markingRead = true;
            })
            .addCase(markNotificationRead.fulfilled, (state, action) => {
                state.markingRead = false;

                const updated = action.payload.notification || action.payload;
                if (!updated) return;

                const index = state.notifications.findIndex(
                    (item) => item._id === updated._id
                );

                if (index !== -1) {
                    const wasUnread = !state.notifications[index].isRead;
                    state.notifications[index] = updated;

                    if (wasUnread) {
                        state.unreadCount = Math.max(0, state.unreadCount - 1);
                    }
                } else {
                    // Decrement anyway if marked read before dropdown list fetched
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markNotificationRead.rejected, (state, action) => {
                state.markingRead = false;
                state.error = action.payload;
            });

        builder
            .addCase(markAllNotificationsRead.fulfilled, (state) => {
                state.notifications = state.notifications.map(
                    (item) => ({ ...item, isRead: true })
                );
                state.unreadCount = 0;
            });

        builder
            .addCase(deleteNotificationById.pending, (state) => {
                state.deleting = true;
            })
            .addCase(deleteNotificationById.fulfilled, (state, action) => {
                state.deleting = false;

                const deletedId = action.payload.id;
                const deletedItem = state.notifications.find(
                    (item) => item._id === deletedId
                );

                if (deletedItem && !deletedItem.isRead) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }

                state.notifications = state.notifications.filter(
                    (item) => item._id !== deletedId
                );

                state.pagination.totalNotifications = Math.max(
                    0,
                    state.pagination.totalNotifications - 1
                );
            })
            .addCase(deleteNotificationById.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
            });

        builder
            .addCase(deleteAllNotifications.fulfilled, (state) => {
                state.notifications = [];
                state.unreadCount = 0;
                state.pagination.totalNotifications = 0;
                state.pagination.totalPages = 0;
            });
    },
});

export const { clearNotificationsError, notificationReceived } =
    notificationSlice.actions;

export default notificationSlice.reducer;