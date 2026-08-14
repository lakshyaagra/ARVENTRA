import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    Landmark,
    ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    fetchSummaryReport,
    fetchMonthlyIncomeReport,
    fetchMonthlyExpenseReport,
    fetchIncomeCategoryReport,
    fetchExpenseCategoryReport,
    fetchGoalStatusReport,
    fetchLoanStatusReport,
} from "../features/reports/reportSlice";

import IncomeExpenseChart from "../components/reportCharts/IncomeExpenseChart";
import IncomeCategoryChart from "../components/reportCharts/IncomeCategoryChart";
import ExpenseCategoryChart from "../components/reportCharts/ExpenseCategoryChart";
import GoalStatusChart from "../components/reportCharts/GoalStatusChart";
import LoanStatusChart from "../components/reportCharts/LoanStatusChart";

/* =====================================================================
   PRIMITIVES
===================================================================== */

const Eyebrow = ({ children }) => (
    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        {children}
    </p>
);

const SectionCard = ({
    eyebrow,
    title,
    action,
    children,
}) => (
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

const currency = (value = 0) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

const SummaryKpiCard = ({
    icon: Icon,
    label,
    value,
    hint,
    accent = false,
}) => (
    <div className="group rounded-xl border border-[#24302D] bg-[#121817] p-5 transition-colors hover:border-teal-700/40">
        <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
                {label}
            </p>

            <Icon
                className="h-4 w-4 text-slate-600 transition-colors group-hover:text-teal-500"
                aria-hidden="true"
            />
        </div>
        <p
            className={`mt-3 text-2xl font-semibold ${
                accent
                    ? "text-teal-400"
                    : "text-slate-100"
            }`}
        >
            {value}
        </p>
        <p className="mt-2 text-xs text-slate-600">
            {hint}
        </p>
    </div>
);

const LoadingState = ({ message }) => (
    <div className="mt-7 flex min-h-40 items-center justify-center rounded-xl border border-dashed border-[#293533]">
        <p className="text-sm text-slate-500">
            {message}
        </p>
    </div>
);
const ErrorState = ({ message }) => (
    <div className="mt-7 flex min-h-40 items-center justify-center rounded-xl border border-dashed border-[#293533]">
        <p className="text-sm text-red-400">
            {message}
        </p>
    </div>
);
const EmptyState = ({ message }) => (
    <div className="mt-7 flex min-h-40 items-center justify-center rounded-xl border border-dashed border-[#293533]">
        <p className="text-sm text-slate-600">
            {message}
        </p>
    </div>
);

/* =====================================================================
   PAGE
===================================================================== */

const Reports = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* ===================================================================
       REDUX STATE
    =================================================================== */

    const {
        summary,

        monthlyIncome,
        monthlyExpense,

        incomeCategory,
        expenseCategory,

        goalStatus,
        loanStatus,

        summaryLoading,

        monthlyIncomeLoading,
        monthlyExpenseLoading,

        incomeCategoryLoading,
        expenseCategoryLoading,

        goalStatusLoading,
        loanStatusLoading,

        summaryError,

        monthlyIncomeError,
        monthlyExpenseError,

        incomeCategoryError,
        expenseCategoryError,

        goalStatusError,
        loanStatusError,
    } = useSelector((state) => state.report);

    /* ===================================================================
       FETCH REPORTS
    =================================================================== */

    useEffect(() => {
        dispatch(fetchSummaryReport());
        dispatch(fetchMonthlyIncomeReport());
        dispatch(fetchMonthlyExpenseReport());
        dispatch(fetchIncomeCategoryReport());
        dispatch(fetchExpenseCategoryReport());
        dispatch(fetchGoalStatusReport());
        dispatch(fetchLoanStatusReport());
    }, [dispatch]);

    /* ===================================================================
       DERIVED STATES
    =================================================================== */

    const cashFlowLoading = monthlyIncomeLoading || monthlyExpenseLoading;

    const cashFlowError = monthlyIncomeError || monthlyExpenseError;

    /* ===================================================================
       RENDER
    =================================================================== */

    return (
        <div>
            {/* =========================================================
                HEADER
            ========================================================= */}
            <header className="mb-8">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    aria-label="Back to dashboard"
                    className="mb-6 inline-flex items-center gap-2 rounded-md text-sm text-slate-500 transition-colors hover:text-teal-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
                >
                    <ArrowLeft
                        className="h-4 w-4"
                        aria-hidden="true"
                    />

                    Back to dashboard
                </button>
                <Eyebrow>Reports</Eyebrow>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
                    Financial reports
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                    Understand your income, spending, savings, debt, and
                    overall financial position through visual reports.
                </p>
            </header>

            {/* =========================================================
                REPORT CONTENT
            ========================================================= */}

            <div className="space-y-6 mt-7">

                {/* =====================================================
                    FINANCIAL SNAPSHOT
                ===================================================== */}
                <SectionCard
                    eyebrow="Financial snapshot"
                    title="Your current position"
                    action={
                        <span className="text-xs text-slate-500">
                            All time
                        </span>
                    }
                >
                    {summaryLoading && (
                        <LoadingState
                            message="Loading financial summary..."
                        />
                    )}
                    {summaryError && !summaryLoading && (
                        <ErrorState
                            message={summaryError}
                        />
                    )}
                    {!summaryLoading &&
                        !summaryError &&
                        !summary && (
                            <EmptyState
                                message="No financial summary available yet."
                            />
                        )}
                    {!summaryLoading &&
                        !summaryError &&
                        summary && (
                            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <SummaryKpiCard
                                    icon={Wallet}
                                    label="Net worth"
                                    value={currency(summary.netWorth)}
                                    hint="Assets minus outstanding loans"
                                    accent
                                />
                                <SummaryKpiCard
                                    icon={Landmark}
                                    label="Total assets"
                                    value={currency(summary.totalAssets)}
                                    hint="Current value of your assets"
                                />
                                <SummaryKpiCard
                                    icon={TrendingUp}
                                    label="Total income"
                                    value={currency(summary.totalIncome)}
                                    hint="Total recorded income"
                                />
                                <SummaryKpiCard
                                    icon={TrendingDown}
                                    label="Total expenses"
                                    value={currency(summary.totalExpense)}
                                    hint="Total recorded expenses"
                                />
                                <SummaryKpiCard
                                    icon={PiggyBank}
                                    label="Savings"
                                    value={currency(summary.savings)}
                                    hint="Income minus expenses"
                                    accent
                                />
                                <SummaryKpiCard
                                    icon={Landmark}
                                    label="Outstanding loans"
                                    value={currency(
                                        summary.totalOutstandingLoans
                                    )}
                                    hint="Current outstanding debt"
                                />
                            </div>
                        )}
                </SectionCard>

                {/* =====================================================
                    CASH FLOW
                ===================================================== */}

                <SectionCard
                    eyebrow="Cash flow"
                    title="Income vs expense"
                    action={
                        <span className="text-xs text-slate-500">
                            Monthly
                        </span>
                    }
                >
                    {cashFlowLoading && (
                        <LoadingState
                            message="Loading income and expense data..."
                        />
                    )}

                    {cashFlowError && !cashFlowLoading && (
                        <ErrorState
                            message={cashFlowError}
                        />
                    )}

                    {!cashFlowLoading && !cashFlowError && (
                        <div className="mt-7">
                            <IncomeExpenseChart
                                incomeReport={monthlyIncome}
                                expenseReport={monthlyExpense}
                            />
                        </div>
                    )}
                </SectionCard>

                {/* =====================================================
                    CATEGORY REPORTS
                ===================================================== */}

                <div className="grid gap-6 lg:grid-cols-2">

                    {/* INCOME */}
                    <SectionCard
                        eyebrow="Income"
                        title="Income by category"
                        action={
                            <span className="text-xs text-slate-500">
                                All time
                            </span>
                        }
                    >
                        {incomeCategoryLoading && (
                            <LoadingState
                                message="Loading income category data..."
                            />
                        )}
                        {incomeCategoryError &&
                            !incomeCategoryLoading && (
                                <ErrorState
                                    message={incomeCategoryError}
                                />
                            )}
                        {!incomeCategoryLoading &&
                            !incomeCategoryError && (
                                <div className="mt-7">
                                    <IncomeCategoryChart
                                        incomeCategory={incomeCategory}
                                    />
                                </div>
                            )}
                    </SectionCard>

                    {/* EXPENSE */}
                    <SectionCard
                        eyebrow="Expenses"
                        title="Expenses by category"
                        action={
                            <span className="text-xs text-slate-500">
                                All time
                            </span>
                        }
                    >
                        {expenseCategoryLoading && (
                            <LoadingState
                                message="Loading expense category data..."
                            />
                        )}

                        {expenseCategoryError &&
                            !expenseCategoryLoading && (
                                <ErrorState
                                    message={expenseCategoryError}
                                />
                            )}

                        {!expenseCategoryLoading &&
                            !expenseCategoryError && (
                                <div className="mt-7">
                                    <ExpenseCategoryChart
                                        expenseCategory={expenseCategory}
                                    />
                                </div>
                            )}
                    </SectionCard>
                </div>

                {/* =====================================================
                    GOALS & LOANS
                ===================================================== */}

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* GOALS */}
                    <SectionCard
                        eyebrow="Goals"
                        title="Goals by status"
                        action={
                            <span className="text-xs text-slate-500">
                                All goals
                            </span>
                        }
                    >
                        {goalStatusLoading && (
                            <LoadingState
                                message="Loading goal status data..."
                            />
                        )}
                        {goalStatusError &&
                            !goalStatusLoading && (
                                <ErrorState
                                    message={goalStatusError}
                                />
                            )}
                        {!goalStatusLoading &&
                            !goalStatusError && (
                                <div className="mt-7">
                                    <GoalStatusChart
                                        goalStatus={goalStatus}
                                    />
                                </div>
                            )}
                    </SectionCard>

                    {/* LOANS */}
                    <SectionCard
                        eyebrow="Loans"
                        title="Loans by status"
                        action={
                            <span className="text-xs text-slate-500">
                                All loans
                            </span>
                        }
                    >
                        {loanStatusLoading && (
                            <LoadingState
                                message="Loading loan status data..."
                            />
                        )}
                        {loanStatusError &&
                            !loanStatusLoading && (
                                <ErrorState
                                    message={loanStatusError}
                                />
                            )}
                        {!loanStatusLoading &&
                            !loanStatusError && (
                                <div className="mt-7">
                                    <LoanStatusChart
                                        loanStatus={loanStatus}
                                    />
                                </div>
                            )}
                    </SectionCard>
                </div>
            </div>
        </div>
    );
};
export default Reports;