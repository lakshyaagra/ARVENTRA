import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../validations/authValidation";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(resetPasswordSchema)
    });

    const onSubmit = async (data) => {
        setErrorMessage("");
        setSubmitting(true);
        try {
            await resetPassword(token, data.password);
            setSubmitted(true);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "This reset link is invalid or has expired."
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
                        Reset Password
                    </h2>
                    <p className="text-slate-400 leading-7">
                        Choose a new password for your account.
                    </p>
                </div>

                {submitted ? (
                    <div className="space-y-6">
                        <div className="rounded-lg border border-teal-900/40 bg-teal-950/20 px-4 py-3">
                            <p className="text-sm text-teal-400">
                                Your password has been reset successfully.
                            </p>
                        </div>
                        <Button type="button" onClick={() => navigate("/login")}>
                            Continue to Sign In
                        </Button>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <Input
                            label="New Password"
                            name="password"
                            type="password"
                            placeholder="Enter new password..."
                            register={register}
                            error={errors.password}
                        />
                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm new password..."
                            register={register}
                            error={errors.confirmPassword}
                        />

                        {errorMessage && (
                            <p className="text-sm text-red-400">
                                {errorMessage}
                            </p>
                        )}

                        <Button loading={submitting} loadingText="Resetting...">
                            Reset Password
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
export default ResetPassword;