import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validations/authValidation";
import { register as registerUser } from "../services/authService";

const Register = () => {
    const navigate = useNavigate();
    const [registered, setRegistered] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(registerSchema)
    });

    useEffect(() => {
        if (!registered) return;
        const timer = setTimeout(() => navigate("/login"), 3000);
        return () => clearTimeout(timer);
    }, [registered, navigate]);

    const onSubmit = async (data) => {
        try {
            const response = await registerUser(data);
            setRegistered(true);
        } catch (error) {
            console.error(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };
    return (
        <AuthLayout>
            <div className="space-y-2">
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-white">
                        Create Account
                    </h2>
                    <p className="text-slate-400 leading-7">
                        Create your account and start your financial journey.
                    </p>
                </div>

                {registered ? (
                    <div className="space-y-6 pt-4">
                        <div className="rounded-lg border border-teal-900/40 bg-teal-950/20 px-4 py-3">
                            <p className="text-sm text-teal-400">
                                Account created. We've sent a verification link to your email — redirecting you to sign in...
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-sm font-semibold text-teal-400 hover:text-teal-300 transition"
                        >
                            Continue to Sign In →
                        </button>
                    </div>
                ) : (
                    <>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <Input
                                label="Name"
                                name="name"
                                placeholder="Enter your name..."
                                register={register}
                                error={errors.name}
                            />
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
                                placeholder="Create a password..."
                                register={register}
                                error={errors.password}
                            />
                            <Button>
                                Create Account
                            </Button>
                        </form>
                        <p className="text-center text-sm text-slate-400">
                            Already have an account?
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="ml-2 cursor-pointer font-semibold text-teal-400
                                          hover:text-teal-300 transition"
                            >
                                Sign In
                            </button>
                        </p>
                    </>
                )}
            </div>
        </AuthLayout>
    );
};

export default Register;