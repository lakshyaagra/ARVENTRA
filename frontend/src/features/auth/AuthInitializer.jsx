// import { useEffect } from "react";
// import { useDispatch } from "react-redux";

// import { loginSuccess,loginFailure } from "./authSlice"
// import { getCurrentUser,refreshAccessToken } from "../../services/authService";



// const AuthInitializer = ({ children }) => {
//     const dispatch = useDispatch();
//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         if (!token) {
//             return;
//         }
//         const restoreUser = async () => {
//             try {
//                 const response = await getCurrentUser();
//                 console.log("AUTH RESTORED:", response);
//                 dispatch(
//                     loginSuccess({
//                         user: response.user,
//                         token
//                     })
//                 );
//                 console.log("USER RESTORED:", response.user);
//             } catch (error) {
//                 console.error( 
//                     "Auth initialization failed:", 
//                     error.response?.data?.message || error.message 
//                 );
//                 localStorage.removeItem("token");
//                 dispatch(loginFailure());
//             }
//         };
//         restoreUser();
//     }, [dispatch]);
//     return children;
// };

// export default AuthInitializer;
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { loginSuccess, loginFailure } from "./authSlice";
import { getCurrentUser, refreshAccessToken } from "../../services/authService";
import { setAccessToken } from "../../api/axios";

const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const restoreSession = async () => {
            try {
                // There's no token in localStorage to check anymore — the
                // only way to know if there's an active session is to ask
                // the server, which reads the httpOnly refresh-token
                // cookie directly (JS can't see it either way).
                const refreshResponse = await refreshAccessToken();
                setAccessToken(refreshResponse.token);
                const userResponse = await getCurrentUser();

                dispatch(
                    loginSuccess({
                        user: userResponse.user,
                        token: refreshResponse.token
                    })
                );
            } catch {
                // No valid refresh cookie is the normal state for a
                // logged-out visitor — not an error worth logging.
                setAccessToken(null);
                dispatch(loginFailure());
            }
        };
        restoreSession();
    }, [dispatch]);

    return children;
};
export default AuthInitializer;