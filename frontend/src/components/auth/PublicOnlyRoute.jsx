import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/authHook";

// Used for routes that only make sense to a logged-out visitor (login,
// register). A logged-in user hitting these directly (typed URL, back
// button, stale bookmark) is sent to the dashboard instead of the form.
const PublicOnlyRoute = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PublicOnlyRoute;