import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#111817] px-6 text-center text-white">

            <Compass className="h-10 w-10 text-teal-400" />

            <h1 className="text-3xl font-semibold">
                Page not found
            </h1>

            <p className="max-w-md text-sm leading-6 text-slate-500">
                The page you're looking for doesn't exist or may have been moved.
            </p>

            <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-2 rounded-lg bg-teal-500 px-5 py-3 text-sm font-semibold text-[#0E1514] transition hover:bg-teal-400"
            >
                Back to home
            </button>

        </div>
    );
};

export default NotFound;