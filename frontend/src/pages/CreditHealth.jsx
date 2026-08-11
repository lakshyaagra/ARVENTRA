import React, { useEffect } from "react";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Landmark,
  Wallet,
  CreditCard,
  Activity,
  PiggyBank,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCreditHealth } from "../features/creditHealth/creditHealthSlice";

/* =====================================================================
   HELPERS
===================================================================== */

const currency = (value = 0) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatPercent = (value = 0) =>
  `${Number(value || 0).toFixed(2)}%`;

const formatRatio = (value) => {
  if (value === null || value === undefined) {
    return "No debt";
  }

  return `${Number(value).toFixed(2)}x`;
};

const getStatusTone = (status) => {
  switch (status) {
    case "Excellent":
      return "text-teal-400 border-teal-500/20 bg-teal-500/5";

    case "Good":
      return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";

    case "Average":
      return "text-amber-400 border-amber-500/20 bg-amber-500/5";

    case "Poor":
      return "text-orange-400 border-orange-500/20 bg-orange-500/5";

    case "Critical":
      return "text-red-400 border-red-500/20 bg-red-500/5";

    default:
      return "text-slate-400 border-[#293533] bg-[#1B2422]";
  }
};

/* =====================================================================
   PRIMITIVES
===================================================================== */

const Eyebrow = ({ children }) => (
  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
    {children}
  </p>
);

const SectionCard = ({ eyebrow, title, action, children }) => (
  <section className="rounded-2xl border border-[#293533] bg-[#171F1E] p-7">
    <div className="flex items-center justify-between gap-4">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>

        <h2 className="mt-2 text-xl font-medium text-slate-100">
          {title}
        </h2>
      </div>

      {action}
    </div>

    {children}
  </section>
);

const StatBlock = ({
  icon: Icon,
  label,
  value,
  hint,
  accent = false,
}) => (
  <div className="rounded-xl border border-[#293533] bg-[#1B2422] p-5 transition-colors hover:border-teal-700/30">
    <div className="flex items-center gap-2">
      {Icon && (
        <Icon
          className="h-4 w-4 text-slate-500"
          aria-hidden="true"
        />
      )}

      <p className="text-sm text-slate-400">
        {label}
      </p>
    </div>

    <p
      className={`mt-3 text-2xl font-semibold ${
        accent ? "text-teal-400" : "text-slate-100"
      }`}
    >
      {value}
    </p>

    {hint && (
      <p className="mt-2 text-xs leading-5 text-slate-600">
        {hint}
      </p>
    )}
  </div>
);

/* =====================================================================
   CREDIT SCORE GAUGE
===================================================================== */

