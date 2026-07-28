const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {getAllNotifications,markNotificationAsRead,markAllNotificationsAsRead,
    deleteNotificationById,deleteAllNotifications}=require("../controllers/notificationController");


// Get Notifications
router.get("/",authMiddleware,getAllNotifications);

// Mark One Notification Read
router.patch("/:id/read",authMiddleware,markNotificationAsRead);

// Mark All Notifications Read
router.patch("/read-all",authMiddleware,markAllNotificationsAsRead);

// Delete One Notification
router.delete("/:id",authMiddleware,deleteNotificationById);

// Delete All Notifications
router.delete("/",authMiddleware,deleteAllNotifications);

module.exports = router;
