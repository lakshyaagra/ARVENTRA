import { io } from "socket.io-client";

const SOCKET_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

let socket = null;

export const connectSocket = (token) => {
    if (socket) {
        // Update auth token if it changed on an existing socket
        if (socket.auth?.token !== token) {
            socket.auth = { token };
            if (socket.connected) {
                socket.disconnect().connect();
            }
        } else if (!socket.connected) {
            socket.connect();
        }
        return socket;
    }

    socket = io(SOCKET_URL, {
        auth: { token },
        autoConnect: true,
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;