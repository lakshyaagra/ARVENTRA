import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Plus,
    Search,
    Landmark,
    Banknote,
    Home,
    GraduationCap,
    Car,
    Coins,
    User,
    BriefcaseBusiness,
    CreditCard,
    Users,
    Wallet,
    CalendarDays,
    Pencil,
    Trash2,
    Eye,
    X,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    TrendingDown,
    CircleDollarSign,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
    fetchLoans,
    fetchLoanById,
    createLoan,
    updateLoan,
    deleteLoan,
    clearLoans,
    clearLoan,
    clearLoanError,
} from "../features/loans/loanSlice";

/* ============================================================
HELPERS
============================================================ */

const currency = (value = 0) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatLoanType = (type = "other") =>
    type
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

const formatMonths = (months = 0) => {
    const value = Number(months || 0);

    if (!value) return "—";

    const years = Math.floor(value / 12);
    const remainingMonths = value % 12;

    if (years && remainingMonths) {
        return `${years}y ${remainingMonths}m`;
    }

    if (years) {
        return `${years} year${years === 1 ? "" : "s"}`;
    }

    return `${value} month${value === 1 ? "" : "s"}`;
};

const getRepaymentPercentage = (principal, outstanding) => {
    const principalValue = Number(principal || 0);
    const outstandingValue = Number(outstanding || 0);

    if (principalValue <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(0, ((principalValue - outstandingValue) / principalValue) * 100),
    );
};

const getRemainingPercentage = (principal, outstanding) => {
    const principalValue = Number(principal || 0);

    if (principalValue <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(0, (Number(outstanding || 0) / principalValue) * 100),
    );
};

/* ============================================================
LOAN TYPE CONFIG
============================================================ */

const loanTypeConfig = {
    home: {
        label: "Home",
        icon: Home,
        style: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    },

    education: {
        label: "Education",
        icon: GraduationCap,
        style: "border-violet-500/20 bg-violet-500/10 text-violet-400",
    },

    vehicle: {
        label: "Vehicle",
        icon: Car,
        style: "border-orange-500/20 bg-orange-500/10 text-orange-400",
    },

    gold: {
        label: "Gold",
        icon: Coins,
        style: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    },

    personal: {
        label: "Personal",
        icon: User,
        style: "border-teal-500/20 bg-teal-500/10 text-teal-400",
    },

    business: {
        label: "Business",
        icon: BriefcaseBusiness,
        style: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    },

    "credit-card": {
        label: "Credit Card",
        icon: CreditCard,
        style: "border-pink-500/20 bg-pink-500/10 text-pink-400",
    },

    friend: {
        label: "Friend",
        icon: Users,
        style: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    },

    relative: {
        label: "Relative",
        icon: Users,
        style: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
    },

    other: {
        label: "Other",
        icon: Wallet,
        style: "border-slate-600/50 bg-slate-800/40 text-slate-400",
    },
};

const loanTypes = Object.keys(loanTypeConfig);

/* ============================================================
LOAN TYPE BADGE
============================================================ */

const LoanTypeBadge = ({ loanType }) => {
    const config = loanTypeConfig[loanType] || loanTypeConfig.other;

    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${config.style}`}
        >
            {" "}
            <Icon className="h-3 w-3" />
            {config.label}
        </span>
    );
};

/* ============================================================
STATUS BADGE
============================================================ */

const StatusBadge = ({ status }) => {
    const active = status === "active";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${active
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-600/50 bg-slate-800/40 text-slate-400"
                }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-slate-500"
                    }`}
            />

            {active ? "Active" : "Closed"}
        </span>
    );
};

/* ============================================================
MODAL
============================================================ */

const Modal = ({ children, onClose, maxWidth = "max-w-2xl" }) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                style={{ scrollbarWidth: "none" }}
                className={`relative max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-2xl border border-[#293533] bg-[#171F1E] p-6 shadow-2xl [&::-webkit-scrollbar]:hidden`}
                onMouseDown={(event) => event.stopPropagation()}
            >
                {children}{" "}
            </div>{" "}
        </div>
    );
};

/* ============================================================
LOAN FORM
============================================================ */

const emptyForm = {
    loanName: "",
    lender: "",
    principalAmount: "",
    outstandingAmount: "",
    interestRate: "",
    loanTerm: "",
    loanType: "other",
    emiAmount: "",
    nextDueDate: "",
    status: "active",
    notes: "",
};

