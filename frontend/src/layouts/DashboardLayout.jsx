import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Settings as SettingsIcon, MessageCircle, MailWarning, HomeIcon } from "lucide-react";
import ARVENTRA from "../assets/ARVENTRA.png";
import ArventraAIBubble from "../components/AI/ArventraAIBubble";
import NotificationBell from "../components/Notifications/NotificationBell";
import { resendVerification } from "../services/authService";

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
  const { user } = useSelector((state) => state.auth);

  const [resendState, setResendState] = useState("idle"); // idle | sending | sent

  const handleResendVerification = async () => {
    if (!user?.email || resendState === "sending") return;
    setResendState("sending");
    try {
      await resendVerification(user.email);
    } finally {
      // Backend always responds success-shaped here regardless of outcome
      // (avoids leaking account existence), so just reflect "sent".
      setResendState("sent");
    }
  };

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

            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Contact support"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#293533] bg-[#171F1E] text-slate-300 transition-colors hover:border-teal-500/50 hover:bg-[#1f2a28] hover:text-teal-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
            >
              <HomeIcon className="h-5 w-5" />
            </button>

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

      {/* ================= UNVERIFIED EMAIL BANNER ================= */}
      {user && user.isEmailVerified === false && (
        <div className="border-b border-amber-900/40 bg-amber-950/30 px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-amber-400">
              <MailWarning className="h-4 w-4 shrink-0" />
              <span>Please verify your email address.</span>
            </div>
            {resendState === "sent" ? (
              <span className="text-sm text-amber-400/80">Verification email sent — check your inbox.</span>
            ) : (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendState === "sending"}
                className="text-sm font-medium text-amber-300 underline decoration-amber-700 underline-offset-2 hover:text-amber-200 disabled:opacity-50"
              >
                {resendState === "sending" ? "Sending..." : "Resend verification email"}
              </button>
            )}
          </div>
        </div>
      )}

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