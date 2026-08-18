import api from "../api/axios";
 
const getNotifications = async ({ page = 1, limit = 15 } = {}) => {
    const response = await api.get("/notifications", {
        params: { page, limit },
    });
    return response.data;
};
 
const getUnreadCount = async () => {
    const response = await api.get("/notifications/unread-count");
    return response.data;
};
 
const markNotificationAsRead = async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
};
 
const markAllNotificationsAsRead = async () => {
    const response = await api.patch("/notifications/read-all");
    return response.data;
};
 
const deleteNotification = async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
};
 
const deleteAllNotifications = async () => {
    const response = await api.delete("/notifications");
    return response.data;
};
 
const notificationService = {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications,
};
 
export default notificationService;