const CreditGauge = ({ value }) => {
  const hasValue = typeof value === "number";

  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  const progress = hasValue
    ? Math.min(Math.max(value / 100, 0), 1)
    : 0;

  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative flex h-52 w-52 items-center justify-center">
      <svg
        viewBox="0 0 160 160"
        className="h-52 w-52 -rotate-90"
      >
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#24302D"
          strokeWidth="10"
        />

        {hasValue && (
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-teal-500"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        )}
      </svg>

      <div className="absolute text-center">
        <p className="text-4xl font-semibold tracking-tight text-slate-100">
          {hasValue ? value : "—"}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          out of 100
        </p>
      </div>
    </div>
  );
};

/* =====================================================================
   HEALTH STATUS
===================================================================== */

const HealthStatus = ({ status }) => {
  if (!status) return null;

  return (
    <div
      className={`mt-5 rounded-full border px-4 py-2 text-center text-sm font-medium ${getStatusTone(
        status
      )}`}
    >
      {status} financial health
    </div>
  );
};

/* =====================================================================
   FACTOR BAR
===================================================================== */

const FactorBar = ({
  label,
  value,
  displayValue,
  max,
  description,
  tone = "bg-teal-500",
  inverse = false,
}) => {
  const numericValue = Number(value || 0);

  let percentage =
    max > 0
      ? Math.min(Math.max((numericValue / max) * 100, 0), 100)
      : 0;

  /*
   * For metrics where lower is healthier, such as DTI,
   * we visually invert the bar.
   */
  if (inverse) {
    percentage = 100 - percentage;
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-slate-200">
            {label}
          </p>

          <p className="mt-1 max-w-xl text-xs leading-5 text-slate-600">
            {description}
          </p>
        </div>

        <p className="shrink-0 text-sm font-medium text-teal-400">
          {displayValue}
        </p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#24302D]">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${tone}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

/* =====================================================================
   PAGE
===================================================================== */

const CreditHealth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    creditHealth,
    loading,
    error,
  } = useSelector((state) => state.creditHealth);

  /* ================================================================
     FETCH
  ================================================================ */

  useEffect(() => {
    dispatch(fetchCreditHealth());
  }, [dispatch]);

  /* ================================================================
     LOADING
  ================================================================ */

  if (loading && !creditHealth) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading your credit health...
        </p>
      </div>
    );
  }

  /* ================================================================
     ERROR
  ================================================================ */

  if (error && !creditHealth) {
    return (
      <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-8 text-center">
        <p className="text-sm text-red-400">
          {error}
        </p>

        <button
          type="button"
          onClick={() => dispatch(fetchCreditHealth())}
          className="mt-5 text-sm text-teal-400 transition-colors hover:text-teal-300"
        >
          Try again →
        </button>
      </div>
    );
  }

  /* ================================================================
     BACKEND → UI
  ================================================================ */

  const score = creditHealth?.score ?? null;

  const healthStatus =
    creditHealth?.healthStatus ?? null;

  const totalAssets =
    creditHealth?.totalAssets ?? 0;

  const totalOutstandingLoans =
    creditHealth?.totalOutstandingLoans ?? 0;

  const totalIncome =
    creditHealth?.totalIncome ?? 0;

  const totalExpense =
    creditHealth?.totalExpense ?? 0;

  const totalEMI =
    creditHealth?.totalEMI ?? 0;

  const savings =
    creditHealth?.savings ?? 0;

  const netWorth =
    creditHealth?.netWorth ?? 0;

  const savingsRate =
    creditHealth?.savingsRate ?? 0;

  const debtToIncomeRatio =
    creditHealth?.debtToIncomeRatio ?? 0;

  const assetLoanRatio =
    creditHealth?.assetLoanRatio ?? null;

  const activeLoans =
    creditHealth?.activeLoans ?? 0;

  const closedLoans =
    creditHealth?.closedLoans ?? 0;

  /* ================================================================
     SCORE FACTOR VISUAL VALUES
  ================================================================ */

  const savingsFactor =
    Math.min(Math.max(savingsRate / 40, 0), 1) * 35;

  const debtFactor =
    debtToIncomeRatio < 0.2
      ? 35
      : debtToIncomeRatio < 0.35
        ? 30
        : debtToIncomeRatio < 0.5
          ? 20
          : debtToIncomeRatio < 0.7
            ? 10
            : 5;

  const assetFactor =
    assetLoanRatio === null
      ? 20
      : assetLoanRatio > 5
        ? 20
        : assetLoanRatio >= 3
          ? 15
          : assetLoanRatio >= 2
            ? 10
            : assetLoanRatio >= 1
              ? 5
              : 0;

  const loanFactor =
    activeLoans === 0
      ? 10
      : activeLoans === 1
        ? 8
        : activeLoans === 2
          ? 6
          : activeLoans === 3
            ? 4
            : 2;

  return (
    <>
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-teal-400"
        >
          <ArrowLeft
            className="h-4 w-4"
            aria-hidden="true"
          />

          Back to dashboard
        </button>

        <Eyebrow>Analyze your Credit health</Eyebrow>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
          Understand your financial health. 
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          A simple view of your current financial position based on
          savings, debt, assets, and active loans.
        </p>
      </div>

      {/* ============================================================
          SCORE + SNAPSHOT
      ============================================================ */}

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">

        {/* SCORE */}

        <SectionCard
          eyebrow="Overall Financial Score"
          title="CREDIT HEALTH"
        >
          <div className="mt-7 flex flex-col items-center">

            <CreditGauge value={score} />
            <HealthStatus status={healthStatus} />

            <p className="mt-6 max-w-sm text-center text-sm leading-6 text-slate-500">
              Your score reflects your current financial position
              inside Arventra. It is intended as a guidance tool,
              not an official credit score.
            </p>

          </div>
        </SectionCard>

        {/* SNAPSHOT */}

        <SectionCard
          eyebrow="Financial position"
          title="Your current snapshot"
        >
          <div className="mt-7 grid gap-4 sm:grid-cols-2">

            <StatBlock
              icon={Wallet}
              label="Net worth"
              value={currency(netWorth)}
              hint="Assets minus outstanding loans"
              accent
            />

            <StatBlock
              icon={Landmark}
              label="Total assets"
              value={currency(totalAssets)}
              hint="Current value of your assets"
            />

            <StatBlock
              icon={CreditCard}
              label="Outstanding loans"
              value={currency(totalOutstandingLoans)}
              hint="Current outstanding debt"
            />

            <StatBlock
              icon={PiggyBank}
              label="Savings"
              value={currency(savings)}
              hint="Income minus expenses"
              accent
            />

          </div>
        </SectionCard>
      </section>

      {/* ============================================================
          SCORE FACTORS
      ============================================================ */}

      <section className="mt-6">
        <SectionCard
          eyebrow="Score factors"
          title="What's affecting your score"
        >
          <div className="mt-8 space-y-8">

            <FactorBar
              label="Savings rate"
              value={savingsFactor}
              displayValue={`${Math.round(savingsFactor)}/35`}
              max={35}
              description={`Your savings rate is ${formatPercent(
                savingsRate
              )}. Higher savings contribute more positively.`}
            />

            <FactorBar
              label="Debt-to-income"
              value={debtFactor}
              displayValue={`${debtFactor}/35`}
              max={35}
              description={`Your current debt-to-income ratio is ${debtToIncomeRatio.toFixed(
                2
              )}. Lower monthly debt obligations are healthier.`}
            />

            <FactorBar
              label="Asset coverage"
              value={assetFactor}
              displayValue={`${assetFactor}/20`}
              max={20}
              description={
                assetLoanRatio === null
                  ? "You currently have no outstanding loan balance."
                  : `Your assets cover outstanding loans by ${formatRatio(
                      assetLoanRatio
                    )}.`
              }
            />

            <FactorBar
              label="Active loans"
              value={loanFactor}
              displayValue={`${loanFactor}/10`}
              max={10}
              description={`${activeLoans} active loan${
                activeLoans === 1 ? "" : "s"
              } currently contribute to your score.`}
            />

          </div>

          <div className="mt-8 border-t border-[#293533] pt-6">
            <div className="flex items-start gap-3">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-teal-500"
                aria-hidden="true"
              />

              <p className="text-xs leading-6 text-slate-600">
                These factors are calculated from the financial
                information you have entered into Arventra. They
                are not the same criteria used by credit bureaus.
              </p>
            </div>
          </div>
        </SectionCard>
      </section>

      {/* ============================================================
          CASH FLOW
      ============================================================ */}

      <section className="mt-6">
        <SectionCard
          eyebrow="Cash flow"
          title="Income and spending"
        >
          <div className="mt-7 grid gap-4 sm:grid-cols-2">

            <StatBlock
              icon={TrendingUp}
              label="Total income"
              value={currency(totalIncome)}
            />

            <StatBlock
              icon={TrendingDown}
              label="Total expenses"
              value={currency(totalExpense)}
            />

            <StatBlock
              icon={PiggyBank}
              label="Savings rate"
              value={formatPercent(savingsRate)}
              hint="Income remaining after expenses"
              accent
            />

            <StatBlock
              icon={Activity}
              label="Total EMI"
              value={currency(totalEMI)}
              hint="Current loan repayment obligations"
            />

          </div>
        </SectionCard>
      </section>

      {/* ============================================================
          LOAN POSITION
      ============================================================ */}

      <section className="mt-6">
        <SectionCard
          eyebrow="Debt"
          title="Loan position"
        >
          <div className="mt-7 grid gap-4 sm:grid-cols-3">

            <StatBlock
              icon={CreditCard}
              label="Active loans"
              value={activeLoans}
              hint="Currently active"
            />

            <StatBlock
              icon={Activity}
              label="Closed loans"
              value={closedLoans}
              hint="Successfully completed"
              accent
            />

            <StatBlock
              icon={Landmark}
              label="Asset coverage"
              value={formatRatio(assetLoanRatio)}
              hint="Assets compared with outstanding loans"
            />

          </div>
        </SectionCard>
      </section>

      {/* ============================================================
          NEXT STEP
      ============================================================ */}

      <section className="mt-6">
        <div className="rounded-2xl border border-[#293533] bg-[#141B1A] p-7">

          <Eyebrow>
            Keep improving
          </Eyebrow>

          <h2 className="mt-2 text-xl font-medium text-slate-100">
            Your score can change as your financial position changes.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Keep your income, expenses, loans, assets, and financial
            goals updated in Arventra. Your credit health will reflect
            those changes the next time it is calculated.
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-lg bg-teal-500 px-5 py-3 text-sm font-semibold text-[#0E1514] transition hover:bg-teal-400"
          >
            Back to dashboard →
          </button>

        </div>
      </section>

      {/* ============================================================
          DISCLAIMER
      ============================================================ */}

      <section className="mt-6">
        <div className="rounded-xl border border-[#293533] bg-[#141B1A] px-6 py-5">

          <p className="text-xs leading-6 text-slate-600">
            This credit health score is calculated using your financial
            information inside Arventra. It is not an official credit
            score and does not represent a score provided by CIBIL,
            Experian, Equifax, or any other credit bureau.
          </p>

        </div>
      </section>
    </>
  );
};

export default CreditHealth;