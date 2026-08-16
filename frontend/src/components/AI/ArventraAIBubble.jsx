import { useState } from "react";
import { MessageCircle, X, ArrowUpRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { sendAIMessage } from "../../features/ai/aiSlice";

const ArventraAIBubble = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [expanded, setExpanded] = useState(false);
    const [message, setMessage] = useState("");

    const { messages, sending, error } = useSelector((state) => state.ai);

    const latestAssistantMessage = [...messages]
        .reverse()
        .find((item) => item.role === "assistant");

    const handleSend = (event) => {
        event.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage || sending) {
            return;
        }

        dispatch(sendAIMessage(trimmedMessage));
        setMessage("");
    };

    return (
        /* PARENT CONTAINER WITH GROUP CLASS */
        <div className="group fixed bottom-8 right-10 z-50">

            {/* =========================================================
                INTRO MESSAGE (REACTS TO GROUP HOVER)
                ========================================================= */}
            {!expanded && (
                <div
                    className="absolute bottom-16 right-0 mb-3 w-64 origin-bottom-right
                    scale-100 rounded-2xl border border-[#293533] bg-[#171F1E] px-4 py-3 opacity-100
                    shadow-2xl shadow-black/30 transition-all duration-300 ease-out
                    group-hover:-translate-y-1 group-hover:scale-[1.03] group-hover:border-teal-500/60 group-hover:shadow-teal-500/10"
                >
                    <p className="text-xs uppercase tracking-[0.16em] text-teal-400 transition-colors duration-200 group-hover:text-teal-300">
                        Arventra AI
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-200">
                        How can I help you?
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Ask me about your savings, loans, goals, spending,
                        or financial health.
                    </p>

                    {/* Pointer reacts to group hover border color */}
                    <div
                        className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 border-b border-r
                        border-[#293533] bg-[#171F1E] transition-colors duration-300 group-hover:border-teal-500/60"
                    />
                </div>
            )}

            {/* =========================================================
                EXPANDED CHAT
                ========================================================= */}
            {expanded && (
                <div
                    className="mb-3 w-85 overflow-hidden rounded-2xl border border-[#293533]
                    bg-[#171F1E] shadow-2xl shadow-black/30"
                >
                    {/* HEADER */}
                    <div className="flex items-center justify-between border-b border-[#293533] px-4 py-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                Arventra AI
                            </p>
                            <p className="mt-1 text-sm text-slate-300">
                                Your financial advisor
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setExpanded(false)}
                            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-[#1B2422] hover:text-slate-300"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* MESSAGE */}
                    <div className="max-h-64 min-h-32 overflow-y-auto px-4 py-4">
                        {latestAssistantMessage ? (
                            <div className="rounded-xl border border-[#293533] bg-[#121817] p-4">
                                <p className="text-sm leading-6 text-slate-400">
                                    {latestAssistantMessage.content}
                                </p>
                            </div>
                        ) : (
                            <div className="py-5 text-center">
                                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-teal-700/30 bg-teal-500/10">
                                    <MessageCircle className="h-4 w-4 text-teal-400" />
                                </div>

                                <p className="mt-3 text-sm text-slate-300">
                                    How can I help with your finances?
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                    Ask about savings, loans, goals, spending,
                                    investments, or your financial health.
                                </p>
                            </div>
                        )}

                        {error && (
                            <p className="mt-3 text-xs text-red-400">
                                {error}
                            </p>
                        )}
                    </div>

                    {/* INPUT */}
                    <form
                        onSubmit={handleSend}
                        className="border-t border-[#293533] p-3"
                    >
                        <div className="flex items-center gap-2 rounded-xl border border-[#293533] bg-[#121817] p-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(event) =>
                                    setMessage(event.target.value)
                                }
                                placeholder="Ask Arventra AI..."
                                maxLength={1000}
                                className="min-w-0 flex-1 bg-transparent px-2 py-1 text-sm text-slate-200 outline-none placeholder:text-slate-600"
                            />

                            <button
                                type="submit"
                                disabled={sending || !message.trim()}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500 text-[#0F1716] transition-colors hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ArrowUpRight className="h-4 w-4" />
                            </button>
                        </div>
                    </form>

                    {/* FULL AI */}
                    <button
                        type="button"
                        onClick={() => navigate("/ai")}
                        className="flex w-full items-center justify-center border-t border-[#293533] px-4 py-3 text-xs font-medium text-teal-400 transition-colors hover:bg-[#1B2422] hover:text-teal-300"
                    >
                        Open Arventra AI
                        <ArrowUpRight className="ml-1.5 h-3 w-3" />
                    </button>
                </div>
            )}

            {/* =========================================================
                AI BUBBLE BUTTON (REACTS TO GROUP HOVER)
                ========================================================= */}
            <button
                type="button"
                onClick={() => setExpanded((current) => !current)}
                aria-label="Open Arventra AI"
                className="relative flex h-14 w-14 items-center justify-center rounded-full border
                border-teal-700/40 bg-[#171F1E] text-teal-400 shadow-xl shadow-black/30 
                transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60
                group-hover:scale-110 group-hover:border-teal-400 group-hover:bg-[#1B2422] group-hover:shadow-teal-500/20"
            >
                {expanded ? (
                    <X className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />
                ) : (
                    <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
                )}
            </button>
        </div>
    );
};

export default ArventraAIBubble;