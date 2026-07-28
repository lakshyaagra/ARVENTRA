const Notification = require("../models/Notification");

const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications
        });
    }catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const markNotificationAsRead = async (req, res) => {
    try {
        const id = req.params.id;
        const notification = await Notification.findOne({
            _id: id,
            user: req.user.id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            notification
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                user: req.user.id,
                isRead: false
            },
            {
                $set: {
                    isRead: true
                }
            }
        );
        res.status(200).json({
            success: true,
            message: "All notifications marked as read."
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const deleteNotificationById = async (req, res) => {
    try{
        const id = req.params.id;
        const notification = await Notification.findOne({
            _id: id,
            user: req.user.id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }
        await notification.deleteOne();

        res.status(200).json({
            success: true,
            message: "Notification deleted."
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const deleteAllNotifications = async (req, res) => {
    try {

        await Notification.deleteMany({
            user: req.user.id
        });

        res.status(200).json({
            success: true,
            message: "All notifications deleted."
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};
module.exports={ getAllNotifications,markNotificationAsRead,
                 markAllNotificationsAsRead,deleteNotificationById,deleteAllNotifications };