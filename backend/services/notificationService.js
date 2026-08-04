const Notification = require("../models/Notification");
const { emitNotification } = require("../socket/socketEmitter");

const createNotification = async ({user,title,message,type}) => {
    const notification = await Notification.create({user,title,message,type});
    emitNotification(user, notification);
    return notification;
};
module.exports = { createNotification };
