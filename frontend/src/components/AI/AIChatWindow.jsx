import React, { useEffect, useRef } from "react";
import {
    RotateCcw,
    Sparkles,
} from "lucide-react";

import AIMessage from "./AIMessage";
import AILoading from "./AILoading";

const AIChatWindow = ({
    messages = [],
    sending = false,
    error = null,
    onRetry,
}) => {
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, sending]);

    return (
        <div className="px-4 py-6 sm:px-6">
            {messages.length === 0 ? (
                <div className="flex min-h-120 flex-col items-center justify-center text-center">

                    <div
                        className="flex h-16 w-16 items-center justify-center rounded-2xl 
                        border border-teal-700/30 bg-teal-500/10"
                    >
                        <Sparkles className="h-7 w-7 text-teal-400" />
                    </div>

                    <p className="mt-6 text-xl font-medium text-slate-200">
                        Good to see you.
                    </p>

                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                        I'm Arventra AI. I can help you understand your
                        financial position and think through your next
                        financial decision.
                    </p>

                </div>
            ) : (
                <div className="mx-auto max-w-3xl space-y-5">
                    {messages.map((message, index) => (
                        <AIMessage
                            key={`${message.role}-${index}`}
                            message={message}
                        />
                    ))}
                    {sending && <AILoading />}
                    {error && !sending && (
                        <div className="rounded-xl border border-red-900/30 bg-red-500/5 px-4 py-3"
                        >
                            <p className="text-sm text-red-400">
                                {error}
                            </p>
                            {onRetry && (
                                <button
                                    type="button"
                                    onClick={onRetry}
                                    className="mt-2 inline-flex items-center gap-1 xt-xs text-red-400 hover:text-red-300"
                                >
                                    <RotateCcw className="h-3 w-3" />
                                    Try again
                                </button>
                            )}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
};
export default AIChatWindow;
