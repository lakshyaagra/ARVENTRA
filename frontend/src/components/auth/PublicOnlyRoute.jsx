import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/authHook";

// Used for routes that only make sense to a logged-out visitor (login,
// register). A logged-in user hitting these directly (typed URL, back
// button, stale bookmark) is sent to the dashboard instead of the form.
const PublicOnlyRoute = () => {
    const { isAuthenticated, initializing } = useAuth();

    // Same reasoning as ProtectedRoute: don't decide anything until the
    // initial silent-refresh attempt has resolved, or a logged-in user
    // refreshing on /login would see the form for a moment before this
    // redirect kicks in.
    if (initializing) {
        return null;
    }
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PublicOnlyRoute;