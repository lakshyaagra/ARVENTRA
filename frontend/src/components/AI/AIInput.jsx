import React, { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const AIInput = ({
    value,
    onChange,
    onSend,
    disabled = false,
    maxLength = 2000,
}) => {
    const textareaRef = useRef(null);

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            if (!disabled && value.trim()) {
                onSend();
            }
        }
    };

    return (
        <div className="border-t border-[#293533] bg-[#141A19] p-4 sm:p-5">
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    if (!disabled && value.trim()) {
                        onSend();
                    }
                }}
                className="mx-auto max-w-3xl"
            >
                <div
                    className="rounded-2xl border border-[#293533] bg-[#121817] transition-colors
                    focus-within:border-teal-700/50"
                >
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask Arventra AI about your finances..."
                        rows={2}
                        maxLength={maxLength}
                        disabled={disabled}
                        className=" min-h-14.5 w-full resize-none bg-transparent px-4 pt-4
                        text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600
                        disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <div className="flex items-center justify-between px-3 pb-3">
                        <p className="text-[10px] text-slate-700">
                            Enter to send · Shift + Enter for a new line
                        </p>

                        <button
                            type="submit"
                            disabled={disabled || !value.trim()}
                            className=" inline-flex h-9 items-center gap-2 rounded-xl bg-teal-500
                                px-4 text-xs font-semibold text-[#10201D] transition-colors
                                hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {disabled ? (
                                <>
                                    <span
                                        className=" h-3 w-3 animate-spin rounded-full border-2
                                        border-[#10201D] border-t-transparent"
                                    />
                                    Thinking
                                </>
                            ) : (
                                <>
                                    Send
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
                <p className="mt-3 text-center text-[10px] leading-5 text-slate-700">
                    Arventra AI provides financial guidance based on the
                    information available in your Arventra account. It is
                    not an official credit-bureau score or a substitute for
                    professional financial advice.
                </p>
            </form>
        </div>
    );
};
export default AIInput;