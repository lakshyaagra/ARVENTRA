import React, { useEffect } from "react";
import { ArrowLeft, Sparkles, PauseCircle } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ARVENTRA from "../assets/ARVENTRA.png";
import { fetchSettings } from "../features/settings/settingsSlice";

const AILayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { settings } = useSelector((state) => state.settings);

  // A direct visit to /ai (bookmark, typed URL) may land here before
  // DashboardLayout has ever fetched settings, so fetch independently
  // rather than assuming it's already loaded.
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const isAIEnabled = settings?.ai?.enableAI !== false;

  return (
    <div className="min-h-screen bg-[#0B0F0E] text-slate-100">
      <header className="border-b border-[#293432] bg-[#111817]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button type="button"
            onClick={() => navigate("/")}
            className=" flex items-center gap-2 rounded-md transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60
            "
          >
            <img src={ARVENTRA} alt="ARVENTRA"
              className="h-9 w-9 object-contain"
            />
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-wide text-white">
                ARVENTRA
              </span>
              <span className="text-slate-600">/</span>
              <span className="flex items-center gap-1.5 text-sm text-teal-400">
                <Sparkles className="h-3.5 w-3.5" />
                AI
              </span>
            </div>
          </button>

          {/* BACK TO DASHBOARD */}
          <button type="button"
            onClick={() => navigate("/dashboard")}
            className=" flex items-center gap-2 rounded-lg border border-[#293533] bg-[#151D1C] px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-teal-700/40 hover:text-teal-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60
            "
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {isAIEnabled ? (
          <Outlet />
        ) : (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#293533] bg-[#171F1E]">
              <PauseCircle className="h-6 w-6 text-slate-500" />
            </div>
            <h2 className="text-lg font-medium text-slate-200">
              Arventra AI is turned off
            </h2>
            <p className="max-w-sm text-sm leading-6 text-slate-500">
              You've disabled AI features in your settings. Turn it back on to chat with Arventra AI.
            </p>
            <button
              type="button"
              onClick={() => navigate("/settings")}
              className="mt-2 rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-semibold text-[#0E1514] transition hover:bg-teal-400"
            >
              Go to Settings
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
export default AILayout;