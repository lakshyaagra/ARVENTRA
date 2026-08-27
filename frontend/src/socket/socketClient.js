
import { io } from "socket.io-client";
 
const SOCKET_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";
 
// Module-level variable — NOT React state. This is what makes it a
// singleton: every component that imports this file shares the same
// `socket` reference, instead of each one accidentally opening its
// own separate connection.
let socket = null;
 
export const connectSocket = (token) => {
    if (socket?.connected) return socket;
 
    socket = io(SOCKET_URL, {
        auth: { token }, // read by your backend's socket.js as socket.handshake.auth.token
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