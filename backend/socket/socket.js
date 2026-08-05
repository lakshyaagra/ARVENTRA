const jwt = require("jsonwebtoken");

const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return socket.disconnect();
            }
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            socket.join(decoded.id);
            console.log(`User ${decoded.id} joined room ${decoded.id}`);

            socket.on("disconnect", () => {
                console.log(`${decoded.id} disconnected`);
            });
        }
        catch(err){
            socket.disconnect();
        }
    });
};

module.exports = { initializeSocket};
