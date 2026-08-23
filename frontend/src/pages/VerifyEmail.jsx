import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { AuthLayout } from "../layouts/AuthLayout";
import Button from "../components/ui/Button";
import { verifyEmail } from "../services/authService";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const { token } = useParams();

    // "pending" | "success" | "error"
    const [status, setStatus] = useState("pending");
    const [message, setMessage] = useState("");

    useEffect(() => {
        let cancelled = false; //component active h
        const run = async () => {
            try {
                const response = await verifyEmail(token);
                if (cancelled) return;
                setStatus("success");
                setMessage(response.message);
            } catch (error) {
                if (cancelled) return;  //"Agar user page se already chala gaya hai, toh kuch mat karo."
                setStatus("error");
                setMessage(
                    error.response?.data?.message ||
                    "This verification link is invalid or has expired."
                );
            }
        };
        run();
        //cleanup function
        return () => {
            cancelled = true;
        };
    }, [token]);

    return (
        <AuthLayout>
            <div className="space-y-6 text-center">
                {status === "pending" && (
                    <>
                        <Loader2 className="mx-auto h-10 w-10 animate-spin text-teal-400" />
                        <h2 className="text-2xl font-bold text-white">
                            Verifying your email...
                        </h2>
                    </>
                )}
                {status === "success" && (
                    <>
                        <CheckCircle2 className="mx-auto h-10 w-10 text-teal-400" />
                        <h2 className="text-2xl font-bold text-white">
                            Email verified
                        </h2>
                        <p className="text-slate-400 leading-7">
                            {message}
                        </p>
                        <Button type="button" onClick={() => navigate("/login")}>
                            Continue to Sign In
                        </Button>
                    </>
                )}
                {status === "error" && (
                    <>
                        <XCircle className="mx-auto h-10 w-10 text-red-400" />
                        <h2 className="text-2xl font-bold text-white">
                            Verification failed
                        </h2>
                        <p className="text-slate-400 leading-7">
                            {message}
                        </p>
                        <Button type="button" onClick={() => navigate("/login")}>
                            Back to Sign In
                        </Button>
                    </>
                )}
            </div>
        </AuthLayout>
    );
};

export default VerifyEmail;