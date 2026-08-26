import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { connectSocket, disconnectSocket } from "../socket/socketClient";
import { notificationReceived } from "../features/notifications/notificationSlice";
 
// Call this ONCE, near the top of your app — currently wired into
// ProtectedRoute, since that's the single gate every authenticated
// route (both DashboardLayout and AILayout) passes through.
const useNotificationSocket = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
 
    useEffect(() => {
        // Reactive now: if the user logs in or out without a page
        // reload, `token` changes, this effect re-runs, and the socket
        // connects/disconnects to match — no stale connection.
        if (!token) return;
 
        const socket = connectSocket(token);
 
        socket.on("newNotification", (notification) => {
            dispatch(notificationReceived(notification));

            // Surfaced immediately as a toast too, not just added to the
            // bell dropdown — a real-time push is easy to miss otherwise
            // if the user isn't currently looking at the bell.
            // Plain string, not JSX: this file is .js, not .jsx, and the
            // project's Vite config has no JSX loader override for .js.
            toast(`${notification.title}\n${notification.message}`, {
                icon: "🔔",
                duration: 5000,
            });
        });
 
        return () => {
            socket.off("newNotification");
            disconnectSocket();
        };
    }, [token, dispatch]);
};
 
export default useNotificationSocket;