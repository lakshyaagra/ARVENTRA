import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { connectSocket, disconnectSocket } from "../socket/socketClient";
import { notificationReceived } from "../features/notifications/notificationSlice";

const useNotificationSocket = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (!token) return;

        const socket = connectSocket(token);

        const handleNewNotification = (notification) => {
            dispatch(notificationReceived(notification));

            toast(`${notification.title}\n${notification.message}`, {
                icon: "🔔",
                duration: 5000,
            });
        };

        socket.on("newNotification", handleNewNotification);

        return () => {
            socket.off("newNotification", handleNewNotification);
            disconnectSocket();
        };
    }, [token, dispatch]);
};

export default useNotificationSocket;