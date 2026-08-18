import { Navigate, Outlet } from "react-router-dom"; 
import useAuth from "../../hooks/authHook"; 
import useNotificationSocket from "../../socket/useNotificationSocket";

const ProtectedRoute = () => { 
    // Called unconditionally, before the early return below — React's
    // Rules of Hooks require every hook to run on every render, in the
    // same order. The hook itself already no-ops internally when there's
    // no token, so this is safe to call even before we know the user is
    // authenticated.
    useNotificationSocket();

    const { isAuthenticated } = useAuth(); 
    if (!isAuthenticated) { 
        return <Navigate to="/login" replace />; 
    }
    
    return <Outlet />; 
}; 
export default ProtectedRoute;