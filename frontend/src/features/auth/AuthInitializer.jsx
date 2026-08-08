import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { loginSuccess,loginFailure } from "./authSlice"
import { getCurrentUser } from "../../services/authService";

const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        const restoreUser = async () => {
            try {
                const response = await getCurrentUser();
                console.log("AUTH RESTORED:", response);
                dispatch(
                    loginSuccess({
                        user: response.user,
                        token
                    })
                );
                console.log("USER RESTORED:", response.user);
            } catch (error) {
                console.error( 
                    "Auth initialization failed:", 
                    error.response?.data?.message || error.message 
                );
                localStorage.removeItem("token");
                dispatch(loginFailure());
            }
        };
        restoreUser();
    }, [dispatch]);
    return children;
};

export default AuthInitializer;