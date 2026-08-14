import React, { useEffect } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  Landmark,
  Activity,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../features/dashboard/dashboardSlice";

/* =====================================================================
   HELPERS
   ===================================================================== */

const currency = (value = 0) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

/* =====================================================================
   PRIMITIVES
   ===================================================================== */

const Eyebrow = ({ children }) => (
  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
    {children}
  </p>
);

const SummaryCard = ({ icon: Icon, label, value, hint, accent = false }) => (
  <div className="group rounded-xl border border-[#24302D] bg-[#121817] p-5 transition-colors hover:border-teal-700/40">
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500">{label}</p>

      <Icon
        className="h-4 w-4 text-slate-600 transition-colors group-hover:text-teal-500"
        aria-hidden="true"
      />
    </div>

    <p
      className={`mt-3 text-2xl font-semibold ${
        accent ? "text-teal-400" : "text-slate-100"
      }`}
    >
      {value}
    </p>

    <p className="mt-2 text-xs text-slate-600">{hint}</p>
  </div>
);

const SectionCard = ({ eyebrow, title, action, children }) => (
  <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-7">
    <div className="flex items-center justify-between">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>

        <h2 className="mt-2 text-xl font-medium text-slate-100">
          {title}
        </h2>
      </div>

      {action}
    </div>

    {children}
  </div>
);

const FlowStat = ({ icon: Icon, label, value, percent, tone }) => (
  <div className="rounded-xl border border-[#293533] bg-[#1B2422] p-5">
    <div className="flex items-center gap-2 text-slate-400">
      <Icon className="h-4 w-4" aria-hidden="true" />

      <p className="text-sm">{label}</p>
    </div>

    <p className="mt-3 text-2xl font-semibold text-slate-100">
      {value}
    </p>

    <div
      className="mt-5 h-2 rounded-full bg-[#24302D]"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label} share of total cash flow`}
    >
      <div
        className={`h-2 rounded-full transition-[width] ${tone}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

const StatBlock = ({
  label,
  value,
  hint,
  accent = false,
  size = "text-2xl",
}) => (
  <div className="rounded-xl border border-[#293533] bg-[#1B2422] p-5">
    <p className="text-sm text-slate-400">{label}</p>

    <p
      className={`mt-3 ${size} font-semibold ${
        accent ? "text-teal-400" : "text-slate-100"
      }`}
    >
      {value}
    </p>

    {hint && (
      <p className="mt-2 text-xs text-slate-600">
        {hint}
      </p>
    )}
  </div>
);

