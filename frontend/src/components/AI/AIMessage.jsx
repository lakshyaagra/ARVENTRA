import React from "react";
import {
    Bot,
    User,
    Sparkles,
} from "lucide-react";

/* =====================================================================
   AI MESSAGE
===================================================================== */

const AIMessage = ({ message }) => {
    const isUser = message?.role === "user";

    if (!message?.content) {
        return null;
    }

    return (
        <div
            className={`flex gap-3 ${
                isUser ? "justify-end" : "justify-start"
            }`}
        >
            {/* AI AVATAR */}
            {!isUser && (
                <div
                    className=" mt-1 flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-full border border-teal-700/30 bg-teal-500/10"
                >
                    <Sparkles className="h-4 w-4 text-teal-400" />
                </div>
            )}

            {/* MESSAGE */}

            <div
                className={`max-w-[82%] rounded-2xl border px-4 py-3
                    ${
                        isUser
                            ? `
                                border-teal-700/30
                                bg-teal-500/10
                            `
                            : `
                                border-[#293533]
                                bg-[#121817]
                            `
                    }
                `}
            >
                {/* MESSAGE HEADER */}
                <div className="flex items-center gap-2">
                    {isUser ? (
                        <User className="h-3.5 w-3.5 text-teal-400" />
                    ) : (
                        <Bot className="h-3.5 w-3.5 text-teal-400" />
                    )}
                    <span
                        className="
                            text-[11px]
                            font-medium
                            uppercase
                            tracking-[0.12em]
                            text-slate-600
                        "
                    >
                        {isUser ? "You" : "Arventra AI"}
                    </span>
                </div>

                {/* MESSAGE CONTENT */}
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-300"
                >
                    {message.content}
                </p>

                {/* TIME */}

                {message.createdAt && (
                    <p className="mt-2 text-[10px] text-slate-700">
                        {new Date(message.createdAt).toLocaleTimeString(
                            "en-IN",
                            {
                                hour: "numeric",
                                minute: "2-digit",
                            }
                        )}
                    </p>
                )}
            </div>

            {/* USER AVATAR */}

            {isUser && (
                <div
                    className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border
                            border-[#35413F] bg-[#151D1C]"
                >
                    <User className="h-4 w-4 text-slate-500" />
                </div>
            )}
        </div>
    );
};
export default AIMessage;