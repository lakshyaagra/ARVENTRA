import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Bell,
    Check,
    CheckCheck,
    ChevronLeft,
    ChevronRight,
    Trash2,
    X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotificationById,
    deleteAllNotifications,
} from "../features/notifications/notificationSlice";

/* ============================================================
HELPERS
============================================================ */

const timeAgo = (dateString) => {
    const seconds = Math.floor(
        (Date.now() - new Date(dateString)) / 1000
    );

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

/* ============================================================
CONFIRM MODAL (clear-all)
============================================================ */

const ConfirmClearModal = ({ onClose, onConfirm, deleting }) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onMouseDown={onClose}
    >
        <div
            className="relative w-full max-w-sm rounded-2xl border border-[#293533] bg-[#171F1E] p-6 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-red-400">
                        Clear all
                    </p>
                    <h2 className="mt-2 text-lg font-medium text-slate-100">
                        Delete every notification?
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-[#1B2422] hover:text-slate-200"
                >
                    <X className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500">
                This removes your entire notification history. This
                can't be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-[#293533] px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-[#1B2422]"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={deleting}
                    className="rounded-lg bg-red-500/90 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {deleting ? "Clearing..." : "Clear all"}
                </button>
            </div>
        </div>
    </div>
);

/* ============================================================
PAGE
============================================================ */

const Notifications = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        notifications,
        unreadCount,
        loading,
        deleting,
        pagination,
    } = useSelector((state) => state.notifications);

    const [showClearModal, setShowClearModal] = useState(false);

    /* ========================================================
       FETCH
       ======================================================== */

    const loadNotifications = ({ page = 1 } = {}) => {
        dispatch(fetchNotifications({ page, limit: 15 }));
    };

    useEffect(() => {
        loadNotifications({ page: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ========================================================
       ACTIONS
       ======================================================== */

    const handleMarkRead = (id) => {
        dispatch(markNotificationRead(id));
    };

    const handleMarkAllRead = () => {
        dispatch(markAllNotificationsRead());
    };

    const handleDelete = (item) => {
        const isLastOnPage = notifications.length === 1;
        const currentPage = pagination.currPage || 1;
        const shouldGoBack = isLastOnPage && currentPage > 1;

        dispatch(deleteNotificationById(item._id)).then(() => {
            loadNotifications({
                page: shouldGoBack ? currentPage - 1 : currentPage,
            });
        });
    };

    const confirmClearAll = async () => {
        await dispatch(deleteAllNotifications());
        setShowClearModal(false);
    };

    /* ========================================================
       PAGINATION
       ======================================================== */

    const goToPreviousPage = () => {
        if (!pagination.hasPreviousPage) return;
        loadNotifications({ page: pagination.currPage - 1 });
    };

    const goToNextPage = () => {
        if (!pagination.hasNextPage) return;
        loadNotifications({ page: pagination.currPage + 1 });
    };

    /* ========================================================
       LOADING
       ======================================================== */

    if (loading && notifications.length === 0) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="text-sm text-slate-500">
                    Loading your notifications...
                </p>
            </div>
        );
    }

    /* ========================================================
       PAGE
       ======================================================== */

    return (
        <>
            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="mb-6 flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-teal-400"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to dashboard
                    </button>

                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Notifications
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
                        Your notifications
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                        Alerts, reminders, and insights about your
                        financial activity.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-2 rounded-lg border border-[#293533] px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-[#1B2422]"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Mark all read
                        </button>
                    )}

                    {notifications.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowClearModal(true)}
                            className="flex items-center gap-2 rounded-lg border border-red-900/30 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-950/20"
                        >
                            <Trash2 className="h-4 w-4" />
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            {/* LIST */}
            <section className="rounded-2xl border border-[#293533] bg-[#171F1E]">
                <div className="flex flex-col gap-2 border-b border-[#293533] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            History
                        </p>
                        <h2 className="mt-1 text-lg font-medium text-slate-100">
                            Notification history
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Bell className="h-3.5 w-3.5" aria-hidden="true" />
                        {pagination.totalNotifications || 0} total
                        {unreadCount > 0 && ` · ${unreadCount} unread`}
                    </div>
                </div>

                {notifications.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <Bell
                            className="mx-auto h-7 w-7 text-slate-600"
                            aria-hidden="true"
                        />
                        <h3 className="mt-4 text-sm font-medium text-slate-300">
                            No notifications yet
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                            Alerts about your goals, loans, and spending
                            will show up here as they happen.
                        </p>
                    </div>
                ) : (
                    <div>
                        {notifications.map((item) => (
                            <div
                                key={item._id}
                                className={`flex items-start justify-between gap-4 border-b border-[#293533] px-6 py-5 last:border-b-0 ${
                                    !item.isRead
                                        ? "bg-teal-500/3"
                                        : ""
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full">
                                        {!item.isRead && (
                                            <div className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-slate-200">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                            {item.message}
                                        </p>
                                        <p className="mt-2 text-xs text-slate-600">
                                            {timeAgo(item.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    {!item.isRead && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleMarkRead(item._id)
                                            }
                                            title="Mark as read"
                                            className="flex items-center gap-2 rounded-lg border border-[#293533] px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-[#1B2422] hover:text-slate-200"
                                        >
                                            <Check
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            />
                                            <span className="hidden sm:inline">
                                                Mark read
                                            </span>
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item)}
                                        title="Delete notification"
                                        className="flex items-center gap-2 rounded-lg border border-red-900/30 px-3 py-2 text-xs text-red-400 transition-colors hover:bg-red-950/20"
                                    >
                                        <Trash2
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                        <span className="hidden sm:inline">
                                            Delete
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* PAGINATION */}
            {pagination.totalPages > 0 && (
                <div className="mt-5 flex items-center justify-between rounded-xl border border-[#293533] bg-[#171F1E] px-5 py-4">
                    <button
                        type="button"
                        onClick={goToPreviousPage}
                        disabled={!pagination.hasPreviousPage || loading}
                        className="flex items-center gap-2 rounded-lg border border-[#293533] px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-[#1B2422] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        Previous
                    </button>

                    <p className="text-sm text-slate-500">
                        Page{" "}
                        <span className="text-slate-300">
                            {pagination.currPage}
                        </span>{" "}
                        of{" "}
                        <span className="text-slate-300">
                            {pagination.totalPages}
                        </span>
                    </p>

                    <button
                        type="button"
                        onClick={goToNextPage}
                        disabled={!pagination.hasNextPage || loading}
                        className="flex items-center gap-2 rounded-lg border border-[#293533] px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-[#1B2422] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
            )}

            {/* CLEAR ALL MODAL */}
            {showClearModal && (
                <ConfirmClearModal
                    onClose={() => setShowClearModal(false)}
                    onConfirm={confirmClearAll}
                    deleting={deleting}
                />
            )}
        </>
    );
};

export default Notifications;