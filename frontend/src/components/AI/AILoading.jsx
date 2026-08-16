import React from "react";
import { Sparkles } from "lucide-react";

const AILoading = () => {
    return (
        <div className="flex gap-3">
            {/* AI AVATAR */}
            <div className=" mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border
                           border-teal-700/30 bg-teal-500/1">
                <Sparkles className="h-4 w-4 text-teal-400" />
            </div>

            {/* LOADING BUBBLE */}
            <div className=" rounded-2xl border border-[#293533] bg-[#121817] px-4 py-3">
                <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
                    <span className=" h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500 [animation-delay:300ms]" />
                </div>
            </div>
        </div>
    );
};
export default AILoading;