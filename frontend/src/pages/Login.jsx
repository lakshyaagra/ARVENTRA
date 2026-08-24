import { useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validations/authValidation";
import { login,getCurrentUser } from "../services/authService";
import { loginStart,loginSuccess,loginFailure } from "../features/auth/authSlice";
import { setAccessToken } from "../api/axios";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionExpired = searchParams.get("sessionExpired") === "1";
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
          resolver: zodResolver(loginSchema)
        });

    const onSubmit = async (data) => {
        dispatch(loginStart());
        try {
            //1. Login — issues a short-lived access token in the response
            // body, and sets the httpOnly refresh-token cookie server-side.
            const loginResponse = await login(data);
            // 2. Keep the access token in memory only (never localStorage)
            setAccessToken(loginResponse.token);
            // 3. Get logged-in user's information 
            const userResponse = await getCurrentUser(); 
            // 4. Store both user and token in Redux 
            dispatch( 
                loginSuccess({ 
                    user: userResponse.user, 
                    token: loginResponse.token, 
                }) 
            );
            // 5. Go to dashboard
            navigate("/dashboard");
        } catch (error) {
            dispatch(loginFailure());
            console.error(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div>
                    <div className="space-y-2">
                      <h2 className="text-4xl font-bold text-white">
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

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
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
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-sm text-teal-400 hover:text-teal-300 "
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