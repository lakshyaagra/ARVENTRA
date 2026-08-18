const Notification = require("../models/Notification");

const getAllNotifications = async (req, res) => {
    try {
        
        //pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 15;
        const skip = limit * (page - 1);

        const filter = { user: req.user.id };

        const totalNotifications = await Notification.countDocuments(filter);
        const totalPages = Math.ceil(totalNotifications / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            currPage: page,
            totalNotifications,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            notifications
        });

    }catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const getUnreadCount = async (req, res) => {
    try {
        const unreadCount = await Notification.countDocuments({
            user: req.user.id,
            isRead: false
        });
 
        res.status(200).json({
            success: true,
            unreadCount
        });
    } catch (err) {
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

module.exports={ getAllNotifications,getUnreadCount,markNotificationAsRead,
                 markAllNotificationsAsRead,deleteNotificationById,deleteAllNotifications };