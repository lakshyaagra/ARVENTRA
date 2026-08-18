const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {getAllNotifications,markNotificationAsRead,markAllNotificationsAsRead,getUnreadCount,
    deleteNotificationById,deleteAllNotifications}=require("../controllers/notificationController");


// Get Notifications
router.get("/",authMiddleware,getAllNotifications);

// Get Unread Count (for bell badge)
router.get("/unread-count",authMiddleware,getUnreadCount);

// Mark One Notification Read
router.patch("/:id/read",authMiddleware,markNotificationAsRead);

// Mark All Notifications Read
router.patch("/read-all",authMiddleware,markAllNotificationsAsRead);

// Delete One Notification
router.delete("/:id",authMiddleware,deleteNotificationById);

// Delete All Notifications
router.delete("/",authMiddleware,deleteAllNotifications);

module.exports = router;
