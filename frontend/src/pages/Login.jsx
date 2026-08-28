import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validations/authValidation";
import { login, getCurrentUser } from "../services/authService";
import { loginStart, loginSuccess, loginFailure } from "../features/auth/authSlice";
import { setAccessToken } from "../api/axios";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionExpired = searchParams.get("sessionExpired") === "1";
    const [apiError, setApiError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        setApiError("");
        dispatch(loginStart());
        try {
            const loginResponse = await login(data);
            setAccessToken(loginResponse.token);
            const userResponse = await getCurrentUser(); 
            dispatch( 
                loginSuccess({ 
                    user: userResponse.user, 
                    token: loginResponse.token, 
                }) 
            );
            navigate("/dashboard");
        } catch (error) {
            const message = error.response?.data?.message || "Invalid email or password";
            dispatch(loginFailure(message));
            setApiError(message);
        }
    };

    return (
        <AuthLayout>
            {/* Top Navigation Action */}
            <div className="flex justify-end pb-4">
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="cursor-pointer text-xs sm:text-sm font-medium text-slate-400 hover:text-teal-400 transition-colors duration-200 flex items-center gap-1.5"
                >
                    Explore Arventra <span aria-hidden="true">&rarr;</span>
                </button>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="space-y-2">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">
                            Welcome Back
                        </h2>
                        <p className="text-slate-400 leading-7">
                            Sign in to continue your financial journey.
                        </p>
                    </div>
                </div>

                {sessionExpired && (
                    <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 px-4 py-3">
                        <p className="text-sm text-amber-400">
                            Your session has expired. Please sign in again.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Email"
                        name="email"
                        placeholder="Enter your email..."
                        register={register}
                        error={errors.email}
                    />
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter Password..."
                        register={register}
                        error={errors.password}
                    />

                    {/* Display API Error below password field */}
                    {apiError && (
                        <div className="rounded-lg border border-red-900/40 bg-red-950/20 px-4 py-3 mt-2">
                            <p className="text-sm text-red-400">
                                {apiError}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-sm text-teal-400 hover:text-teal-300"
                        >
                            Forgot Password?
                        </button>
                    </div>
                    <Button>
                        Sign In
                    </Button>
                </form>
                <p className="text-center text-sm text-slate-400">
                    New to Arventra?
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="ml-2 cursor-pointer font-semibold text-teal-400 hover:text-teal-300 transition"
                    >
                        Create Account
                    </button>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Login;