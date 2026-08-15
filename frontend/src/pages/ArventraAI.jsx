import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Check,
  CircleDollarSign,
  MessageCircle,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import AIMessage from "../components/AI/AIMessage";

import {
  clearAIConversation,
  sendAIMessage,
} from "../features/ai/aiSlice";
import { useNavigate } from "react-router-dom";

/* =====================================================================
   HELPERS
===================================================================== */

const formatTime = (date = new Date()) =>
  new Date(date).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

/* =====================================================================
   PRIMITIVES
===================================================================== */

const Eyebrow = ({ children }) => (
  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
    {children}
  </p>
);

const SuggestedPrompt = ({ icon: Icon, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex w-full items-center gap-3 rounded-xl border border-[#293533]
            bg-[#121817] px-4 py-3 text-left transition-colors hover:border-teal-700/50
            hover:bg-[#1B2422]
    "
  >
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border
                border-[#293533] bg-[#171F1E]
      "
    >
      <Icon className="h-4 w-4 text-teal-400" />
    </div>

    <span className="flex-1 text-sm text-slate-400 transition-colors group-hover:text-slate-200">
      {children}
    </span>

    <ArrowUpRight className="h-3.5 w-3.5 text-slate-600 transition-colors group-hover:text-teal-400" />
  </button>
);

const TypingIndicator = () => (
  <div className="flex gap-3">
    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-teal-700/30 bg-teal-500/10">
      <Sparkles className="h-4 w-4 text-teal-400" />
    </div>

    <div className="rounded-2xl border border-[#293533] bg-[#121817] px-4 py-3">
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500 [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500 [animation-delay:300ms]" />
      </div>
    </div>
  </div>
);

/* =====================================================================
   PAGE
===================================================================== */
const ArventraAI = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const [message, setMessage] = useState("");
  const { messages, sending, error } = useSelector(
    (state) => state.ai
  );

  /* ================================================================
     AUTO SCROLL
  ================================================================ */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  /* ================================================================
     SEND MESSAGE
  ================================================================ */
  const handleSend = async (event) => {
    event?.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || sending) {
      return;
    }
    setMessage("");
    await dispatch(sendAIMessage(trimmedMessage));
    textareaRef.current?.focus();
  };

  /* ================================================================
     SUGGESTED PROMPT
  ================================================================ */
  const handleSuggestedPrompt = (prompt) => {
    if (sending) {
      return;
    }
    setMessage(prompt);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  /* ================================================================
     KEYBOARD
  ================================================================ */
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  /* ================================================================
     CLEAR
  ================================================================ */
  const handleClear = () => {
    if (sending || messages.length === 0) {
      return;
    }
    dispatch(clearAIConversation());
  };

  /* ================================================================
     RENDER
  ================================================================ */

  return (
    <div className="min-h-[calc(100vh-120px)]">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Arventra AI</Eyebrow>

          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-700/30 bg-teal-500/10">
              <Sparkles className="h-5 w-5 text-teal-400" />
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-100">
              Your Personal financial advisor
            </h1>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Ask questions about your savings, spending, goals, loans,
            assets,overall financial position or anything you want to ask regarding your finacial life.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClear}
          disabled={sending || messages.length === 0}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            border-[#293533]
            px-3
            py-2
            text-xs
            font-medium
            text-slate-500
            transition-colors
            hover:border-red-900/50
            hover:text-red-400
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear conversation
        </button>
      </div>

      {/* ============================================================
          WORKSPACE
      ============================================================ */}

      <section
        className="
          grid
          min-h-162.5
          overflow-hidden
          rounded-2xl
          border
          border-[#293533]
          bg-[#171F1E]
          lg:grid-cols-[260px_1fr]
        "
      >

        {/* ==========================================================
            SIDEBAR
        ========================================================== */}

        <aside className="hidden border-r border-[#293533] bg-[#121817] lg:block">
          <div className="p-5">

            <button
              type="button"
              onClick={handleClear}
              disabled={sending}
              className=" flex w-full items-center justify-center gap-2 rounded-xl border border-teal-700/30
                bg-teal-500/10 px-4 py-3 text-sm font-medium text-teal-400 transition-colors
                hover:border-teal-500/40 hover:bg-teal-500/15 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
              New conversation
            </button>

            <div className="mt-8">
              <Eyebrow>Conversation</Eyebrow>

              <div className="mt-3 rounded-xl border border-teal-700/20 bg-[#171F1E] p-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-teal-400" />

                  <p className="text-sm font-medium text-slate-300">
                    Current conversation
                  </p>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Your conversation is shared with the Arventra AI
                  bubble.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Eyebrow>Try asking</Eyebrow>

              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    handleSuggestedPrompt(
                      "How am I doing financially?"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-500 transition-colors hover:bg-[#1B2422] hover:text-slate-300"
                >
                  How am I doing financially?
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSuggestedPrompt(
                      "How should I prioritize my loans?"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-500 transition-colors hover:bg-[#1B2422] hover:text-slate-300"
                >
                  How should I prioritize my loans?
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSuggestedPrompt(
                      "What should I focus on this month?"
                    )
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-500 transition-colors hover:bg-[#1B2422] hover:text-slate-300"
                >
                  What should I focus on this month?
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ==========================================================
            CHAT
        ========================================================= */}
        <div className="flex min-h-162.5 min-w-0 flex-col">

          {/* CHAT HEADER */}
          <div className="flex items-center justify-between border-b border-[#293533] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-teal-700/30 bg-teal-500/10">
                <Sparkles className="h-4 w-4 text-teal-400" />

                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#171F1E] bg-teal-500" />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-200">
                  Arventra AI
                </p>
                <p className="text-[11px] text-slate-600">
                  Personal financial intelligence
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-2 text-[11px] text-slate-600 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              AI online
            </div>
          </div>

          {/* ========================================================
              MESSAGES
          ======================================================== */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {messages.length === 0 ? (
                <div className="flex min-h-120 flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-700/30 bg-teal-500/10">
                    <Sparkles className="h-7 w-7 text-teal-400" />
                </div>

                <p className="mt-6 text-xl font-medium text-slate-200">
                    Good to see you.
                </p>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    I'm Arventra AI. I can help you understand your financial position and
                    think through your next financial decision.
                </p>

                <div className="mt-8 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                    <SuggestedPrompt
                    icon={CircleDollarSign}
                    onClick={() => handleSuggestedPrompt("How am I doing financially?")}
                    >
                    How am I doing financially?
                    </SuggestedPrompt>

                    <SuggestedPrompt
                    icon={CircleDollarSign}
                    onClick={() => handleSuggestedPrompt("How can I improve my savings?")}
                    >
                    How can I improve my savings?
                    </SuggestedPrompt>

                    <SuggestedPrompt
                    icon={CircleDollarSign}
                    onClick={() => handleSuggestedPrompt("Which loan should I prioritize?")}
                    >
                    Which loan should I prioritize?
                    </SuggestedPrompt>

                    <SuggestedPrompt
                    icon={CircleDollarSign}
                    onClick={() => handleSuggestedPrompt("What should I focus on this month?")}
                    >
                    What should I focus on this month?
                    </SuggestedPrompt>
                </div>
                </div>
            ) : (
                <>
                {messages.map((item, index) => (
                    <AIMessage key={`${item.role}-${index}`} message={item} />
                ))}
                
                {sending && <TypingIndicator />}

                {error && !sending && (
                    <div className="rounded-xl border border-red-900/30 bg-red-500/5 px-4 py-3">
                    <p className="text-sm text-red-400">{error}</p>

                    <button
                        type="button"
                        onClick={() => {
                        const lastUserMessage = [...messages]
                            .reverse()
                            .find((item) => item.role === "user");

                        if (lastUserMessage) {
                            dispatch(sendAIMessage(lastUserMessage.content));
                        }
                        }}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                    >
                        <RotateCcw className="h-3 w-3" />
                        Try again
                    </button>
                    </div>
                )}
                <div ref={messagesEndRef} />
                </>
            )}
            </div>

          {/* ========================================================
              COMPOSER
          ======================================================== */}
          <div className="border-t border-[#293533] bg-[#141A19] p-4 sm:p-5">
            <form
              onSubmit={handleSend}
              className="mx-auto max-w-3xl"
            >
              <div className="rounded-2xl border border-[#293533] bg-[#121817] transition-colors focus-within:border-teal-700/50">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Arventra AI about your finances..."
                  rows={2}
                  maxLength={2000}
                  disabled={sending}
                  className="
                    h-12.5
                    w-full
                    resize-none
                    bg-transparent
                    px-4
                    pt-4
                    text-sm
                    leading-6
                    text-slate-200
                    outline-none
                    placeholder:text-slate-600
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />
                <div className="flex items-center justify-between px-3 pb-2">
                  <p className="text-[10px] text-slate-700">
                    Enter to send · Shift + Enter for a new line
                  </p>
                  <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    className="inline-flex h-9 items-center gap-2 rounded-xl bg-teal-500 px-4 text-xs
                      font-semibold text-[#10201D] transition-colors hover:bg-teal-400
                      disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {sending ? (
                      <>
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#10201D] border-t-transparent" />
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
        </div>
      </section>
    </div>
  );
};
export default ArventraAI;