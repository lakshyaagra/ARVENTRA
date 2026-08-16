import React, { useState,useEffect } from "react";
import { MessageCircle, Plus, Sparkles, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import AIInput from "../components/AI/AIInput";
import AIChatWindow from "../components/AI/AIChatWindow";

import {
  clearAIConversation,
  sendAIMessage,
  fetchAIConversations,
  loadAIConversation
} from "../features/ai/aiSlice";

/* =====================================================================
   HELPERS & PRIMITIVES
===================================================================== */
const Eyebrow = ({ children }) => (
  <p className="text-xs uppercase tracking-[0.2em] mb-1.5 text-slate-500">
    {children}
  </p>
);

/* =====================================================================
   PAGE
===================================================================== */
const ArventraAI = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const {
      messages,
      sending,
      error,
      conversations,
      conversationsLoading,
      conversationLoading,
      conversationId,
  } = useSelector((state) => state.ai);

  /* ================================================================
     SEND MESSAGE
  ================================================================ */
  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || sending) {
      return;
    }
    setMessage("");
    const result = await dispatch(
          sendAIMessage({
              message: trimmedMessage,
              conversationId,
          })
      ).unwrap();
  };

  /* ================================================================
     SUGGESTED PROMPTS
  ================================================================ */
  const handleSuggestedPrompt = async (promptText) => {
    if (sending) return;
      await dispatch(
        sendAIMessage({
            message: promptText,
            conversationId,
        })
    ).unwrap();
  };

  /* ================================================================
     RETRY LAST FAILED MESSAGE
  ================================================================ */
  const handleRetry = async () => {
    const lastUserMessage = [...messages]
        .reverse()
        .find((item) => item.role === "user");

    if (!lastUserMessage || sending) {
        return;
    }
    await dispatch(
        sendAIMessage({
            message: lastUserMessage.content,
            conversationId,
        })
    ).unwrap()
  };

  /* ================================================================
     CLEAR CONVERSATION
  ================================================================ */
  const handleClear = () => {
    if (sending) {
      return;
    }
    dispatch(clearAIConversation());
    setMessage("");
  };

  useEffect(() => {
      dispatch(fetchAIConversations());
  }, [dispatch]);

  return (
    <div className="min-h-[calc(100vh-120px)]">
      {/* ============================================================
          HEADER
      ============================================================ */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Arventra AI</Eyebrow>

          <div className="mt-0.5 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-700/30 bg-teal-500/10">
              <Sparkles className="h-4 w-4 text-teal-400" />
            </div>

            <h1 className="text-[23.5px] font-semibold tracking-tight text-slate-100">
              Your Personal financial advisor
            </h1>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Ask questions about your savings, spending, goals, loans,
            assets, overall financial position or anything you want to ask regarding your financial life.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClear}
          disabled={sending || messages.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg border 
          border-[#293533] px-3 py-2 text-xs font-medium text-slate-500 transition-colors
          hover:border-red-900/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear conversation
        </button>
      </div>

      {/* ============================================================
          WORKSPACE
      ============================================================ */}

      <section className="grid h-[calc(100vh-260px)] min-h-150 overflow-hidden rounded-2xl border border-[#293533] bg-[#171F1E] lg:grid-cols-[260px_1fr]">
        {/* =========================================================
            SIDEBAR
        ========================================================== */}

        <aside className="hidden h-full overflow-hidden border-r border-[#293533] bg-[#121817] lg:block">
          <div className="h-full overflow-y-auto p-5">

            <button
              type="button"
              onClick={handleClear}
              disabled={sending}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-teal-700/30
                bg-teal-500/10 px-4 py-3 text-sm font-medium text-teal-400 transition-colors
                hover:border-teal-500/40 hover:bg-teal-500/15 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
              New conversation
            </button>

            <div className="mt-8">
                  <Eyebrow>Recents</Eyebrow>

                  <div className="mt-3 space-y-1">
                      {conversationsLoading ? (
                          <>
                              <div className="h-9 animate-pulse rounded-lg bg-[#1B2422]" />
                              <div className="h-9 animate-pulse rounded-lg bg-[#1B2422]" />
                              <div className="h-9 animate-pulse rounded-lg bg-[#1B2422]" />
                          </>
                      ) : conversations.length === 0 ? (
                          <p className="px-3 py-3 text-xs text-slate-600">
                              No recent conversations.
                          </p>
                      ) : (
                          conversations.map((conversation) => (
                              <button
                                  key={conversation._id}
                                  type="button"
                                  disabled={conversationLoading}
                                  onClick={() =>
                                      dispatch(
                                          loadAIConversation(
                                              conversation._id
                                          )
                                      )
                                  }
                                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
                                      conversation._id === conversationId
                                          ? "bg-[#1B2926] text-slate-200"
                                          : "text-slate-500 hover:bg-[#1B2422] hover:text-slate-300"
                                  }`}
                              >
                                  <MessageCircle className="h-3.5 w-3.5 shrink-0" />

                                  <span className="truncate">
                                      {conversation.title}
                                  </span>
                              </button>
                          ))
                      )}
                  </div>
              </div>
            <div className="mt-8">
              <Eyebrow>Try asking</Eyebrow>

              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => handleSuggestedPrompt("How am I doing financially?")}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-500 transition-colors hover:bg-[#1B2422] hover:text-slate-300"
                >
                  How am I doing financially?
                </button>

                <button
                  type="button"
                  onClick={() => handleSuggestedPrompt("How should I prioritize my loans?")}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-500 transition-colors hover:bg-[#1B2422] hover:text-slate-300"
                >
                  How should I prioritize my loans?
                </button>

                <button
                  type="button"
                  onClick={() => handleSuggestedPrompt("What should I focus on this month?")}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-500 transition-colors hover:bg-[#1B2422] hover:text-slate-300"
                >
                  What should I focus on this month?
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ==========================================================
            CHAT MAIN AREA
        ========================================================== */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col ">

          {/* CHAT HEADER */}
          <div className="shrink-0 flex items-center justify-between border-b border-[#293533] px-5 py-4 sm:px-6">
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
              ONLY SCROLLABLE AREA
          ======================================================== */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <AIChatWindow
              messages={messages}
              sending={sending}
              error={error}
              onRetry={handleRetry}
            />
          </div>

          {/* ========================================================
              INPUT - FIXED AT BOTTOM
          ======================================================== */}
          <div className="shrink-0 border-t border-[#293533] bg-[#171F1E]">
            <AIInput
              value={message}
              onChange={setMessage}
              onSend={handleSend}
              disabled={sending || conversationLoading}
            />
          </div>

        </div>
      </section>
    </div>
  );
};

export default ArventraAI;