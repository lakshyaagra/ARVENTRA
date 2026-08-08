import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validations/authValidation";
import { login,getCurrentUser } from "../services/authService";
import { loginStart,loginSuccess,loginFailure } from "../features/auth/authSlice";
import { useSelector } from "react-redux";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
            //1. Login
            const loginResponse = await login(data);
            // 2. Save Token
            localStorage.setItem("token", loginResponse.token);
            // 3. Get logged-in user's information 
            const userResponse = await getCurrentUser(); 
            // 4. Store both user and token in Redux 
            dispatch( 
                loginSuccess({ 
                    user: userResponse.user, 
                    token: loginResponse.token, 
                }) 
            );
            console.log("Login successful");
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
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                    // onSubmit={handleSubmit(
                    //     onSubmit,
                    //     (errors) => console.log("VALIDATION ERRORS", errors)
                    // )}
                    // className="space-y-6"
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