const CreditGauge = ({ value, max = 100 }) => {
  const hasValue = typeof value === "number";

  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  const progress = hasValue
    ? Math.min(Math.max(value / max, 0), 1)
    : 0;

  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg
        viewBox="0 0 120 120"
        className="h-32 w-32 -rotate-90"
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#24302D"
          strokeWidth="8"
        />

        {hasValue && (
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-teal-500"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        )}
      </svg>

      {/* CENTER TEXT OVERLAY */}
      <div className="absolute text-center">
        <p className="text-2xl font-semibold text-slate-100">
          {hasValue ? (
            <>
              {value}
              <span className="text-xs font-normal text-slate-500">/{max}</span>
            </>
          ) : (
            "—"
          )}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">Score</p>
      </div>
    </div>
  );
};

const EmptyNote = ({
  icon: Icon,
  children,
  onClick,
  actionLabel,
}) => {
  const content = (
    <>
      <Icon
        className="h-5 w-5 text-slate-600 transition-colors group-hover:text-teal-500"
        aria-hidden="true"
      />

      <p className="max-w-xs text-sm leading-6 text-slate-500">
        {children}
      </p>

      {onClick && (
        <span className="flex items-center gap-1 text-xs font-medium text-teal-400 transition-colors group-hover:text-teal-300">
          {actionLabel || "Get started"}

          <ArrowRight
            className="h-3 w-3"
            aria-hidden="true"
          />
        </span>
      )}
    </>
  );

  const sharedClasses =
    "mt-7 flex w-full flex-col items-center gap-3 rounded-xl border border-dashed border-[#293533] px-5 py-8 text-center";

  if (!onClick) {
    return (
      <div className={sharedClasses}>
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${sharedClasses} group cursor-pointer transition-colors hover:border-teal-700/50 hover:bg-[#1B2422] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60`}
    >
      {content}
    </button>
  );
};

//helper for recommendations

const getCreditHealthRecommendation = ({
    savingsRate,
    debtToIncomeRatio,
    assetLoanRatio,
    activeLoans,
  }) => {
    if (savingsRate !== null && savingsRate < 10) {
      return {
        title: "Focus on building your savings",
        description:
          "Your current savings rate is low. Try to reduce unnecessary spending and keep a portion of your income aside regularly.",
      };
    }

    if (
      debtToIncomeRatio !== null &&
      debtToIncomeRatio >= 0.5
    ) {
      return {
        title: "Focus on reducing debt pressure",
        description:
          "A large portion of your income is going toward loan obligations. Reducing outstanding debt could improve your financial health.",
      };
    }

    if (
      assetLoanRatio !== null &&
      assetLoanRatio < 1
    ) {
      return {
        title: "Strengthen your asset position",
        description:
          "Your outstanding loans are currently higher than your assets. Building assets and reducing debt can improve your financial position.",
      };
    }

    if (activeLoans >= 3) {
      return {
        title: "Focus on managing your active loans",
        description:
          "You currently have several active loans. Reviewing your loan obligations and prioritising repayment may help reduce financial pressure.",
      };
    }

    if (
      savingsRate !== null &&
      savingsRate >= 35 &&
      debtToIncomeRatio !== null &&
      debtToIncomeRatio < 0.35
    ) {
      return {
        title: "Keep your current financial habits",
        description:
          "Your savings and debt position are currently healthy. Stay consistent and continue building your financial stability.",
      };
    }

    return {
      title: "Keep improving your financial position",
      description:
        "Your financial health is progressing. Continue monitoring your savings, debt, assets, and loans to identify areas where you can improve.",
    };
  };

/* =====================================================================
   PAGE
   ===================================================================== */

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ================================================================
     REDUX STATE
     ================================================================ */

  const {
    dashboard,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  /* ================================================================
     FETCH DASHBOARD
     ================================================================ */

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  /* ================================================================
     LOADING STATE
     ================================================================ */

  if (loading && !dashboard) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading your financial overview...
        </p>
      </div>
    );
  }

  /* ================================================================
     ERROR STATE
     ================================================================ */

  if (error && !dashboard) {
    return (
      <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-8 text-center">
        <p className="text-sm text-red-400">
          {error}
        </p>

        <button
          type="button"
          onClick={() => dispatch(fetchDashboard())}
          className="mt-5 text-sm text-teal-400 transition-colors hover:text-teal-300"
        >
          Try again →
        </button>
      </div>
    );
  }

  /* ================================================================
     BACKEND → UI MAPPING
     ================================================================ */

  const totalAssets = dashboard?.totalAssets ?? 0;
  const totalIncome = dashboard?.totalIncome ?? 0;
  const totalExpense = dashboard?.totalExpense ?? 0;

  const totalOutstandingLoans =
    dashboard?.totalOutstandingLoans ?? 0;

  const netWorth = dashboard?.netWorth ?? 0;
  const savings = dashboard?.savings ?? 0;

  const activeLoans = dashboard?.activeLoans ?? 0;
  const closedLoans = dashboard?.closedLoans ?? 0;
  const totalLoans = dashboard?.totalLoans ?? 0;

  const activeGoals = dashboard?.activeGoals ?? 0;
  const completedGoals = dashboard?.completedGoals ?? 0;
  const totalGoals = dashboard?.totalGoals ?? 0;

  const totalExpenseCount =
    dashboard?.totalExpenseCount ?? 0;

  const totalIncomeRecords =
    dashboard?.totalIncomeRecords ?? 0;

  const creditHealthScore = dashboard?.creditHealthScore ?? null;

  const savingsRate =
    dashboard?.savingsRate ?? null;

  const debtToIncomeRatio =
    dashboard?.debtToIncomeRatio ?? null;

  const assetLoanRatio =
    dashboard?.assetLoanRatio ?? null;

  const creditHealthStatus = dashboard?.creditHealthStatus ?? null;
  const recentExpenses = dashboard?.recentExpenses ?? [];
  const recentLoans = dashboard?.recentLoans ?? [];
  const recentIncome = dashboard?.recentIncome ?? [];
  const recentGoals = dashboard?.recentGoals ?? [];
  const recentAssets = dashboard?.recentAssets ?? [];

  const totalFlow = totalIncome + totalExpense;

  const incomePercent =
    totalFlow > 0
      ? Math.round((totalIncome / totalFlow) * 100)
      : 0;

  const expensePercent =
    totalFlow > 0
      ? Math.round((totalExpense / totalFlow) * 100)
      : 0;

  const creditRecommendation =
    getCreditHealthRecommendation({
      savingsRate,
      debtToIncomeRatio,
      assetLoanRatio,
      activeLoans,
    });

  /* ================================================================
     RECENT ACTIVITY
     ================================================================ */

  const recentActivity = [
    ...recentIncome.map((item) => ({
      id: `income-${item._id}`,
      title: "Income added",
      description: `₹${Number(
        item.amount || 0
      ).toLocaleString("en-IN")}`,
      createdAt: item.createdAt,
    })),

    ...recentExpenses.map((item) => ({
      id: `expense-${item._id}`,
      title: "Expense recorded",
      description: `₹${Number(
        item.amount || 0
      ).toLocaleString("en-IN")}`,
      createdAt: item.createdAt,
    })),

    ...recentGoals.map((item) => ({
      id: `goal-${item._id}`,
      title: "Goal created",
      description: item.name || "New financial goal",
      createdAt: item.createdAt,
    })),

    ...recentAssets.map((item) => ({
      id: `asset-${item._id}`,
      title: "Asset Added",
      description: item.assetName || "New Asset",
      createdAt: item.createdAt,
    })),

    ...recentLoans.map((item) => ({
      id: `loan-${item._id}`,
      title: "Loan added",
      description: `₹${Number(
        item.outstandingAmount || 0
      ).toLocaleString("en-IN")} outstanding`,
      createdAt: item.createdAt,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  return (
    <>
      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <Eyebrow>Dashboard</Eyebrow>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
          Your financial overview
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Track income, spending, goals, loans, and assets in one place —
          updated as you add your financial information.
        </p>
      </div>

      {/* ================= SUMMARY CARDS ================= */}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryCard
          icon={Wallet}
          label="Net worth"
          value={currency(netWorth)}
          hint="Assets minus liabilities"
        />

        <SummaryCard
          icon={Landmark}
          label="Assets"
          value={currency(totalAssets)}
          hint="Total assets"
        />

        <SummaryCard
          icon={TrendingUp}
          label="Total income"
          value={currency(totalIncome)}
          hint={`${totalIncomeRecords} income records`}
        />

        <SummaryCard
          icon={TrendingDown}
          label="Total expense"
          value={currency(totalExpense)}
          hint={`${totalExpenseCount} expense records`}
        />

        <SummaryCard
          icon={PiggyBank}
          label="Savings"
          value={currency(savings)}
          hint="Income minus expense"
          accent
        />
      </section>

      {/* ================= MAIN CONTENT ================= */}

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.85fr_1fr]">

        {/* ================= LEFT — 65% ================= */}

        <div className="space-y-6">

          {/* FINANCIAL OVERVIEW */}

          <SectionCard
            eyebrow="Overview"
            title="Financial overview"
            action={
              <span className="text-xs text-slate-500">
                All time
              </span>
            }
          >
            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <FlowStat
                icon={TrendingUp}
                label="Income"
                value={currency(totalIncome)}
                percent={incomePercent}
                tone="bg-teal-500"
              />

              <FlowStat
                icon={TrendingDown}
                label="Expenses"
                value={currency(totalExpense)}
                percent={expensePercent}
                tone="bg-teal-500/70"
              />

            </div>

            {/* ALWAYS VISIBLE ACTIONS */}

            <div className="grid gap-4 sm:grid-cols-2">

              <EmptyNote
                icon={TrendingUp}
                onClick={() => navigate("/income")}
                actionLabel="Add income"
              >
                Log your income to keep your cash flow updated.
              </EmptyNote>

              <EmptyNote
                icon={TrendingDown}
                onClick={() => navigate("/expenses")}
                actionLabel="Add expense"
              >
                Log your expenses to keep track of your spending.
              </EmptyNote>

            </div>
          </SectionCard>

          {/* GOALS */}

          <SectionCard
            eyebrow="Goals"
            title="Your goals"
            action={
              <button
                type="button"
                onClick={() => navigate("/goals")}
                className="flex items-center gap-1 rounded-md text-sm text-teal-400 transition-colors hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
              >
                View all

                <ArrowRight
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </button>
            }
          >
            <div className="mt-7 grid gap-4 sm:grid-cols-2">

              <StatBlock
                label="Active goals"
                value={activeGoals}
                hint="Goals currently in progress"
                size="text-3xl"
              />

              <StatBlock
                label="Completed goals"
                value={completedGoals}
                hint="Goals you've hit so far"
                size="text-3xl"
                accent
              />

            </div>

            {/* ALWAYS VISIBLE */}

            <EmptyNote
              icon={Target}
              onClick={() => navigate("/goals")}
              actionLabel="Create a goal"
            >
              {totalGoals === 0
                ? "Set a target to start tracking your financial progress."
                : "Create another goal or manage your existing financial targets."}
            </EmptyNote>

          </SectionCard>

          {/* LOANS */}

          <SectionCard
            eyebrow="Loans"
            title="Loan overview"
            action={
              <button
                type="button"
                onClick={() => navigate("/loans")}
                className="flex items-center gap-1 rounded-md text-sm text-teal-400 transition-colors hover:text-teal-300"
              >
                View all

                <ArrowRight
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </button>
            }
          >
            <div className="mt-7 grid gap-4 sm:grid-cols-3">

              <StatBlock
                label="Active loans"
                value={activeLoans}
              />

              <StatBlock
                label="Closed loans"
                value={closedLoans}
              />

              <StatBlock
                label="Outstanding"
                value={currency(totalOutstandingLoans)}
              />

            </div>

            {/* ALWAYS VISIBLE */}

            <EmptyNote
              icon={Landmark}
              onClick={() => navigate("/loans")}
              actionLabel="Add a loan"
            >
              {totalLoans === 0
                ? "Add your current loans to track balances and payoff progress."
                : "Add another loan or manage your existing loan records."}
            </EmptyNote>

          </SectionCard>

          {/* ASSETS */}

          <SectionCard
            eyebrow="Assets"
            title="Your assets"
            action={
              <button
                type="button"
                onClick={() => navigate("/assets")}
                className="flex items-center gap-1 rounded-md text-sm text-teal-400 transition-colors hover:text-teal-300"
              >
                View all

                <ArrowRight
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </button>
            }
          >
            <div className="mt-7 grid gap-4 sm:grid-cols-2">

              <StatBlock
                label="Total assets"
                value={currency(totalAssets)}
                hint="Current value of your assets"
                accent
              />

              <StatBlock
                label="Net worth contribution"
                value={currency(totalAssets)}
                hint="Before outstanding liabilities"
              />

            </div>

            {/* ALWAYS VISIBLE */}

            <EmptyNote
              icon={Wallet}
              onClick={() => navigate("/assets")}
              actionLabel="Add an asset"
            >
              {totalAssets === 0
                ? "Add your first asset to start building your financial picture."
                : "Add another asset or manage your existing assets."}
            </EmptyNote>

          </SectionCard>

        </div>

        {/* ================= RIGHT — 35% ================= */}

        <div className="space-y-6">

          {/* CREDIT HEALTH */}

          <SectionCard
            eyebrow="Credit health"
            title="Your credit"
            action={
              <button
                type="button"
                onClick={() => navigate("/credit-health")}
                className="text-sm text-teal-400 hover:text-teal-300"
              >
                View
              </button>
            }
          >
            <div className="mt-8 flex items-center justify-center">
              <CreditGauge value={creditHealthScore} />
            </div>

            <p className="mt-7 text-center text-sm leading-6 text-slate-500">
              Add your financial status to see your score and what's affecting it.
            </p>

            {/* FOOTNOTE */}
            <p className="mt-4 text-center text-[11.2px] leading-relaxed text-slate-600">
              * This credit health score is calculated based on your internal financial status and is not an official score from credit bureaus.
            </p>
          </SectionCard>

          {/* REPORTS */}

          <SectionCard
            eyebrow="Reports"
            title="Financial reports"
          >
            <div className="mt-7 rounded-xl border border-[#293533] bg-[#1B2422] p-5">
              <p className="text-sm leading-6 text-slate-500">
                Review your income, expenses, savings, loans, and financial
                trends through GRAPHICAL detailed reports.
              </p>

              <button
                type="button"
                onClick={() => navigate("/reports")}
                className="mt-5 flex items-center gap-1 text-sm font-medium text-teal-400 transition-colors hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
              >
                View reports

                <ArrowRight
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </SectionCard>

          {/* WHAT SHOULD I FOCUS NOW? */}

          <SectionCard
            eyebrow="Next step"
            title="What should I focus on?"
          >
            <div className="mt-7 rounded-xl border border-[#293533] bg-[#1B2422] p-5">
              <p className="text-base font-medium text-slate-200">
                {creditRecommendation.title}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {creditRecommendation.description}
              </p>

              <button
                type="button"
                onClick={() => navigate("/credit-health")}
                className="mt-5 flex items-center gap-1 text-sm font-medium text-teal-400 transition-colors hover:text-teal-300"
              >
                View your credit health

                <ArrowRight
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </SectionCard>

          {/* RECENT ACTIVITY */}

          <SectionCard
            eyebrow="Activity"
            title="Recent activity"
          >
            {recentActivity.length > 0 ? (
              <div className="mt-7 space-y-4">

                {recentActivity.map((item, index) => (
                  <div
                    key={item.id}
                    className={
                      index < recentActivity.length - 1
                        ? "border-b border-[#293533] pb-4"
                        : ""
                    }
                  >
                    <p className="text-sm text-slate-300">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {item.description}
                    </p>
                  </div>
                ))}

              </div>
            ) : (
              <EmptyNote icon={Activity}>
                Nothing to show yet — income, expenses, goals, and loans will
                appear here as they happen.
              </EmptyNote>
            )}
          </SectionCard>

        </div>
      </section>
    </>
  );
};

export default Dashboard;
