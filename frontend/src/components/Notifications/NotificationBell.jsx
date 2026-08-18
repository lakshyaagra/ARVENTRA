import React, { useEffect, useRef, useState } from "react";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotificationById,
} from "../../features/notifications/notificationSlice";

/* =====================================================================
   HELPERS
===================================================================== */

const timeAgo = (dateString) => {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

/* =====================================================================
   NOTIFICATION ITEM
===================================================================== */

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  const { _id, title, message, isRead, createdAt } = notification;

  return (
    <div
      className={`group flex items-start gap-3 border-b border-[#24302D] px-4 py-3 last:border-b-0 ${
        !isRead ? "bg-teal-500/4" : ""
      }`}
    >
      {/* UNREAD DOT */}
      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full">
        {!isRead && <div className="h-1.5 w-1.5 rounded-full bg-teal-400" />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-200">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{message}</p>
        <p className="mt-1.5 text-[11px] text-slate-600">
          {timeAgo(createdAt)}
        </p>
      </div>

      {/* ACTIONS — visible on hover */}
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!isRead && (
          <button
            type="button"
            onClick={() => onMarkRead(_id)}
            title="Mark as read"
            className="rounded-md p-1.5 text-slate-600 transition-colors hover:bg-[#1B2422] hover:text-teal-400"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(_id)}
          title="Delete"
          className="rounded-md p-1.5 text-slate-600 transition-colors hover:bg-[#1B2422] hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

/* =====================================================================
   NOTIFICATION BELL
===================================================================== */

const NotificationBell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const panelRef = useRef(null);

  const [open, setOpen] = useState(false);

  const { notifications, unreadCount, loading } = useSelector(
    (state) => state.notifications
  );

  // Unread count should be known immediately on load (for the badge),
  // independent of whether the dropdown has ever been opened.
  useEffect(() => {
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  // The notification LIST itself is fetched lazily — only when the
  // dropdown is actually opened. No point paying for a fetch of 5-15
  // notifications on every single page load if the user never checks.
  useEffect(() => {
    if (open) {
      dispatch(fetchNotifications({ limit: 5 }));
    }
  }, [open, dispatch]);

  // Close the dropdown when clicking outside it.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteNotificationById(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate("/notifications");
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* BELL TRIGGER */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#293533] text-slate-400 transition-colors hover:border-[#40504D] hover:text-slate-200"
      >
        <Bell className="h-4 w-4" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-500 px-1 text-[10px] font-semibold text-[#0E1514]">
            {unreadCount > 99 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN PANEL */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-[#293533] bg-[#171F1E] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-[#293533] px-4 py-3">
            <p className="text-sm font-medium text-slate-200">
              Notifications
            </p>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-teal-400 transition-colors hover:text-teal-300"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* LIST */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-6 text-center text-xs text-slate-600">
                Loading...
              </p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-slate-600">
                You're all caught up.
              </p>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

          {/* FOOTER */}
          <button
            type="button"
            onClick={handleViewAll}
            className="w-full border-t border-[#293533] py-3 text-center text-xs font-medium text-teal-400 transition-colors hover:bg-[#1B2422] hover:text-teal-300"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
