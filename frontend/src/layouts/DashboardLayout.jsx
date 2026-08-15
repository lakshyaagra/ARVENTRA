import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ARVENTRA from "../assets/ARVENTRA.png";
import ArventraAIBubble from "../components/AI/ArventraAIBubble";

/**
 * Brand mark + wordmark as a single clickable control.
 *
 * Fix: the original wrapped a <button> inside an onClick <div>, which
 * creates two overlapping click targets doing the same thing and leaves
 * the div itself unreachable by keyboard. One semantic <button>, one job.
 */
const BrandMark = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-2 rounded-md transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
    aria-label="Go to homepage"
  >
    {/* Fix: h-18/w-18 (72px) doesn't exist in default Tailwind and, even
        as an arbitrary value, is taller than the header itself and forces
        the row to overflow. Sized to sit comfortably inside py-4. */}
    <img src={ARVENTRA} alt="" className="h-18 w-18 object-contain" />
    <span className="text-lg font-semibold tracking-wide text-white">
      ARVENTRA
    </span>
  </button>
);

/**
 * Placeholder for the account menu trigger. Kept as an isolated component
 * so swapping the initial for a real avatar image, or wiring up a dropdown,
 * touches one place instead of the header markup.
 */
const UserMenuTrigger = ({ initial = "U" }) => (
  <button
    type="button"
    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#35413F] bg-[#151D1C] text-sm font-medium text-teal-400 transition-colors hover:border-teal-500/50 hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
    aria-label="Open account menu"
  >
    {initial}
  </button>
);

const DashboardLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0F0E] text-slate-100">
      {/* ================= NAVBAR =================
          Fix: `top-0` alone has no effect without a position value —
          the header needs `sticky` (or `fixed`) to actually stay pinned
          while the page scrolls. */}
      <header className="sticky top-0 z-50 border-b border-[#293432] bg-[#111817]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <BrandMark onClick={() => navigate("/")} />

          <div className="flex items-center gap-4">
            {/* Context label for the current section — hidden on mobile
                where header space is tight and the page content already
                makes this clear. */}
            <span className="hidden text-sm text-slate-500 sm:block">
              Financial Dashboard
            </span>
            <UserMenuTrigger />
          </div>
        </div>
      </header>

      {/* ================= PAGE CONTENT =================
          Responsive gutters: px-4 on mobile, widening at sm/lg instead of
          a flat px-6 that's cramped on small screens and stingy on large
          ones. */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <ArventraAIBubble/>
    </div>
  );
};
export default DashboardLayout;