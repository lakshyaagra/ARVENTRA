import React, { useEffect, useState } from "react";
import {
  Bell,
  Sparkles,
  Save,
  Check,
  ArrowLeft,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSettings,
  updateSettings,
  clearUpdateSuccess,
} from "../features/settings/settingsSlice";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

/* =====================================================================
   PRIMITIVES
   ===================================================================== */

const Eyebrow = ({ children }) => (
  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
    {children}
  </p>
);

const SettingsSection = ({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
}) => (
  <section className="rounded-2xl border border-[#293533] bg-[#171F1E] p-6 sm:p-7">
    <div className="flex items-start gap-4">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#293533] bg-[#1B2422]">
        <Icon className="h-4 w-4 text-teal-400" aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <Eyebrow>{eyebrow}</Eyebrow>

        <h2 className="mt-2 text-xl font-medium text-slate-100">{title}</h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>

    <div className="mt-7">{children}</div>
  </section>
);

const SettingRow = ({ label, description, children, last = false }) => (
  <div
    className={`flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between ${
      !last ? "border-b border-[#293533]" : ""
    }`}
  >
    <div className="min-w-0">
      <p className="text-sm font-medium text-slate-200">{label}</p>

      {description && (
        <p className="mt-1 max-w-xl text-xs leading-5 text-slate-600">
          {description}
        </p>
      )}
    </div>

    <div className="shrink-0">{children}</div>
  </div>
);

const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60 ${
      checked
        ? "border-teal-500/50 bg-teal-500/80"
        : "border-[#35413F] bg-[#121817]"
    }`}
  >
    <span
      className={`absolute top-1 left-1 h-3.5 w-3.5 rounded-full bg-slate-100 shadow-sm transition-transform duration-200 ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

/* =====================================================================
   PAGE
   ===================================================================== */

const Settings = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate()

  const {
    settings,
    loading,
    updating,
    error,
    updateError,
    updateSuccess,
  } = useSelector((state) => state.settings);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
  };

  // Form structured directly according to Mongoose schema
  const [form, setForm] = useState({
    notifications: {
      emiReminder: true,
      savingsAlert: true,
      aiRecommendation: true,
    },
    ai: {
      enableAI: true,
    },
  });

  /* ================================================================
     FETCH
     ================================================================ */

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  /* ================================================================
     MAP BACKEND → FORM
     ================================================================ */

  useEffect(() => {
    if (!settings) return;

    setForm({
      notifications: {
        emiReminder: settings.notifications?.emiReminder ?? true,
        savingsAlert: settings.notifications?.savingsAlert ?? true,
        aiRecommendation: settings.notifications?.aiRecommendation ?? true,
      },
      ai: {
        enableAI: settings.ai?.enableAI ?? true,
      },
    });
  }, [settings]);

  /* ================================================================
     SUCCESS MESSAGE TIMER
     ================================================================ */

  useEffect(() => {
    if (!updateSuccess) return;

    const timer = setTimeout(() => {
      dispatch(clearUpdateSuccess());
    }, 3000);

    return () => clearTimeout(timer);
  }, [updateSuccess, dispatch]);

  /* ================================================================
     HELPERS
     ================================================================ */

  const updateNestedField = (category, key, value) => {
    setForm((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  /* ================================================================
     SAVE
     ================================================================ */

  const handleSave = () => {
    dispatch(updateSettings(form));
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="mb-6 flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-teal-400"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to dashboard
                </button>
        <Eyebrow>Settings</Eyebrow>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">
          Manage your preferences
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
          Control how ARVENTRA sends notifications and manages AI features for your workspace.
        </p>
      </div>

      {/* STATUS NOTIFICATIONS */}
      {(updateSuccess || updateError) && (
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
            updateSuccess
              ? "border-teal-700/30 bg-teal-500/6 text-teal-400"
              : "border-red-900/40 bg-red-500/5 text-red-400"
          }`}
        >
          {updateSuccess ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              <span>Settings saved successfully.</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <span>{updateError}</span>
            </>
          )}
        </div>
      )}

      {/* LOADING & ERROR STATES */}
      {loading && !settings ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm text-slate-500">Loading your settings...</p>
        </div>
      ) : error && !settings ? (
        <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-8 text-center">
          <AlertCircle className="mx-auto h-5 w-5 text-red-400" />
          <p className="mt-3 text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => dispatch(fetchSettings())}
            className="mt-5 text-sm text-teal-400 transition-colors hover:text-teal-300"
          >
            Try again →
          </button>
        </div>
      ) : (
        /* SETTINGS FORM */
        <div className="space-y-8">
          {/* NOTIFICATIONS */}
          <SettingsSection
            icon={Bell}
            eyebrow="Notifications"
            title="Notification preferences"
            description="Choose which financial and system notifications ARVENTRA can send you."
          >
            <SettingRow
              label="EMI reminders"
              description="Receive reminders related to your active loan obligations."
            >
              <Toggle
                checked={form.notifications.emiReminder}
                onChange={(value) =>
                  updateNestedField("notifications", "emiReminder", value)
                }
                label="EMI reminders"
              />
            </SettingRow>

            <SettingRow
              label="Savings alerts"
              description="Receive alerts when your savings situation needs attention."
            >
              <Toggle
                checked={form.notifications.savingsAlert}
                onChange={(value) =>
                  updateNestedField("notifications", "savingsAlert", value)
                }
                label="Savings alerts"
              />
            </SettingRow>

            <SettingRow
              label="AI recommendations"
              description="Allow ARVENTRA to notify you about relevant financial recommendations."
              last
            >
              <Toggle
                checked={form.notifications.aiRecommendation}
                onChange={(value) =>
                  updateNestedField("notifications", "aiRecommendation", value)
                }
                label="AI recommendations"
              />
            </SettingRow>
          </SettingsSection>

          {/* AI */}
          <SettingsSection
            icon={Sparkles}
            eyebrow="Artificial intelligence"
            title="AI preferences"
            description="Control how ARVENTRA's AI features interact with your financial experience."
          >
            <SettingRow
              label="Enable AI"
              description="Allow ARVENTRA AI features to analyse your financial information."
              last
            >
              <Toggle
                checked={form.ai.enableAI}
                onChange={(value) =>
                  updateNestedField("ai", "enableAI", value)
                }
                label="Enable AI"
              />
            </SettingRow>
          </SettingsSection>

          {/* ACCOUNT */}
          <SettingsSection
            icon={LogOut}
            eyebrow="Account"
            title="Session"
            description="Sign out of ARVENTRA on this device."
          >
            <SettingRow
              label="Log out"
              description="You'll need to sign in again to access your account."
              last
            >
              <button
                type="button"
                onClick={handleLogout}
                className=" flex items-center gap-2 rounded-lg border border-red-900/40
                bg-red-950/20 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors
                hover:border-red-800/60 hover:bg-red-950/30 focus:outline-none
                focus-visible:ring-2 focus-visible:ring-red-500/40"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Log out
              </button>
            </SettingRow>
          </SettingsSection>

          {/* SAVE BUTTON */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={updating}
              className=" flex items-center gap-2 rounded-lg bg-teal-500 px-6 py-3
              text-sm font-semibold text-[#0E1514] transition-colors hover:bg-teal-400
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60 
              disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {updating ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;