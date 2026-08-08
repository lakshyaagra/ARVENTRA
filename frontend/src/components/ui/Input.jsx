import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Input = ({
    label,
    type = "text",
    name,
    placeholder,
    register,
    error,
}) => {

    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === "password" ? showPassword ? "text" : "password" : type;

    return (
        <div className="space-y-2">
            <label
                className="text-sm font-medium text-slate-300"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    type={inputType}
                    placeholder={placeholder}
                    {...register(name)}
                    className="w-full h-14 rounded-xl border border-[#2B3634] bg-[#1A2120]
                    px-5 text-white placeholder:text-slate-500 outline-none transition-all
                    focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
                {
                    type === "password" && (
                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            className=" absolute right-4 top-1/2 -translate-y-1/2
                                       text-slate-400 hover:text-teal-400">

                            {
                                showPassword ? <EyeOff size={20} /> : <Eye size={20} />
                            }
                        </button>
                    )
                }
            </div>
            {
                error && (
                    <p className="text-sm text-red-400">
                        {error.message}
                    </p>
                )
            }
        </div>
    );
};
export default Input;