import React, { useState } from "react";
import {
  Calculator,
  ChevronRight,
  TrendingUp,
  PiggyBank,
  Landmark,
  CalendarDays,
  ReceiptText,
  Menu,
  X,
} from "lucide-react";
import ARVENTRA from "../assets/ARVENTRA.png";
import { useNavigate } from "react-router-dom";
import CalculatorForm from "../components/Calculator/CalculatorForm";
import CalculatorResult from "../components/Calculator/CalculatorResult";
import calculatorService from "../services/calculatorService";
import { calculatorGroups, calculators } from "../config/calculatorConfig";
import useAuth from "../hooks/authHook";

/* Map icons directly in case they are missing from group objects */
const ICON_MAP = {
  investments: TrendingUp,
  savings: PiggyBank,
  loans: Landmark,
  planning: CalendarDays,
  tax: ReceiptText,
};

/* =====================================================================
   PAGE
===================================================================== */

const Calculators = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedCalculator, setSelectedCalculator] = useState(null);
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goToAppOr = (destination) => navigate(isAuthenticated ? "/dashboard" : destination);

  const handleNavClick = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleSelectCalculator = (calculator) => {
    setSelectedCalculator(calculator);
    setResult(null);
    setError(null);

    const initialValues = {};

    calculator.fields.forEach((field) => {
      if (field.type === "select") {
        initialValues[field.name] = field.options[0].value;
      } else {
        initialValues[field.name] = "";
      }
    });

    setValues(initialValues);
  };

  const handleChange = (name, value) => {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError(null);
  };

  const handleReset = () => {
    if (!selectedCalculator) return;
    handleSelectCalculator(selectedCalculator);
  };

  const handleCalculate = async () => {
    if (!selectedCalculator) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = {};

      selectedCalculator.fields.forEach((field) => {
        params[field.name] = values[field.name];
      });

      const response = await calculatorService.calculate(
        selectedCalculator.endpoint,
        params,
      );

      setResult(response);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to calculate this result.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111817] text-slate-100">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-[#111817]/40 backdrop-blur-[30px] backdrop-saturate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-9">
          {/* Logo */}
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleNavClick("/")}
          >
            <img
              src={ARVENTRA}
              alt="Logo"
              className="h-10 w-10 cursor-pointer object-contain"
            />
            <button className="cursor-pointer text-xl font-semibold tracking-wide text-white">
              ARVENTRA
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <button
              onClick={() => navigate("/calculators")}
              className="text-teal-400"
            >
              Calculators
            </button>
            <button
              onClick={() => navigate("/")}
              className="transition hover:text-white"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/learning")}
              className="transition hover:text-white"
            >
              Learn
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="transition hover:text-white"
            >
              Contact
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-lg border border-[#40504D] px-4 py-2 text-slate-200 transition hover:border-teal-500 hover:text-teal-400"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="transition hover:text-white"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="rounded-lg border border-[#40504D] px-4 py-2 text-slate-200 transition hover:border-teal-500 hover:text-teal-400"
                >
                  Create account
                </button>
              </>
            )}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg p-2 text-slate-300 hover:bg-[#1C2624] hover:text-white md:hidden"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="border-b border-white/10 bg-[#111817]/95 px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-4 text-left text-sm text-slate-300">
              <button
                onClick={() => handleNavClick("/calculators")}
                className="py-2 text-left text-teal-400"
              >
                Calculators
              </button>
              <button
                onClick={() => handleNavClick("/")}
                className="py-2 text-left transition hover:text-white"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick("/learning")}
                className="py-2 text-left transition hover:text-white"
              >
                Learn
              </button>
              <button
                onClick={() => handleNavClick("/contact")}
                className="py-2 text-left transition hover:text-white"
              >
                Contact
              </button>

              <div className="mt-2 flex flex-col gap-3 border-t border-white/10 pt-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => handleNavClick("/dashboard")}
                    className="w-full rounded-lg border border-[#40504D] py-2.5 text-center text-slate-200 transition hover:border-teal-500 hover:text-teal-400"
                  >
                    Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavClick("/login")}
                      className="w-full py-2 text-left transition hover:text-white"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => handleNavClick("/register")}
                      className="w-full rounded-lg border border-[#40504D] py-2.5 text-center text-slate-200 transition hover:border-teal-500 hover:text-teal-400"
                    >
                      Create account
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* MOBILE CALCULATOR SELECTOR */}
      <div className="mx-auto max-w-7xl px-6 pt-34 lg:hidden">
        <label className="mb-2 block text-xs text-slate-500">
          Choose a calculator
        </label>

        <select
          value={selectedCalculator?.id || ""}
          onChange={(e) => {
            const calculator = calculators.find(
              (item) => item.id === e.target.value,
            );

            if (calculator) {
              handleSelectCalculator(calculator);
            }
          }}
          className="w-full rounded-xl border border-[#293533] bg-[#141B1A] px-4 py-3 text-sm text-slate-200 outline-none focus:border-teal-500/50"
        >
          <option value="">Select calculator</option>

          {calculators.map((calculator) => (
            <option key={calculator.id} value={calculator.id}>
              {calculator.title}
            </option>
          ))}
        </select>
      </div>

      {/* DESKTOP SIDEBAR + MAIN */}
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl pt-20 lg:pt-24">
        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-[#293533] lg:block">
          <div className="sticky top-24 p-6">
            {/* SIDEBAR TITLE */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal-700/30 bg-teal-500/10">
                <Calculator className="h-4 w-4 text-teal-400" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Calculators
                </p>

                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                  Financial tools
                </p>
              </div>
            </div>

            {/* CALCULATOR NAVIGATION */}
            <div className="mt-8 space-y-7">
              {calculatorGroups.map((group) => {
                // Safeguard icon resolving
                const GroupIcon = group.icon || ICON_MAP[group.id] || Calculator;

                return (
                  <div key={group.id}>
                    <div className="flex items-center gap-2 px-2">
                      <GroupIcon className="h-3.5 w-3.5 text-slate-600" />

                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        {group.label}
                      </p>
                    </div>

                    <div className="mt-2 space-y-1">
                      {group.calculators.map((calculator) => {
                        const active = selectedCalculator?.id === calculator.id;

                        return (
                          <button
                            key={calculator.id}
                            type="button"
                            onClick={() => handleSelectCalculator(calculator)}
                            className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
                              active
                                ? "bg-[#1B2926] text-teal-400"
                                : "text-slate-300 hover:bg-[#1B2422] hover:text-slate-300"
                            }`}
                          >
                            <span className="truncate">{calculator.title}</span>

                            <ChevronRight
                              className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                                active
                                  ? "translate-x-0 opacity-100"
                                  : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex min-w-0 flex-1 items-center justify-center px-6 py-12 lg:px-12 lg:py-16">
          {!selectedCalculator ? (
            /* INTRO STATE */
            <div className="w-full max-w-2xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-700/30 bg-teal-500/10">
                <Calculator className="h-6 w-6 text-teal-400" />
              </div>

              <p className="mt-7 text-xs uppercase tracking-[0.2em] text-teal-400">
                Practical financial tools
              </p>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">
                Understand the numbers behind your decisions.
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
                Arventra's financial calculators help you explore savings,
                investments, loans, retirement planning, and taxes through
                simple, practical calculations.
              </p>

              <p className="mt-6 text-xs text-slate-600">
                Choose a calculator from the sidebar to get started.
              </p>
            </div>
          ) : (
            /* CALCULATOR STATE */
            <div className="w-full max-w-2xl">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-teal-400">
                  Financial calculator
                </p>

                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100">
                  {selectedCalculator.title}
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  {selectedCalculator.description}
                </p>
              </div>

              {/* CALCULATOR PANEL */}
              <div
                className="mt-8 rounded-2xl border border-double border-[#24302D] bg-[#151D1C] p-6
                            transition-colors hover:border-teal-700/40 sm:p-8"
              >
                <CalculatorForm
                  calculator={selectedCalculator}
                  values={values}
                  onChange={handleChange}
                  onCalculate={handleCalculate}
                  onReset={handleReset}
                  loading={loading}
                />
                {error && (
                  <div className="mt-5 rounded-xl border border-red-900/30 bg-red-500/5 px-4 py-3">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <CalculatorResult
                  calculator={selectedCalculator}
                  result={result}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Calculators;