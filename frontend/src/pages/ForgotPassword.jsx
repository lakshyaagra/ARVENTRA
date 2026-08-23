import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../validations/authValidation";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const onSubmit = async (data) => {
        setErrorMessage("");
        setSubmitting(true);
        try {
            await forgotPassword(data.email);
            // Backend always returns the same generic message whether or
            // not the account exists — don't reveal which via the UI either.
            setSubmitted(true);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-white">
                        Forgot Password
                    </h2>
                    <p className="text-slate-400 leading-7">
                        Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>

                {submitted ? (
                    <div className="space-y-6">
                        <div className="rounded-lg border border-teal-900/40 bg-teal-950/20 px-4 py-3">
                            <p className="text-sm text-teal-400">
                                If an account with that email exists, a password reset link has been sent. Please check your inbox.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-sm font-semibold text-teal-400 hover:text-teal-300 transition"
                        >
                            ← Back to Sign In
                        </button>
                    </div>
                ) : (
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

                        {errorMessage && (
                            <p className="text-sm text-red-400">
                                {errorMessage}
                            </p>
                        )}

                        <Button loading={submitting} loadingText="Sending...">
                            Send Reset Link
                        </Button>

                        <p className="text-center text-sm text-slate-400">
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="font-semibold text-teal-400 hover:text-teal-300 transition"
                            >
                                ← Back to Sign In
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
};
export default ForgotPassword;