// const { userSocketMap } = require("./socket");

let ioInstance = null;
const setIO = (io) => {
    ioInstance = io;
};

const emitNotification = (userId, notification) => {
    if (!ioInstance) return;

    ioInstance.to(userId.toString()).emit("newNotification", notification);
};

module.exports = { setIO,emitNotification };