import { ArrowRight } from "lucide-react";

const Button = ({
    children,
    type = "submit",
    loading = false,
    loadingText = "Signing In...",
    onClick,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
            className="group w-full h-14 rounded-xl bg-linear-to-r from-teal-600
            to-emerald-500 text-white font-semibold flex items-center justify-center 
            gap-3 transition-all hover:scale-[1.01] hover:shadow-md hover:shadow-teal-500/20 
            disabled:opacity-50 disabled:cursor-not-allowed">
            {
                loading
                    ? loadingText
                    : (
                        <>
                            {children}
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1"/>
                        </>
                    )
            }
        </button>
    );
};
export default Button;