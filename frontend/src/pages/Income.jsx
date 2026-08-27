import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Plus,
    Search,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Eye,
    Pencil,
    Trash2,
    X,
    Wallet,
    CalendarDays,
    CreditCard,
    Tag,
    FileText,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchIncomes,
    fetchIncomeById,
    createIncome,
    updateIncome,
    deleteIncome,
} from "../features/income/incomeSlice";

/* ============================================================
CONSTANTS
============================================================ */

const categories = [
    "salary",
    "business",
    "freelancing",
    "investment",
    "rental",
    "interest",
    "gift",
    "bonus",
    "refund",
    "other",
];

const paymentMethods = [
    "cash",
    "upi",
    "credit-card",
    "debit-card",
    "bank-transfer",
    "wallet",
    "other",
];

/* ============================================================
HELPERS
============================================================ */

const currency = (value = 0) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (date) => {
    if (!date) {
        return "—";
    }

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatDateInput = (date) => {
    if (!date) {
        return "";
    }

    return new Date(date).toISOString().split("T")[0];
};

/* ============================================================
INITIAL FORM
============================================================ */

const emptyForm = {
    incomeSource: "",
    amount: "",
    category: "other",
    paymentMethod: "bank-transfer",
    receivedDate: new Date()
        .toISOString()
        .split("T")[0],
    notes: "",
};

/* ============================================================
MODAL
============================================================ */

const Modal = ({ children, onClose, maxWidth = "max-w-2xl" }) => {
    return (<div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onMouseDown={onClose}
    >
        <div style={{ scrollbarWidth: 'none' }}
            className={`relative max-h-[90vh] w-full ${maxWidth} overflow-y-auto [&::-webkit-scrollbar]:hidden rounded-2xl border border-[#293533] bg-[#171F1E] p-6 shadow-2xl`}
            onMouseDown={(event) =>
                event.stopPropagation()
            }
        >
            {children} </div> </div>
    );
};

/* ============================================================
FORM MODAL
============================================================ */

const IncomeFormModal = ({
    editingIncome,
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

            {/* HEADER */}

            <div className="flex items-start justify-between">

                <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {editingIncome
                            ? "Edit income"
                            : "New income"}
                    </p>

                    <h2 className="mt-2 text-xl font-medium text-slate-100">
                        {editingIncome
                            ? "Edit income record"
                            : "Add income"}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        {editingIncome
                            ? "Update the details of this income record."
                            : "Record a new source of income."}
                    </p>
                </div>


                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-[#1B2422] hover:text-slate-200"
                >
                    <X
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                </button>

            </div>


            {/* FORM */}

            <form
                onSubmit={onSubmit}
                className="mt-7 grid gap-5 sm:grid-cols-2"
            >

                {/* INCOME SOURCE */}

                <div>
                    <label className="text-sm text-slate-400">
                        Income source
                    </label>

                    <input
                        type="text"
                        name="incomeSource"
                        value={formData.incomeSource}
                        onChange={handleChange}
                        placeholder="e.g. Monthly salary"
                        required
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none transition-colors focus:border-teal-700"
                    />
                </div>


                {/* AMOUNT */}

                <div>
                    <label className="text-sm text-slate-400">
                        Amount
                    </label>

                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        min="1"
                        step="0.01"
                        placeholder="₹0"
                        required
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none transition-colors focus:border-teal-700"
                    />
                </div>


                {/* CATEGORY */}

                <div>
                    <label className="text-sm text-slate-400">
                        Category
                    </label>

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm capitalize text-slate-300 outline-none focus:border-teal-700"
                    >
                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>
                </div>


                {/* PAYMENT METHOD */}

                <div>
                    <label className="text-sm text-slate-400">
                        Payment method
                    </label>

                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm capitalize text-slate-300 outline-none focus:border-teal-700"
                    >
                        {paymentMethods.map((method) => (
                            <option
                                key={method}
                                value={method}
                            >
                                {method}
                            </option>
                        ))}
                    </select>
                </div>


                {/* RECEIVED DATE */}

                <div>
                    <label className="text-sm text-slate-400">
                        Received date
                    </label>

                    <input
                        type="date"
                        name="receivedDate"
                        value={formData.receivedDate}
                        onChange={handleChange}
                        max={
                            new Date()
                                .toISOString()
                                .split("T")[0]
                        }
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
                    />
                </div>


                {/* NOTES */}

                <div>
                    <label className="text-sm text-slate-400">
                        Notes
                    </label>

                    <input
                        type="text"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Note"
                        className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
                    />
                </div>


                {/* ERROR */}

                {error && (
                    <div className="sm:col-span-2 rounded-lg border border-red-900/40 bg-red-950/20 px-4 py-3">
                        <p className="text-sm text-red-400">
                            {error}
                        </p>
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
                        {saving
                            ? "Saving..."
                            : editingIncome
                                ? "Update income"
                                : "Save income"}
                    </button>

                </div>

            </form>

        </Modal>
    );
};

/* ============================================================
DETAILS MODAL
============================================================ */

const IncomeDetailsModal = ({
    income,
    loading,
    onClose,
    onEdit,
}) => {

    return (
        <Modal
            onClose={onClose}
            maxWidth="max-w-xl"
        >

            {/* HEADER */}

            <div className="flex items-start justify-between">

                <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Income details
                    </p>

                    <h2 className="mt-2 text-xl font-medium text-slate-100">
                        {income?.incomeSource || "Income"}
                    </h2>
                </div>


                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-slate-500 hover:bg-[#1B2422] hover:text-slate-200"
                >
                    <X
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                </button>

            </div>


            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <p className="text-sm text-slate-500">
                        Loading income details...
                    </p>
                </div>
            ) : income ? (

                <div className="mt-7 space-y-4">

                    {/* AMOUNT */}

                    <div className="rounded-xl border border-[#293533] bg-[#1B2422] p-5">

                        <div className="flex items-center gap-3">

                            <div className="rounded-lg bg-teal-500/10 p-2">
                                <Wallet
                                    className="h-5 w-5 text-teal-400"
                                    aria-hidden="true"
                                />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Amount
                                </p>

                                <p className="mt-1 text-2xl font-semibold text-teal-400">
                                    {currency(income.amount)}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* DETAILS */}

                    <div className="grid gap-4 sm:grid-cols-2">

                        <DetailItem
                            icon={Tag}
                            label="Category"
                            value={income.category}
                            capitalize
                        />

                        <DetailItem
                            icon={CreditCard}
                            label="Payment method"
                            value={income.paymentMethod}
                            capitalize
                        />

                        <DetailItem
                            icon={CalendarDays}
                            label="Received date"
                            value={formatDate(
                                income.receivedDate
                            )}
                        />

                        <DetailItem
                            icon={CalendarDays}
                            label="Created"
                            value={formatDate(
                                income.createdAt
                            )}
                        />

                    </div>


                    {/* NOTES */}

                    <div className="rounded-xl border border-[#293533] bg-[#1B2422] p-5">

                        <div className="flex items-center gap-2">
                            <FileText
                                className="h-4 w-4 text-slate-500"
                                aria-hidden="true"
                            />

                            <p className="text-sm text-slate-400">
                                Notes
                            </p>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-300">
                            {income.notes || "No notes added."}
                        </p>

                    </div>


                    {/* ACTIONS */}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => onEdit(income)}
                            className="flex items-center gap-2 rounded-lg border border-[#293533] px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-[#1B2422]"
                        >
                            <Pencil
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                            Edit
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-teal-400"
                        >
                            Done
                        </button>
                    </div>
                </div>
            ) : (
                <div className="py-16 text-center">
                    <p className="text-sm text-slate-500">
                        Income details could not be found.
                    </p>
                </div>
            )}
        </Modal>
    );
};

/* ============================================================
DETAIL ITEM
============================================================ */
const DetailItem = ({
    icon: Icon,
    label,
    value,
    capitalize = false,
}) => {
    return (
        <div className="rounded-xl border border-[#293533] bg-[#1B2422] p-4">
            <div className="flex items-center gap-2">
                <Icon
                    className="h-4 w-4 text-slate-500"
                    aria-hidden="true"
                />
                <p className="text-xs text-slate-500">
                    {label}
                </p>
            </div>
            <p
                className={`mt-2 text-sm text-slate-200 ${capitalize ? "capitalize" : ""
                    }`}
            >
                {value || "—"}
            </p>
        </div>
    );
};

/* ============================================================
DELETE CONFIRMATION MODAL
============================================================ */
const DeleteModal = ({
    income,
    onClose,
    onConfirm,
    deleting,
}) => {

    if (!income) {
        return null;
    }

    return (
        <Modal
            onClose={onClose}
            maxWidth="max-w-md"
        >

            <div className="text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                    <Trash2
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                    />
                </div>

                <h2 className="mt-5 text-lg font-medium text-slate-100">
                    Delete income?
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Are you sure you want to delete{" "}
                    <span className="text-slate-300">
                        "{income.incomeSource}"
                    </span>
                    ? This action cannot be undone.
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
                        {deleting
                            ? "Deleting..."
                            : "Delete"}
                    </button>

                </div>

            </div>

        </Modal>
    );
};

/* ============================================================
PAGE
============================================================ */

const Income = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();
    /* ========================================================
       REDUX
       ======================================================== */
    const {
        incomes,
        loading,
        creating,
        updating,
        deleting,
        error,
        income,
        incomeLoading,
        incomeError,
        pagination,
    } = useSelector(
        (state) => state.income
    );

    /* ========================================================
       LOCAL STATE
       ======================================================== */

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const [sort, setSort] = useState("createdAt");

    const [order, setOrder] = useState("desc");

    const [showForm, setShowForm] = useState(false);

    const [editingIncome, setEditingIncome] = useState(null);

    const [formData, setFormData] = useState(emptyForm);

    const [showDetails, setShowDetails] = useState(false);

    const [selectedIncome, setSelectedIncome] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);


    /* ========================================================
       FETCH INCOMES
       ======================================================== */

    const loadIncomes = ({
        page = 1,
        nextSearch = search,
        nextCategory = category,
        nextSort = sort,
        nextOrder = order,
    } = {}) => {

        dispatch(
            fetchIncomes({
                page,
                limit: 15,
                sort: nextSort,
                order: nextOrder,
                category: nextCategory,
                search: nextSearch,
            })
        );
    };


    /* ========================================================
       INITIAL FETCH
       ======================================================== */

    useEffect(() => {
        loadIncomes({
            page: 1,
            nextSearch: "",
            nextCategory: "",
            nextSort: "createdAt",
            nextOrder: "desc",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    /* ========================================================
       SEARCH
       ======================================================== */

    const handleSearch = (event) => {
        event.preventDefault();
        const trimmedSearch =
            searchInput.trim();
        setSearch(trimmedSearch);
        loadIncomes({
            page: 1,
            nextSearch: trimmedSearch,
        });
    };

    /* ========================================================
       CATEGORY
       ======================================================== */

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCategory(value);
        loadIncomes({
            page: 1,
            nextCategory: value,
        });
    };


    /* ========================================================
       SORT
       ======================================================== */

    const handleSortChange = (event) => {
        const value = event.target.value;
        setSort(value);
        loadIncomes({
            page: 1,
            nextSort: value,
        });
    };


    /* ========================================================
       ORDER
       ======================================================== */

    const handleOrderChange = (event) => {
        const value = event.target.value;
        setOrder(value);
        loadIncomes({
            page: 1,
            nextOrder: value,
        });
    };


    /* ========================================================
       RESET FILTERS
       ======================================================== */

    const resetFilters = () => {

        setSearchInput("");
        setSearch("");
        setCategory("");
        setSort("createdAt");
        setOrder("desc");

        loadIncomes({
            page: 1,
            nextSearch: "",
            nextCategory: "",
            nextSort: "createdAt",
            nextOrder: "desc",
        });
    };


    /* ========================================================
       OPEN ADD MODAL
       ======================================================== */

    const openAddModal = () => {

        setEditingIncome(null);
        setFormData(emptyForm);
        setShowForm(true);
    };


    /* ========================================================
       OPEN EDIT MODAL
       ======================================================== */

    const openEditModal = (item) => {
        setSelectedIncome(null);
        setShowDetails(false);
        setEditingIncome(item);
        setFormData({
            incomeSource:
                item.incomeSource || "",

            amount:
                item.amount ?? "",

            category:
                item.category || "other",

            paymentMethod:
                item.paymentMethod ||
                "bank-transfer",

            receivedDate:
                formatDateInput(
                    item.receivedDate
                ),
            notes:
                item.notes || "",
        });
        setShowForm(true);
    };


    /* ========================================================
       CLOSE FORM
       ======================================================== */

    const closeForm = () => {

        if (creating || updating) {
            return;
        }

        setShowForm(false);
        setEditingIncome(null);
        setFormData(emptyForm);
    };


    /* ========================================================
       SUBMIT FORM
       ======================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        const payload = {
            incomeSource:
                formData.incomeSource.trim(),

            amount:
                Number(formData.amount),

            category:
                formData.category,

            paymentMethod:
                formData.paymentMethod,

            receivedDate:
                formData.receivedDate,

            notes:
                formData.notes.trim(),
        };


        try {

            if (editingIncome) {

                await dispatch(
                    updateIncome({
                        id: editingIncome._id,
                        incomeData: payload,
                    })
                ).unwrap();

                toast.success("Income entry updated.");

            } else {

                await dispatch(
                    createIncome(payload)
                ).unwrap();

            }


            closeForm();

            loadIncomes({
                page:
                    pagination.currPage || 1,
            });

        } catch (error) {

            toast.error(
                typeof error === "string"
                    ? error
                    : "Something went wrong. Please try again."
            );

        }
    };


    /* ========================================================
       VIEW DETAILS
       ======================================================== */

    const openDetails = async (item) => {

        setShowDetails(true);
        setSelectedIncome(null);

        try {

            const result =
                await dispatch(
                    fetchIncomeById(
                        item._id
                    )
                ).unwrap();

            setSelectedIncome(
                result.income
            );

        } catch (error) {

            setSelectedIncome(null);

        }
    };


    /* ========================================================
       CLOSE DETAILS
       ======================================================== */

    const closeDetails = () => {

        setShowDetails(false);
        setSelectedIncome(null);
    };


    /* ========================================================
       DELETE
       ======================================================== */

    const confirmDelete = async () => {

        if (!deleteTarget) {
            return;
        }

        try {

            await dispatch(
                deleteIncome(
                    deleteTarget._id
                )
            ).unwrap();

            setDeleteTarget(null);

            toast.success("Income entry deleted.");

            const currentPage =
                pagination.currPage || 1;

            const shouldGoBack =
                incomes.length === 1 &&
                currentPage > 1;

            loadIncomes({
                page: shouldGoBack
                    ? currentPage - 1
                    : currentPage,
            });

        } catch (error) {

            toast.error(
                typeof error === "string"
                    ? error
                    : "Failed to delete income entry. Please try again."
            );

        }
    };


    /* ========================================================
       PAGINATION
       ======================================================== */

    const goToPreviousPage = () => {

        if (!pagination.hasPreviousPage) {
            return;
        }

        loadIncomes({
            page:
                pagination.currPage - 1,
        });
    };


    const goToNextPage = () => {

        if (!pagination.hasNextPage) {
            return;
        }

        loadIncomes({
            page:
                pagination.currPage + 1,
        });
    };


    /* ========================================================
       LOADING
       ======================================================== */

    if (
        loading &&
        incomes.length === 0
    ) {

        return (
            <div className="flex min-h-[50vh] items-center justify-center">

                <p className="text-sm text-slate-500">
                    Loading your income...
                </p>

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
                        Income
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
                        Your income
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                        Record and manage the money coming into your financial life.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-5 py-3 text-sm font-medium text-slate-950 transition-colors hover:bg-teal-400"
                >
                    <Plus
                        className="h-4 w-4"
                        aria-hidden="true"
                    />

                    Add income
                </button>

            </div>


            {/* =================================================
            ERROR
            ================================================= */}

            {(error || incomeError) && (
                <div className="mb-6 rounded-xl border border-red-900/40 bg-red-950/20 px-5 py-4">

                    <p className="text-sm text-red-400">
                        {error ||
                            incomeError}
                    </p>

                </div>
            )}


            {/* =================================================
            FILTERS
            ================================================= */}
            <section className="rounded-2xl border border-[#293533] bg-[#171F1E] p-5">
                <div className="grid gap-4 lg:grid-cols-[1.8fr_1fr_1fr_1fr_auto]">
                    {/* SEARCH */}
                    <form
                        onSubmit={handleSearch}
                        className="flex gap-2"
                    >
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600"
                                aria-hidden="true"
                            />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(event) =>
                                    setSearchInput(
                                        event.target.value
                                    )
                                }
                                placeholder="Search income source..."
                                className="w-full rounded-lg border border-[#293533] bg-[#1B2422] py-2.5 pl-9 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-teal-700"
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-lg border border-[#293533] px-4 text-sm text-slate-300 transition-colors hover:bg-[#1B2422]"
                        >
                            Search
                        </button>
                    </form>

                    {/* CATEGORY */}
                    <select
                        value={category}
                        onChange={handleCategoryChange}
                        className="rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm capitalize text-slate-300 outline-none focus:border-teal-700"
                    >
                        <option value="">
                            All categories
                        </option>
                        {categories.map(
                            (item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            )
                        )}
                    </select>

                    {/* SORT */}
                    <select
                        value={sort}
                        onChange={handleSortChange}
                        className="rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-teal-700"
                    >
                        <option value="createdAt">
                            Date added
                        </option>
                        <option value="receivedDate">
                            Received date
                        </option>
                        <option value="amount">
                            Amount
                        </option>
                        <option value="incomeSource">
                            Income source
                        </option>
                    </select>

                    {/* ORDER */}
                    <select
                        value={order}
                        onChange={handleOrderChange}
                        className="rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-teal-700"
                    >
                        <option value="desc">
                            Descending
                        </option>
                        <option value="asc">
                            Ascending
                        </option>
                    </select>

                    {/* RESET */}
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="rounded-lg border border-[#293533] px-4 py-2.5 text-sm text-slate-400 transition-colors hover:bg-[#1B2422] hover:text-slate-200"
                    >
                        Reset
                    </button>
                </div>
            </section>

            {/* =================================================
            INCOME LIST
            ================================================= */}
            <section className="mt-6 rounded-2xl border border-[#293533] bg-[#171F1E]">
                {/* LIST HEADER */}
                <div className="flex flex-col gap-2 border-b border-[#293533] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            Records
                        </p>
                        <h2 className="mt-1 text-lg font-medium text-slate-100">
                            Income history
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <ArrowUpDown
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                        />
                        {pagination.totalIncomes || 0} records
                    </div>
                </div>
                {/* EMPTY */}
                {incomes.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <Wallet
                            className="mx-auto h-7 w-7 text-slate-600"
                            aria-hidden="true"
                        />
                        <h3 className="mt-4 text-sm font-medium text-slate-300">
                            No income records found
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                            {search ||
                                category
                                ? "Try changing your search or filters."
                                : "Add your first income record to start tracking your cash flow."}
                        </p>
                        {!search &&
                            !category && (
                                <button
                                    type="button"
                                    onClick={
                                        openAddModal
                                    }
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-teal-400 hover:text-teal-300"
                                >
                                    <Plus
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                    Add income
                                </button>
                            )}
                    </div>
                ) : (
                    <div>
                        {incomes.map(
                            (item, index) => (
                                <div
                                    key={item._id}
                                    className={`px-6 py-5 ${index <
                                            incomes.length -
                                            1
                                            ? "border-b border-[#293533]"
                                            : ""
                                        }`}
                                >
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                        {/* INFORMATION */}
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/10">
                                                    <Wallet
                                                        className="h-5 w-5 text-teal-400"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="truncate text-sm font-medium text-slate-200">
                                                        {
                                                            item.incomeSource
                                                        }
                                                    </h3>
                                                    <p className="mt-1 text-xs capitalize text-slate-600">
                                                        {
                                                            item.category
                                                        }{" "}
                                                        ·{" "}
                                                        {
                                                            item.paymentMethod
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AMOUNT + DATE */}
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                            <div className="sm:text-right">
                                                <p className="text-lg font-semibold text-teal-400">
                                                    {currency(
                                                        item.amount
                                                    )}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-600">
                                                    {
                                                        formatDate(
                                                            item.receivedDate
                                                        )
                                                    }
                                                </p>
                                            </div>

                                            {/* ACTIONS */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openDetails(
                                                            item
                                                        )
                                                    }
                                                    title="View details"
                                                    className="flex items-center gap-2 rounded-lg border border-[#293533] px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-[#1B2422] hover:text-slate-200"
                                                >
                                                    <Eye
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                    <span className="hidden sm:inline">
                                                        View
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(
                                                            item
                                                        )
                                                    }
                                                    title="Edit income"
                                                    className="flex items-center gap-2 rounded-lg border border-[#293533] px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-[#1B2422] hover:text-slate-200"
                                                >
                                                    <Pencil
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                    <span className="hidden sm:inline">
                                                        Edit
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDeleteTarget(
                                                            item
                                                        )
                                                    }
                                                    title="Delete income"
                                                    className="flex items-center gap-2 rounded-lg border border-red-900/30 px-3 py-2 text-xs text-red-400 transition-colors hover:bg-red-950/20"
                                                >
                                                    <Trash2
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                    <span className="hidden sm:inline">
                                                        Delete
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </section>

            {/* =================================================
            PAGINATION
            ================================================= */}
            {pagination.totalPages > 0 && (
                <div className="mt-5 flex items-center justify-between rounded-xl border border-[#293533] bg-[#171F1E] px-5 py-4">
                    <button
                        type="button"
                        onClick={
                            goToPreviousPage
                        }
                        disabled={
                            !pagination.hasPreviousPage ||
                            loading
                        }
                        className="flex items-center gap-2 rounded-lg border border-[#293533] px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-[#1B2422] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <ChevronLeft
                            className="h-4 w-4"
                            aria-hidden="true"
                        />
                        Previous
                    </button>
                    <p className="text-sm text-slate-500">
                        Page{" "}
                        <span className="text-slate-300">
                            {pagination.currPage}
                        </span>{" "}
                        of{" "}
                        <span className="text-slate-300">
                            {pagination.totalPages}
                        </span>

                    </p>
                    <button
                        type="button"
                        onClick={goToNextPage}
                        disabled={
                            !pagination.hasNextPage ||
                            loading
                        }
                        className="flex items-center gap-2 rounded-lg border border-[#293533] px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-[#1B2422] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        Next
                        <ChevronRight
                            className="h-4 w-4"
                            aria-hidden="true"
                        />
                    </button>
                </div>
            )}


            {/* =================================================
            ADD / EDIT MODAL
            ================================================= */}

            {showForm && (
                <IncomeFormModal
                    editingIncome={
                        editingIncome
                    }
                    formData={formData}
                    setFormData={
                        setFormData
                    }
                    onClose={closeForm}
                    onSubmit={
                        handleSubmit
                    }
                    saving={
                        creating ||
                        updating
                    }
                    error={error}
                />
            )}


            {/* =================================================
            VIEW DETAILS MODAL
            ================================================= */}

            {showDetails && (
                <IncomeDetailsModal
                    income={
                        selectedIncome
                    }
                    loading={
                        incomeLoading
                    }
                    onClose={
                        closeDetails
                    }
                    onEdit={
                        openEditModal
                    }
                />
            )}

            {/* =================================================
            DELETE MODAL
            ================================================= */}

            {deleteTarget && (
                <DeleteModal
                    income={
                        deleteTarget
                    }
                    onClose={() =>
                        setDeleteTarget(
                            null
                        )
                    }
                    onConfirm={
                        confirmDelete
                    }
                    deleting={
                        deleting
                    }
                />
            )}
        </>
    );
};
export default Income;