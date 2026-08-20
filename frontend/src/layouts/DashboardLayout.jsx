import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Settings as SettingsIcon, MessageCircle } from "lucide-react";
import ARVENTRA from "../assets/ARVENTRA.png";
import ArventraAIBubble from "../components/AI/ArventraAIBubble";
import NotificationBell from "../components/Notifications/NotificationBell";

/**
 * Brand mark + wordmark as a single clickable control.
 */
const BrandMark = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-2 rounded-md transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
    aria-label="Go to homepage"
  >
    <img src={ARVENTRA} alt="" className="h-18 w-18 object-contain" />
    <span className="text-lg font-semibold tracking-wide text-white">
      ARVENTRA
    </span>
  </button>
);

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current route is /settings
  const isSettingsPage = location.pathname === "/settings";

  return (
    <div className="min-h-screen bg-[#0B0F0E] text-slate-100">
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-[#293432] bg-[#111817]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <BrandMark onClick={() => navigate("/")} />

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Context label */}
            <span className="hidden text-sm text-slate-500 sm:block">
              Financial Dashboard
            </span>

            <NotificationBell />

            {/* Contact / Support Icon Button (public page, opens outside the dashboard shell) */}
            <button
              type="button"
              onClick={() => navigate("/contact")}
              aria-label="Contact support"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#293533] bg-[#171F1E] text-slate-300 transition-colors hover:border-teal-500/50 hover:bg-[#1f2a28] hover:text-teal-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
            >
              <MessageCircle className="h-5 w-5" />
            </button>

            {/* Settings Icon Button */}
            <button
              type="button"
              onClick={() => navigate("/settings")}
              aria-label="Open Settings"
              className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[#293533] bg-[#171F1E] text-slate-300 transition-colors hover:border-teal-500/50 hover:bg-[#1f2a28] hover:text-teal-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60 ${
                isSettingsPage ? "border-teal-500 text-teal-400 bg-[#1f2a28]" : ""
              }`}
            >
              <SettingsIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= PAGE CONTENT ================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Show AI Bubble everywhere EXCEPT /settings */}
      {!isSettingsPage && <ArventraAIBubble />}
    </div>
  );
};

export default DashboardLayout;