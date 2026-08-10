import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validations/authValidation";
import { register as registerUser } from "../services/authService";
import ARVENTRA from "../assets/ARVENTRA.png"

const Register = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data) => {
        console.log("REGISTER SUBMIT:", data);
        try {
            const response = await registerUser(data);
            console.log("Registration successful:", response);
            navigate("/login");
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
            </div>
        </AuthLayout>
    );
};

export default Register;
