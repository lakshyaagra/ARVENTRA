import React from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import ARVENTRA from "../assets/ARVENTRA.png";

const AILayout = () => {
  const navigate = useNavigate();
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
        <Outlet />
      </main>
    </div>
  );
};
export default AILayout;