const LoanFormModal = ({
    editingLoan,
    formData,
    setFormData,
    onClose,
    onSubmit,
    saving,
    error,
}) => {
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    return (
        <Modal onClose={onClose}>
            {" "}
            <div className="flex items-start justify-between">
                {" "}
                <div>
                    {" "}
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {editingLoan ? "Edit loan" : "New loan"}{" "}
                    </p>
                    <h2 className="mt-2 text-xl font-medium text-slate-100">
                        {editingLoan ? "Update loan" : "Add a loan"}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        {editingLoan
                            ? "Update the information for this loan."
                            : "Record a loan or outstanding debt."}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-[#1B2422] hover:text-slate-200"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
            <form onSubmit={onSubmit} className="mt-7 grid gap-5 sm:grid-cols-2">
                {/* LOAN NAME */}

                <div className="sm:col-span-2">
                    <label className="text-sm text-slate-400">Loan name</label>

                    <input
                        type="text"
                        name="loanName"
                        value={formData.loanName}
                        onChange={handleChange}
                        placeholder="e.g. HDFC Home Loan"
                        required
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
                    />
                </div>

                {/* LENDER */}

                <div>
                    <label className="text-sm text-slate-400">Lender</label>

                    <input
                        type="text"
                        name="lender"
                        value={formData.lender}
                        onChange={handleChange}
                        placeholder="e.g. HDFC Bank"
                        required
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
                    />
                </div>

                {/* LOAN TYPE */}

                <div>
                    <label className="text-sm text-slate-400">Loan type</label>

                    <select
                        name="loanType"
                        value={formData.loanType}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm capitalize text-slate-300 outline-none focus:border-teal-700"
                    >
                        {loanTypes.map((type) => (
                            <option key={type} value={type}>
                                {formatLoanType(type)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* PRINCIPAL */}

                <div>
                    <label className="text-sm text-slate-400">Principal amount</label>

                    <input
                        type="number"
                        name="principalAmount"
                        value={formData.principalAmount}
                        onChange={handleChange}
                        min="1"
                        step="0.01"
                        placeholder="Original loan amount"
                        required
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
                    />
                </div>

                {/* OUTSTANDING */}

                <div>
                    <label className="text-sm text-slate-400">Outstanding amount</label>

                    <input
                        type="number"
                        name="outstandingAmount"
                        value={formData.outstandingAmount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="Remaining amount"
                        required
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
                    />
                </div>

                {/* INTEREST */}

                <div>
                    <label className="text-sm text-slate-400">Interest rate (%)</label>

                    <input
                        type="number"
                        name="interestRate"
                        value={formData.interestRate}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="e.g. 8.5"
                        required
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
                    />
                </div>

                {/* TERM */}

                <div>
                    <label className="text-sm text-slate-400">Loan term (months)</label>

                    <input
                        type="number"
                        name="loanTerm"
                        value={formData.loanTerm}
                        onChange={handleChange}
                        min="1"
                        step="1"
                        placeholder="e.g. 240"
                        required
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
                    />
                </div>

                {/* EMI */}

                <div>
                    <label className="text-sm text-slate-400">EMI amount</label>

                    <input
                        type="number"
                        name="emiAmount"
                        value={formData.emiAmount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="Optional"
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
                    />
                </div>

                {/* NEXT DUE */}

                <div>
                    <label className="text-sm text-slate-400">Next due date</label>

                    <input
                        type="date"
                        name="nextDueDate"
                        value={formData.nextDueDate}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
                    />
                </div>

                {/* STATUS */}

                <div>
                    <label className="text-sm text-slate-400">Status</label>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-teal-700"
                    >
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                {/* NOTES */}

                <div className="sm:col-span-2">
                    <label className="text-sm text-slate-400">Notes</label>

                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Optional notes about this loan"
                        className="mt-2 w-full resize-none rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
                    />
                </div>

                {/* ERROR */}

                {error && (
                    <div className="sm:col-span-2 rounded-lg border border-red-900/40 bg-red-950/20 px-4 py-3">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                {/* ACTIONS */}

                <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-[#293533] px-4 py-2.5 text-sm text-slate-400 transition-colors hover:bg-[#1B2422] hover:text-slate-200"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-medium text-slate-950 transition-colors hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? "Saving..." : editingLoan ? "Update loan" : "Save loan"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

/* ============================================================
DETAIL ITEM
============================================================ */

const DetailItem = ({ icon: Icon, label, value }) => {
    return (
        <div className="rounded-xl border border-[#293533] bg-[#1B2422] p-4">
            {" "}
            <div className="flex items-center gap-2">
                {" "}
                <Icon className="h-4 w-4 text-slate-500" />
                <p className="text-xs text-slate-500">{label}</p>
            </div>
            <p className="mt-2 text-sm text-slate-200">{value || "—"}</p>
        </div>
    );
};

/* ============================================================
LOAN DETAILS MODAL
============================================================ */

const LoanDetailsModal = ({ loan, loading, onClose, onEdit }) => {
    if (!loan && !loading) {
        return null;
    }

    const repaymentPercentage = loan
        ? getRepaymentPercentage(loan.principalAmount, loan.outstandingAmount)
        : 0;

    return (
        <Modal onClose={onClose} maxWidth="max-w-xl">
            {" "}
            <div className="flex items-start justify-between">
                {" "}
                <div>
                    {" "}
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Loan details{" "}
                    </p>
                    <h2 className="mt-2 text-xl font-medium text-slate-100">
                        {loan?.loanName || "Loan"}
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-slate-500 hover:bg-[#1B2422] hover:text-slate-200"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <p className="text-sm text-slate-500">Loading loan details...</p>
                </div>
            ) : loan ? (
                <div className="mt-7 space-y-4">
                    {/* OUTSTANDING HERO */}

                    <div className="rounded-2xl border border-[#293533] bg-[#1B2422] p-5">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs text-slate-500">Outstanding amount</p>

                                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
                                    {currency(loan.outstandingAmount)}
                                </p>
                            </div>

                            <div className="rounded-xl bg-red-500/10 p-3">
                                <TrendingDown className="h-6 w-6 text-red-400" />
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className="mb-2 flex items-center justify-between text-xs">
                                <span className="text-slate-500">Repaid</span>

                                <span className="text-slate-400">
                                    {repaymentPercentage.toFixed(1)}%
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-[#293533]">
                                <div
                                    className="h-full rounded-full bg-teal-500 transition-all"
                                    style={{
                                        width: `${repaymentPercentage}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* TYPE + STATUS */}

                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#293533] bg-[#1B2422] p-4">
                        <LoanTypeBadge loanType={loan.loanType} />

                        <StatusBadge status={loan.status} />
                    </div>

                    {/* VALUES */}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <DetailItem
                            icon={CircleDollarSign}
                            label="Principal"
                            value={currency(loan.principalAmount)}
                        />

                        <DetailItem
                            icon={Banknote}
                            label="Outstanding"
                            value={currency(loan.outstandingAmount)}
                        />

                        <DetailItem icon={Landmark} label="Lender" value={loan.lender} />

                        <DetailItem
                            icon={TrendingDown}
                            label="Interest rate"
                            value={`${Number(loan.interestRate || 0)}%`}
                        />

                        <DetailItem
                            icon={CalendarDays}
                            label="Loan term"
                            value={formatMonths(loan.loanTerm)}
                        />

                        <DetailItem
                            icon={Banknote}
                            label="Monthly EMI"
                            value={
                                loan.emiAmount !== undefined && loan.emiAmount !== null
                                    ? currency(loan.emiAmount)
                                    : "—"
                            }
                        />

                        <DetailItem
                            icon={CalendarDays}
                            label="Next due date"
                            value={formatDate(loan.nextDueDate)}
                        />

                        <DetailItem
                            icon={Wallet}
                            label="Repaid amount"
                            value={currency(
                                Number(loan.principalAmount || 0) -
                                Number(loan.outstandingAmount || 0),
                            )}
                        />
                    </div>

                    {/* NOTES */}

                    <div className="rounded-xl border border-[#293533] bg-[#1B2422] p-4">
                        <p className="text-xs text-slate-500">Notes</p>

                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            {loan.notes || "No notes added."}
                        </p>
                    </div>

                    {/* ACTION */}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => onEdit(loan)}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#293533] px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-[#1B2422]"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </button>
                    </div>
                </div>
            ) : null}
        </Modal>
    );
};

/* ============================================================
DELETE MODAL
============================================================ */

const DeleteModal = ({ loan, onClose, onConfirm, deleting }) => {
    if (!loan) {
        return null;
    }

    return (
        <Modal onClose={onClose} maxWidth="max-w-md">
            {" "}
            <div className="text-center">
                {" "}
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                    {" "}
                    <Trash2 className="h-5 w-5 text-red-400" />{" "}
                </div>
                <h2 className="mt-5 text-lg font-medium text-slate-100">
                    Delete loan?
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Are you sure you want to delete{" "}
                    <span className="text-slate-300">"{loan.loanName}"</span>? This action
                    cannot be undone.
                </p>
                <div className="mt-7 flex justify-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-[#293533] px-4 py-2.5 text-sm text-slate-400 hover:bg-[#1B2422]"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={deleting}
                        className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-400 disabled:opacity-50"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

/* ============================================================
LOAN CARD
============================================================ */

const LoanCard = ({ loan, onEdit, onDelete, onView }) => {
    const repaymentPercentage = getRepaymentPercentage(
        loan.principalAmount,
        loan.outstandingAmount,
    );

    return (
        <article className="group rounded-2xl border border-[#293533] bg-[#171F1E] p-5 transition-all duration-200 hover:border-[#3A4946] hover:bg-[#192321]">
            {/* HEADER */}

            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-base font-medium text-slate-100">
                            {loan.loanName}
                        </h2>

                        <LoanTypeBadge loanType={loan.loanType} />
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                        {loan.lender || "No lender specified"}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => onView(loan)}
                    className="rounded-lg p-2 text-slate-500 opacity-0 transition-all hover:bg-[#1B2422] hover:text-slate-200 group-hover:opacity-100"
                    title="View details"
                >
                    <Eye className="h-4 w-4" />
                </button>
            </div>

            {/* STATUS */}

            <div className="mt-4">
                <StatusBadge status={loan.status} />
            </div>

            {/* OUTSTANDING */}

            <div className="mt-6">
                <p className="text-xs text-slate-500">Outstanding amount</p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">
                    {currency(loan.outstandingAmount)}
                </p>
            </div>

            {/* PRINCIPAL + EMI */}

            <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#293533] bg-[#141B1A] p-3">
                    <p className="text-[11px] text-slate-600">Principal</p>

                    <p className="mt-1 text-sm text-slate-300">
                        {currency(loan.principalAmount)}
                    </p>
                </div>

                <div className="rounded-xl border border-[#293533] bg-[#141B1A] p-3">
                    <p className="text-[11px] text-slate-600">Monthly EMI</p>

                    <p className="mt-1 text-sm text-slate-300">
                        {loan.emiAmount !== undefined && loan.emiAmount !== null
                            ? currency(loan.emiAmount)
                            : "—"}
                    </p>
                </div>
            </div>

            {/* REPAYMENT */}

            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Repaid</p>

                    <p className="text-xs text-slate-500">
                        {repaymentPercentage.toFixed(1)}%
                    </p>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#293533]">
                    <div
                        className="h-full rounded-full bg-teal-500 transition-all"
                        style={{
                            width: `${repaymentPercentage}%`,
                        }}
                    />
                </div>
            </div>

            {/* DUE DATE */}

            <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CalendarDays className="h-4 w-4" />

                    <span>Next due: {formatDate(loan.nextDueDate)}</span>
                </div>

                <span className="text-xs text-slate-600">
                    {Number(loan.interestRate || 0)}%
                </span>
            </div>

            {/* ACTIONS */}

            <div className="mt-5 flex items-center justify-end gap-1">
                <button
                    type="button"
                    onClick={() => onView(loan)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-[#1B2422] hover:text-slate-200"
                >
                    <Eye className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => onEdit(loan)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-[#1B2422] hover:text-slate-200"
                >
                    <Pencil className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(loan)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </article>
    );
};

/* ============================================================
EMPTY STATE
============================================================ */

const EmptyState = ({ filtered, onAdd }) => {
    return (
        <div className="rounded-2xl border border-dashed border-[#293533] bg-[#171F1E] px-6 py-16 text-center">
            {" "}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10">
                {" "}
                <Landmark className="h-5 w-5 text-teal-400" />{" "}
            </div>
            <h3 className="mt-5 text-lg font-medium text-slate-100">
                {filtered ? "No loans match your filters" : "No loans recorded"}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {filtered
                    ? "Try changing the search, type, or status filter."
                    : "Start by adding your first loan so Project Udaan can track your outstanding debt."}
            </p>
            {!filtered && (
                <button
                    type="button"
                    onClick={onAdd}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-teal-400 hover:text-teal-300"
                >
                    <Plus className="h-4 w-4" />
                    Add your first loan
                </button>
            )}
        </div>
    );
};

/* ============================================================
LOAN SUMMARY
============================================================ */

const LoanSummary = ({ loans }) => {
    const totalPrincipal = loans.reduce(
        (sum, loan) => sum + Number(loan.principalAmount || 0),
        0,
    );

    const totalOutstanding = loans.reduce(
        (sum, loan) => sum + Number(loan.outstandingAmount || 0),
        0,
    );

    const totalEmi = loans.reduce(
        (sum, loan) => sum + Number(loan.emiAmount || 0),
        0,
    );

    const activeLoans = loans.filter((loan) => loan.status === "active").length;

    const repayment =
        totalPrincipal > 0
            ? ((totalPrincipal - totalOutstanding) / totalPrincipal) * 100
            : 0;

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* OUTSTANDING */}

            <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-5">
                <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                        Outstanding debt
                    </p>

                    <div className="rounded-lg bg-red-500/10 p-2">
                        <TrendingDown className="h-4 w-4 text-red-400" />
                    </div>
                </div>

                <p className="mt-4 text-2xl font-semibold text-slate-100">
                    {currency(totalOutstanding)}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                    Current outstanding balance
                </p>
            </div>

            {/* PRINCIPAL */}

            <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-5">
                <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                        Total principal
                    </p>

                    <div className="rounded-lg bg-blue-500/10 p-2">
                        <CircleDollarSign className="h-4 w-4 text-blue-400" />
                    </div>
                </div>

                <p className="mt-4 text-2xl font-semibold text-slate-100">
                    {currency(totalPrincipal)}
                </p>

                <p className="mt-1 text-xs text-slate-500">Original borrowed amount</p>
            </div>

            {/* EMI */}

            <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-5">
                <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                        Monthly EMI
                    </p>

                    <div className="rounded-lg bg-teal-500/10 p-2">
                        <Banknote className="h-4 w-4 text-teal-400" />
                    </div>
                </div>

                <p className="mt-4 text-2xl font-semibold text-slate-100">
                    {currency(totalEmi)}
                </p>

                <p className="mt-1 text-xs text-slate-500">Combined recorded EMI</p>
            </div>

            {/* ACTIVE */}

            <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-5">
                <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                        Active loans
                    </p>

                    <div className="rounded-lg bg-violet-500/10 p-2">
                        <SlidersHorizontal className="h-4 w-4 text-violet-400" />
                    </div>
                </div>

                <p className="mt-4 text-2xl font-semibold text-slate-100">
                    {activeLoans}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                    {repayment.toFixed(1)}% of principal repaid
                </p>
            </div>
        </div>
    );
};

/* ============================================================
LOAN TYPE BREAKDOWN
============================================================ */

const LoanBreakdown = ({ loans }) => {
    const grouped = useMemo(() => {
        const map = {};

        loans.forEach((loan) => {
            const type = loan.loanType || "other";

            map[type] = (map[type] || 0) + Number(loan.outstandingAmount || 0);
        });

        return Object.entries(map)
            .map(([loanType, value]) => ({
                loanType,
                value,
            }))
            .sort((a, b) => b.value - a.value);
    }, [loans]);

    const total = grouped.reduce((sum, item) => sum + item.value, 0);

    if (!loans.length) {
        return null;
    }

    return (
        <section className="rounded-2xl border border-[#293533] bg-[#171F1E] p-6">
            {" "}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                {" "}
                <div>
                    {" "}
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-600">
                        Debt composition{" "}
                    </p>
                    <h2 className="mt-2 text-lg font-medium text-slate-100">
                        Where your outstanding debt comes from
                    </h2>
                </div>
                <p className="text-xs text-slate-500">Based on outstanding amounts</p>
            </div>
            {/* BAR */}
            <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-[#24302D]">
                {grouped.map((item, index) => {
                    const percentage = total > 0 ? (item.value / total) * 100 : 0;

                    return (
                        <div
                            key={item.loanType}
                            className="h-full bg-red-400 transition-all"
                            style={{
                                width: `${percentage}%`,
                                opacity: Math.max(0.3, 1 - index * 0.12),
                            }}
                            title={`${formatLoanType(
                                item.loanType,
                            )} ${percentage.toFixed(1)}%`}
                        />
                    );
                })}
            </div>
            {/* LEGEND */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {grouped.slice(0, 6).map((item) => {
                    const percentage = total > 0 ? (item.value / total) * 100 : 0;

                    return (
                        <div
                            key={item.loanType}
                            className="flex items-center justify-between rounded-xl border border-[#293533] bg-[#141B1A] px-4 py-3"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />

                                <span className="text-xs text-slate-400">
                                    {formatLoanType(item.loanType)}
                                </span>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-slate-200">{currency(item.value)}</p>

                                <p className="text-[11px] text-slate-600">
                                    {percentage.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

/* ============================================================
PAGE
============================================================ */

const Loan = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        loans,
        loan,
        loading,
        loanLoading,
        creating,
        updating,
        deleting,
        error,
        loanError,
        pagination,
    } = useSelector((state) => state.loan);

    /* ========================================================
  LOCAL STATE
  ======================================================== */

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [loanType, setLoanType] = useState("");
    const [status, setStatus] = useState("");
    const [sort, setSort] = useState("createdAt");
    const [order, setOrder] = useState("desc");
    const [showForm, setShowForm] = useState(false);
    const [editingLoan, setEditingLoan] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    /* ========================================================
  LOAD LOANS
  ======================================================== */

    const loadLoans = (overrides = {}) => {
        dispatch(
            fetchLoans({
                page: pagination?.currPage || 1,
                limit: 15,
                sort,
                order,
                loanType,
                status,
                search,
                ...overrides,
            }),
        );
    };

    useEffect(() => {
        loadLoans({
            page: 1,
        });

        return () => {
            dispatch(clearLoans());
        };
    }, []);

    /* ========================================================
  SEARCH
  ======================================================== */

    const submitSearch = (event) => {
        event.preventDefault();

        const value = searchInput.trim();

        setSearch(value);

        dispatch(
            fetchLoans({
                page: 1,
                limit: 15,
                sort,
                order,
                loanType,
                status,
                search: value,
            }),
        );
    };

    /* ========================================================
  LOAN TYPE FILTER
  ======================================================== */

    const handleLoanTypeChange = (event) => {
        const value = event.target.value;

        setLoanType(value);

        dispatch(
            fetchLoans({
                page: 1,
                limit: 15,
                sort,
                order,
                loanType: value,
                status,
                search,
            }),
        );
    };

    /* ========================================================
  STATUS FILTER
  ======================================================== */

    const handleStatusChange = (event) => {
        const value = event.target.value;

        setStatus(value);

        dispatch(
            fetchLoans({
                page: 1,
                limit: 15,
                sort,
                order,
                loanType,
                status: value,
                search,
            }),
        );
    };

    /* ========================================================
  SORT
  ======================================================== */

    const handleSortChange = (event) => {
        const value = event.target.value;

        setSort(value);

        dispatch(
            fetchLoans({
                page: 1,
                limit: 15,
                sort: value,
                order,
                loanType,
                status,
                search,
            }),
        );
    };

    /* ========================================================
  ORDER
  ======================================================== */

    const handleOrderChange = (event) => {
        const value = event.target.value;

        setOrder(value);

        dispatch(
            fetchLoans({
                page: 1,
                limit: 15,
                sort,
                order: value,
                loanType,
                status,
                search,
            }),
        );
    };

    /* ========================================================
  CREATE
  ======================================================== */

    const openAddModal = () => {
        dispatch(clearLoanError());

        setEditingLoan(null);

        setFormData({
            ...emptyForm,
        });

        setShowForm(true);
    };

    /* ========================================================
  EDIT
  ======================================================== */

    const openEditModal = (selectedLoan) => {
        dispatch(clearLoanError());

        setEditingLoan(selectedLoan);

        setFormData({
            loanName: selectedLoan.loanName || "",

            lender: selectedLoan.lender || "",

            principalAmount: selectedLoan.principalAmount ?? "",

            outstandingAmount: selectedLoan.outstandingAmount ?? "",

            interestRate: selectedLoan.interestRate ?? "",

            loanTerm: selectedLoan.loanTerm ?? "",

            loanType: selectedLoan.loanType || "other",

            emiAmount: selectedLoan.emiAmount ?? "",

            nextDueDate: selectedLoan.nextDueDate
                ? new Date(selectedLoan.nextDueDate).toISOString().split("T")[0]
                : "",

            status: selectedLoan.status || "active",

            notes: selectedLoan.notes || "",
        });

        setShowDetails(false);
        setShowForm(true);
    };

    /* ========================================================
  SUBMIT
  ======================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (editingLoan) {
                await dispatch(
                    updateLoan({
                        id: editingLoan._id,
                        loanData: formData,
                    }),
                ).unwrap();

                toast.success("Loan updated.");
            } else {
                await dispatch(createLoan(formData)).unwrap();
                toast.success("Loan added successfully.");
            }

            setShowForm(false);
            setEditingLoan(null);
            setFormData(emptyForm);

            loadLoans();
        } catch (error) {
            toast.error(
                typeof error === "string"
                    ? error
                    : "Something went wrong. Please try again."
            );
        }
    };

    /* ========================================================
  DETAILS
  ======================================================== */

    const openDetails = async (selectedLoan) => {
        setShowDetails(true);

        try {
            await dispatch(fetchLoanById(selectedLoan._id)).unwrap();
        } catch (error) {
            setShowDetails(false);
            dispatch(clearLoan());
            toast.error(
                typeof error === "string"
                    ? error
                    : "Failed to load loan details."
            );
        }
    };

    /* ========================================================
  DELETE
  ======================================================== */

    const confirmDelete = async () => {
        if (!deleteTarget) {
            return;
        }

        try {
            await dispatch(deleteLoan(deleteTarget._id)).unwrap();

            setDeleteTarget(null);

            toast.success("Loan deleted.");

            const currentPage = pagination?.currPage || 1;

            const shouldGoBack = loans.length === 1 && currentPage > 1;

            loadLoans({
                page: shouldGoBack ? currentPage - 1 : currentPage,
            });
        } catch (error) {
            toast.error(
                typeof error === "string"
                    ? error
                    : "Failed to delete loan. Please try again."
            );
        }
    };

    /* ========================================================
  PAGINATION
  ======================================================== */

    const goToPreviousPage = () => {
        if (!pagination?.hasPreviousPage) {
            return;
        }

        loadLoans({
            page: pagination.currPage - 1,
        });
    };

    const goToNextPage = () => {
        if (!pagination?.hasNextPage) {
            return;
        }

        loadLoans({
            page: pagination.currPage + 1,
        });
    };

    /* ========================================================
  LOADING
  ======================================================== */

    if (loading && loans.length === 0) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                {" "}
                <p className="text-sm text-slate-500">Loading your loans... </p>{" "}
            </div>
        );
    }

    /* ========================================================
  PAGE
  ======================================================== */

    return (
        <>
            {/* =================================================
HEADER
================================================= */}

            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="mb-6 flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-teal-400"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to dashboard
                    </button>

                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Loans
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
                        Your loans
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                        Track what you owe, who you owe it to, and how your outstanding debt
                        is changing.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-5 py-3 text-sm font-medium text-slate-950 transition-colors hover:bg-teal-400"
                >
                    <Plus className="h-4 w-4" />
                    Add loan
                </button>
            </div>

            {/* =================================================
      SUMMARY
  ================================================= */}

            <LoanSummary loans={loans} />

            {/* =================================================
      BREAKDOWN
  ================================================= */}

            {loans.length > 0 && (
                <div className="mt-6">
                    <LoanBreakdown loans={loans} />
                </div>
            )}

            {/* =================================================
      TOOLBAR
  ================================================= */}

            <div className="mt-8 rounded-2xl border border-[#293533] bg-[#171F1E] p-4">
                <div className="flex flex-col gap-3 xl:flex-row">
                    {/* SEARCH */}

                    <form onSubmit={submitSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                            <input
                                type="text"
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder="Search loans..."
                                className="w-full rounded-lg border border-[#293533] bg-[#141B1A] py-2.5 pl-10 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-700 focus:border-teal-700"
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-lg border border-[#293533] px-4 text-sm text-slate-400 hover:bg-[#1B2422] hover:text-slate-200"
                        >
                            Search
                        </button>
                    </form>

                    {/* TYPE */}

                    <select
                        value={loanType}
                        onChange={handleLoanTypeChange}
                        className="rounded-lg border border-[#293533] bg-[#141B1A] px-3 py-2.5 text-sm capitalize text-slate-400 outline-none focus:border-teal-700"
                    >
                        <option value="">All loan types</option>

                        {loanTypes.map((type) => (
                            <option key={type} value={type}>
                                {formatLoanType(type)}
                            </option>
                        ))}
                    </select>

                    {/* STATUS */}

                    <select
                        value={status}
                        onChange={handleStatusChange}
                        className="rounded-lg border border-[#293533] bg-[#141B1A] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-teal-700"
                    >
                        <option value="">All statuses</option>

                        <option value="active">Active</option>

                        <option value="closed">Closed</option>
                    </select>

                    {/* SORT */}

                    <select
                        value={sort}
                        onChange={handleSortChange}
                        className="rounded-lg border border-[#293533] bg-[#141B1A] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-teal-700"
                    >
                        <option value="createdAt">Recently added</option>

                        <option value="loanName">Loan name</option>

                        <option value="principalAmount">Principal</option>

                        <option value="outstandingAmount">Outstanding</option>

                        <option value="interestRate">Interest rate</option>

                        <option value="loanTerm">Loan term</option>

                        <option value="emiAmount">EMI</option>

                        <option value="nextDueDate">Next due date</option>
                    </select>

                    {/* ORDER */}

                    <select
                        value={order}
                        onChange={handleOrderChange}
                        className="rounded-lg border border-[#293533] bg-[#141B1A] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-teal-700"
                    >
                        <option value="desc">Descending</option>

                        <option value="asc">Ascending</option>
                    </select>
                </div>
            </div>

            {/* =================================================
      ERROR
  ================================================= */}

            {error && (
                <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            {/* =================================================
      LOAN GRID
  ================================================= */}

            <div className="mt-6">
                {loans.length === 0 ? (
                    <EmptyState
                        filtered={Boolean(search) || Boolean(loanType) || Boolean(status)}
                        onAdd={openAddModal}
                    />
                ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {loans.map((item) => (
                            <LoanCard
                                key={item._id}
                                loan={item}
                                onEdit={openEditModal}
                                onDelete={setDeleteTarget}
                                onView={openDetails}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* =================================================
      PAGINATION
  ================================================= */}

            {loans.length > 0 && (
                <div className="mt-6 flex items-center justify-between rounded-xl border border-[#293533] bg-[#171F1E] px-4 py-3">
                    <p className="text-xs text-slate-600">
                        Page {pagination?.currPage || 1} of {pagination?.totalPages || 1}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={goToPreviousPage}
                            disabled={!pagination?.hasPreviousPage}
                            className="rounded-lg border border-[#293533] p-2 text-slate-500 transition-colors hover:bg-[#1B2422] hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            onClick={goToNextPage}
                            disabled={!pagination?.hasNextPage}
                            className="rounded-lg border border-[#293533] p-2 text-slate-500 transition-colors hover:bg-[#1B2422] hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* =================================================
      FORM MODAL
  ================================================= */}

            {showForm && (
                <LoanFormModal
                    editingLoan={editingLoan}
                    formData={formData}
                    setFormData={setFormData}
                    onClose={() => {
                        setShowForm(false);
                        setEditingLoan(null);
                    }}
                    onSubmit={handleSubmit}
                    saving={creating || updating}
                    error={loanError || error}
                />
            )}

            {/* =================================================
      DETAILS MODAL
  ================================================= */}

            {showDetails && (
                <LoanDetailsModal
                    loan={loan}
                    loading={loanLoading}
                    onClose={() => {
                        setShowDetails(false);
                        dispatch(clearLoan());
                    }}
                    onEdit={openEditModal}
                />
            )}

            {/* =================================================
      DELETE MODAL
  ================================================= */}

            {deleteTarget && (
                <DeleteModal
                    loan={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                    deleting={deleting}
                />
            )}
        </>
    );
};

export default Loan;