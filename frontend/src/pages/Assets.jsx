import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  Wallet,
  TrendingUp,
  TrendingDown,
  Landmark,
  Banknote,
  Building2,
  Coins,
  Car,
  BriefcaseBusiness,
  Bitcoin,
  ShieldCheck,
  PiggyBank,
  ReceiptText,
  CalendarDays,
  Pencil,
  Trash2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchAssets,
  fetchAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  clearAssets,
  clearAsset,
  clearAssetError,
} from "../features/assets/assetSlice";

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

const formatCategory = (category = "other") =>
  category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getGain = (currentValue, purchaseValue) => {
  if (
    purchaseValue === undefined ||
    purchaseValue === null ||
    purchaseValue === ""
  ) {
    return null;
  }

  return Number(currentValue || 0) - Number(purchaseValue || 0);
};

const getGainPercentage = (currentValue, purchaseValue) => {
  if (!purchaseValue || Number(purchaseValue) <= 0) {
    return null;
  }

  return (
    ((Number(currentValue || 0) - Number(purchaseValue)) /
      Number(purchaseValue)) *
    100
  );
};

/* ============================================================
   CATEGORY CONFIG
============================================================ */

const categoryConfig = {
  bank: {
    label: "Bank",
    icon: Landmark,
    style: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },

  cash: {
    label: "Cash",
    icon: Banknote,
    style: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },

  "fixed-deposit": {
    label: "Fixed Deposit",
    icon: Landmark,
    style: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  },

  "recurring-deposit": {
    label: "Recurring Deposit",
    icon: PiggyBank,
    style: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
  },

  "mutual-fund": {
    label: "Mutual Fund",
    icon: TrendingUp,
    style: "border-violet-500/20 bg-violet-500/10 text-violet-400",
  },

  stock: {
    label: "Stock",
    icon: TrendingUp,
    style: "border-teal-500/20 bg-teal-500/10 text-teal-400",
  },

  gold: {
    label: "Gold",
    icon: Coins,
    style: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },

  property: {
    label: "Property",
    icon: Building2,
    style: "border-orange-500/20 bg-orange-500/10 text-orange-400",
  },

  crypto: {
    label: "Crypto",
    icon: Bitcoin,
    style: "border-pink-500/20 bg-pink-500/10 text-pink-400",
  },

  epf: {
    label: "EPF",
    icon: ShieldCheck,
    style: "border-sky-500/20 bg-sky-500/10 text-sky-400",
  },

  ppf: {
    label: "PPF",
    icon: PiggyBank,
    style: "border-purple-500/20 bg-purple-500/10 text-purple-400",
  },

  vehicle: {
    label: "Vehicle",
    icon: Car,
    style: "border-red-500/20 bg-red-500/10 text-red-400",
  },

  business: {
    label: "Business",
    icon: BriefcaseBusiness,
    style: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  },

  other: {
    label: "Other",
    icon: Wallet,
    style: "border-slate-600/50 bg-slate-800/40 text-slate-400",
  },
};

const categories = Object.keys(categoryConfig);

/* ============================================================
   CATEGORY BADGE
============================================================ */

const CategoryBadge = ({ category }) => {
  const config = categoryConfig[category] || categoryConfig.other;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${config.style}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};

/* ============================================================
   GAIN / LOSS
============================================================ */

const GainLoss = ({ currentValue, purchaseValue }) => {
  const gain = getGain(currentValue, purchaseValue);
  const percentage = getGainPercentage(currentValue, purchaseValue);

  if (gain === null) {
    return (
      <span className="text-sm text-slate-500">
        Purchase value not available
      </span>
    );
  }

  const positive = gain >= 0;

  return (
    <div
      className={`flex items-center gap-1.5 ${
        positive ? "text-emerald-400" : "text-red-400"
      }`}
    >
      {positive ? (
        <TrendingUp className="h-4 w-4" />
      ) : (
        <TrendingDown className="h-4 w-4" />
      )}

      <span className="text-sm font-medium">
        {positive ? "+" : "-"}
        {currency(Math.abs(gain))}
      </span>

      {percentage !== null && (
        <span className="text-xs opacity-80">
          ({positive ? "+" : ""}
          {percentage.toFixed(1)}%)
        </span>
      )}
    </div>
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
        {children}
      </div>
    </div>
  );
};

/* ============================================================
   ASSET FORM
============================================================ */

const emptyForm = {
  assetName: "",
  category: "other",
  currentValue: "",
  purchaseValue: "",
  purchaseDate: "",
  institution: "",
  notes: "",
};

const AssetFormModal = ({
  editingAsset,
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
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            {editingAsset ? "Edit asset" : "New asset"}
          </p>

          <h2 className="mt-2 text-xl font-medium text-slate-100">
            {editingAsset ? "Update asset" : "Add an asset"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {editingAsset
              ? "Update the information for this asset."
              : "Record something you currently own or hold."}
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
        {/* ASSET NAME */}

        <div className="sm:col-span-2">
          <label className="text-sm text-slate-400">Asset name</label>

          <input
            type="text"
            name="assetName"
            value={formData.assetName}
            onChange={handleChange}
            placeholder="e.g. HDFC Savings Account"
            required
            className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
          />
        </div>

        {/* CATEGORY */}

        <div>
          <label className="text-sm text-slate-400">Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm capitalize text-slate-300 outline-none focus:border-teal-700"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {formatCategory(category)}
              </option>
            ))}
          </select>
        </div>

        {/* CURRENT VALUE */}

        <div>
          <label className="text-sm text-slate-400">Current value</label>

          <input
            type="number"
            name="currentValue"
            value={formData.currentValue}
            onChange={handleChange}
            min="1"
            step="0.01"
            placeholder="Current market/value"
            required
            className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
          />
        </div>

        {/* PURCHASE VALUE */}

        <div>
          <label className="text-sm text-slate-400">Purchase value</label>

          <input
            type="number"
            name="purchaseValue"
            value={formData.purchaseValue}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Optional"
            className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
          />
        </div>

        {/* PURCHASE DATE */}

        <div>
          <label className="text-sm text-slate-400">Purchase date</label>

          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
          />
        </div>

        {/* INSTITUTION */}

        <div>
          <label className="text-sm text-slate-400">
            Institution / provider
          </label>

          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="e.g. HDFC, Zerodha"
            className="mt-2 w-full rounded-lg border border-[#293533] bg-[#1B2422] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-700"
          />
        </div>

        {/* NOTES */}

        <div className="sm:col-span-2">
          <label className="text-sm text-slate-400">Notes</label>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Optional notes about this asset"
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
            {saving
              ? "Saving..."
              : editingAsset
                ? "Update asset"
                : "Save asset"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

/* ============================================================
   DETAILS MODAL
============================================================ */

const AssetDetailsModal = ({ asset, loading, onClose, onEdit }) => {
  if (!asset && !loading) {
    return null;
  }

  const gain = asset ? getGain(asset.currentValue, asset.purchaseValue) : null;

  return (
    <Modal onClose={onClose} maxWidth="max-w-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Asset details
          </p>

          <h2 className="mt-2 text-xl font-medium text-slate-100">
            {asset?.assetName || "Asset"}
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
          <p className="text-sm text-slate-500">Loading asset details...</p>
        </div>
      ) : asset ? (
        <div className="mt-7 space-y-4">
          {/* VALUE HERO */}

          <div className="rounded-2xl border border-[#293533] bg-[#1B2422] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">Current value</p>

                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
                  {currency(asset.currentValue)}
                </p>
              </div>

              <div className="rounded-xl bg-teal-500/10 p-3">
                <Wallet className="h-6 w-6 text-teal-400" />
              </div>
            </div>

            <div className="mt-4">
              <GainLoss
                currentValue={asset.currentValue}
                purchaseValue={asset.purchaseValue}
              />
            </div>
          </div>

          {/* CATEGORY */}

          <div className="flex items-center justify-between rounded-xl border border-[#293533] bg-[#1B2422] p-4">
            <span className="text-sm text-slate-500">Category</span>

            <CategoryBadge category={asset.category} />
          </div>

          {/* VALUES */}

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem
              icon={ReceiptText}
              label="Purchase value"
              value={
                asset.purchaseValue !== undefined
                  ? currency(asset.purchaseValue)
                  : "—"
              }
            />

            <DetailItem
              icon={Landmark}
              label="Institution"
              value={asset.institution || "—"}
            />

            <DetailItem
              icon={CalendarDays}
              label="Purchase date"
              value={formatDate(asset.purchaseDate)}
            />

            <DetailItem
              icon={Wallet}
              label="Gain / loss"
              value={gain !== null ? currency(gain) : "—"}
            />
          </div>

          {/* NOTES */}

          <div className="rounded-xl border border-[#293533] bg-[#1B2422] p-4">
            <p className="text-xs text-slate-500">Notes</p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              {asset.notes || "No notes added."}
            </p>
          </div>

          {/* ACTIONS */}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onEdit(asset)}
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
   DETAIL ITEM
============================================================ */

const DetailItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-xl border border-[#293533] bg-[#1B2422] p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-500" />

        <p className="text-xs text-slate-500">{label}</p>
      </div>

      <p className="mt-2 text-sm text-slate-200">{value || "—"}</p>
    </div>
  );
};

/* ============================================================
   DELETE MODAL
============================================================ */

const DeleteModal = ({ asset, onClose, onConfirm, deleting }) => {
  if (!asset) {
    return null;
  }

  return (
    <Modal onClose={onClose} maxWidth="max-w-md">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <Trash2 className="h-5 w-5 text-red-400" />
        </div>

        <h2 className="mt-5 text-lg font-medium text-slate-100">
          Delete asset?
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Are you sure you want to delete{" "}
          <span className="text-slate-300">"{asset.assetName}"</span>? This
          action cannot be undone.
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
   ASSET CARD
============================================================ */

const AssetCard = ({ asset, onEdit, onDelete, onView }) => {
  return (
    <article className="group rounded-2xl border border-[#293533] bg-[#171F1E] p-5 transition-all duration-200 hover:border-[#3A4946] hover:bg-[#192321]">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-medium text-slate-100">
              {asset.assetName}
            </h2>

            <CategoryBadge category={asset.category} />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            {asset.institution || "No institution specified"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onView(asset)}
          className="rounded-lg p-2 text-slate-500 opacity-0 transition-all hover:bg-[#1B2422] hover:text-slate-200 group-hover:opacity-100"
          title="View details"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      {/* VALUE */}

      <div className="mt-6">
        <p className="text-xs text-slate-500">Current value</p>

        <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">
          {currency(asset.currentValue)}
        </p>
      </div>

      {/* PURCHASE */}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#293533] bg-[#141B1A] p-3">
          <p className="text-[11px] text-slate-600">Purchased at</p>

          <p className="mt-1 text-sm text-slate-300">
            {asset.purchaseValue !== undefined && asset.purchaseValue !== null
              ? currency(asset.purchaseValue)
              : "—"}
          </p>
        </div>

        <div className="rounded-xl border border-[#293533] bg-[#141B1A] p-3">
          <p className="text-[11px] text-slate-600">Purchased</p>

          <p className="mt-1 text-sm text-slate-300">
            {formatDate(asset.purchaseDate)}
          </p>
        </div>
      </div>

      {/* PERFORMANCE */}

      <div className="mt-5 flex items-center justify-between">
        <GainLoss
          currentValue={asset.currentValue}
          purchaseValue={asset.purchaseValue}
        />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onView(asset)}
            className="rounded-lg p-2 text-slate-500 hover:bg-[#1B2422] hover:text-slate-200"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onEdit(asset)}
            className="rounded-lg p-2 text-slate-500 hover:bg-[#1B2422] hover:text-slate-200"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(asset)}
            className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
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
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10">
        <Wallet className="h-5 w-5 text-teal-400" />
      </div>

      <h3 className="mt-5 text-lg font-medium text-slate-100">
        {filtered ? "No assets match your filters" : "Your portfolio is empty"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {filtered
          ? "Try changing the search or category filter."
          : "Start by adding your first asset so Project Udaan can build your financial picture."}
      </p>

      {!filtered && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-teal-400 hover:text-teal-300"
        >
          <Plus className="h-4 w-4" />
          Add your first asset
        </button>
      )}
    </div>
  );
};

/* ============================================================
   PORTFOLIO SUMMARY
============================================================ */

const PortfolioSummary = ({ assets }) => {
  const totalCurrent = assets.reduce(
    (sum, asset) => sum + Number(asset.currentValue || 0),
    0,
  );

  const totalPurchase = assets.reduce(
    (sum, asset) => sum + Number(asset.purchaseValue || 0),
    0,
  );

  const totalGain = totalCurrent - totalPurchase;

  const gainPercent =
    totalPurchase > 0 ? (totalGain / totalPurchase) * 100 : null;

  const categoriesCount = new Set(assets.map((asset) => asset.category)).size;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* TOTAL */}

      <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
            Portfolio value
          </p>

          <div className="rounded-lg bg-teal-500/10 p-2">
            <Wallet className="h-4 w-4 text-teal-400" />
          </div>
        </div>

        <p className="mt-4 text-2xl font-semibold text-slate-100">
          {currency(totalCurrent)}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Across {assets.length} asset
          {assets.length === 1 ? "" : "s"}
        </p>
      </div>

      {/* PURCHASE */}

      <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
            Invested value
          </p>

          <div className="rounded-lg bg-blue-500/10 p-2">
            <ReceiptText className="h-4 w-4 text-blue-400" />
          </div>
        </div>

        <p className="mt-4 text-2xl font-semibold text-slate-100">
          {currency(totalPurchase)}
        </p>

        <p className="mt-1 text-xs text-slate-500">Recorded purchase values</p>
      </div>

      {/* GAIN */}

      <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
            Portfolio change
          </p>

          <div
            className={`rounded-lg p-2 ${
              totalGain >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"
            }`}
          >
            {totalGain >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
        </div>

        <p
          className={`mt-4 text-2xl font-semibold ${
            totalGain >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {totalGain >= 0 ? "+" : "-"}
          {currency(Math.abs(totalGain))}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {gainPercent !== null
            ? `${gainPercent >= 0 ? "+" : ""}${gainPercent.toFixed(1)}%`
            : "No purchase data"}
        </p>
      </div>

      {/* DIVERSIFICATION */}

      <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
            Diversification
          </p>

          <div className="rounded-lg bg-violet-500/10 p-2">
            <SlidersHorizontal className="h-4 w-4 text-violet-400" />
          </div>
        </div>

        <p className="mt-4 text-2xl font-semibold text-slate-100">
          {categoriesCount}
        </p>

        <p className="mt-1 text-xs text-slate-500">Asset categories</p>
      </div>
    </div>
  );
};

/* ============================================================
   ALLOCATION
============================================================ */

const Allocation = ({ assets }) => {
  const total = assets.reduce(
    (sum, asset) => sum + Number(asset.currentValue || 0),
    0,
  );

  const grouped = useMemo(() => {
    const map = {};

    assets.forEach((asset) => {
      const category = asset.category || "other";

      map[category] = (map[category] || 0) + Number(asset.currentValue || 0);
    });

    return Object.entries(map)
      .map(([category, value]) => ({
        category,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [assets, total]);

  if (!assets.length) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-[#293533] bg-[#171F1E] p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-600">
            Portfolio composition
          </p>

          <h2 className="mt-2 text-lg font-medium text-slate-100">
            Where your money is held
          </h2>
        </div>

        <p className="text-xs text-slate-500">Based on current asset values</p>
      </div>

      {/* BAR */}

      <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-[#24302D]">
        {grouped.map((item) => (
          <div
            key={item.category}
            className="h-full bg-teal-500 transition-all"
            style={{
              width: `${item.percentage}%`,
              opacity: Math.max(0.25, 1 - grouped.indexOf(item) * 0.12),
            }}
            title={`${formatCategory(item.category)} ${item.percentage.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* LEGEND */}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {grouped.slice(0, 6).map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between rounded-xl border border-[#293533] bg-[#141B1A] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-teal-400" />

              <span className="text-xs text-slate-400">
                {formatCategory(item.category)}
              </span>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-200">{currency(item.value)}</p>

              <p className="text-[11px] text-slate-600">
                {item.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ============================================================
   PAGE
============================================================ */

const Assets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    assets,
    asset,
    loading,
    assetLoading,
    creating,
    updating,
    deleting,
    error,
    assetError,
    pagination,
  } = useSelector((state) => state.assets);

  /* ========================================================
       LOCAL STATE
    ======================================================== */

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [sort, setSort] = useState("createdAt");

  const [order, setOrder] = useState("desc");

  const [showForm, setShowForm] = useState(false);

  const [editingAsset, setEditingAsset] = useState(null);

  const [showDetails, setShowDetails] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  /* ========================================================
       LOAD ASSETS
    ======================================================== */

  const loadAssets = (overrides = {}) => {
    dispatch(
      fetchAssets({
        page: pagination.currPage || 1,
        limit: 15,
        sort,
        order,
        category,
        search,
        ...overrides,
      }),
    );
  };

  useEffect(() => {
    loadAssets({
      page: 1,
    });

    return () => {
      dispatch(clearAssets());
    };
  }, []);

  /* ========================================================
       SEARCH
    ======================================================== */

  const submitSearch = (event) => {
    event.preventDefault();

    setSearch(searchInput.trim());

    dispatch(
      fetchAssets({
        page: 1,
        limit: 15,
        sort,
        order,
        category,
        search: searchInput.trim(),
      }),
    );
  };

  /* ========================================================
       FILTER
    ======================================================== */

  const handleCategoryChange = (event) => {
    const value = event.target.value;

    setCategory(value);

    dispatch(
      fetchAssets({
        page: 1,
        limit: 15,
        sort,
        order,
        category: value,
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
      fetchAssets({
        page: 1,
        limit: 15,
        sort: value,
        order,
        category,
        search,
      }),
    );
  };

  const handleOrderChange = (event) => {
    const value = event.target.value;

    setOrder(value);

    dispatch(
      fetchAssets({
        page: 1,
        limit: 15,
        sort,
        order: value,
        category,
        search,
      }),
    );
  };

  /* ========================================================
       CREATE
    ======================================================== */

  const openAddModal = () => {
    dispatch(clearAssetError());

    setEditingAsset(null);

    setFormData({
      ...emptyForm,
      purchaseDate: "",
    });

    setShowForm(true);
  };

  /* ========================================================
       EDIT
    ======================================================== */

  const openEditModal = (selectedAsset) => {
    dispatch(clearAssetError());

    setEditingAsset(selectedAsset);

    setFormData({
      assetName: selectedAsset.assetName || "",

      category: selectedAsset.category || "other",

      currentValue: selectedAsset.currentValue ?? "",

      purchaseValue: selectedAsset.purchaseValue ?? "",

      purchaseDate: selectedAsset.purchaseDate
        ? new Date(selectedAsset.purchaseDate).toISOString().split("T")[0]
        : "",

      institution: selectedAsset.institution || "",

      notes: selectedAsset.notes || "",
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
      if (editingAsset) {
        await dispatch(
          updateAsset({
            id: editingAsset._id,
            assetData: formData,
          }),
        ).unwrap();

        toast.success("Asset updated.");
      } else {
        await dispatch(createAsset(formData)).unwrap();
      }

      setShowForm(false);
      setEditingAsset(null);
      setFormData(emptyForm);

      loadAssets();
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

  const openDetails = (selectedAsset) => {
    setShowDetails(true);

    dispatch(fetchAssetById(selectedAsset._id));
  };

  /* ========================================================
       DELETE
    ======================================================== */

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await dispatch(deleteAsset(deleteTarget._id)).unwrap();

      setDeleteTarget(null);

      toast.success("Asset deleted.");

      const currentPage = pagination.currPage || 1;

      const shouldGoBack = assets.length === 1 && currentPage > 1;

      loadAssets({
        page: shouldGoBack ? currentPage - 1 : currentPage,
      });
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to delete asset. Please try again."
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

    loadAssets({
      page: pagination.currPage - 1,
    });
  };

  const goToNextPage = () => {
    if (!pagination.hasNextPage) {
      return;
    }

    loadAssets({
      page: pagination.currPage + 1,
    });
  };

  /* ========================================================
       LOADING
    ======================================================== */

  if (loading && assets.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading your assets...</p>
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
            Assets
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
            Your portfolio
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Track what you own, where it is held, and how its value is changing.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-5 py-3 text-sm font-medium text-slate-950 transition-colors hover:bg-teal-400"
        >
          <Plus className="h-4 w-4" />
          Add asset
        </button>
      </div>

      {/* =================================================
                SUMMARY
            ================================================= */}

      <PortfolioSummary assets={assets} />

      {/* =================================================
                ALLOCATION
            ================================================= */}

      {assets.length > 0 && (
        <div className="mt-6">
          <Allocation assets={assets} />
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
                placeholder="Search assets..."
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

          {/* CATEGORY */}

          <select
            value={category}
            onChange={handleCategoryChange}
            className="rounded-lg border border-[#293533] bg-[#141B1A] px-3 py-2.5 text-sm capitalize text-slate-400 outline-none focus:border-teal-700"
          >
            <option value="">All categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {formatCategory(item)}
              </option>
            ))}
          </select>

          {/* SORT */}

          <select
            value={sort}
            onChange={handleSortChange}
            className="rounded-lg border border-[#293533] bg-[#141B1A] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-teal-700"
          >
            <option value="createdAt">Recently added</option>

            <option value="assetName">Asset name</option>

            <option value="currentValue">Current value</option>

            <option value="purchaseValue">Purchase value</option>

            <option value="purchaseDate">Purchase date</option>
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
                ASSET GRID
            ================================================= */}

      <div className="mt-6">
        {assets.length === 0 ? (
          <EmptyState
            filtered={Boolean(search) || Boolean(category)}
            onAdd={openAddModal}
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {assets.map((item) => (
              <AssetCard
                key={item._id}
                asset={item}
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

      {assets.length > 0 && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-[#293533] bg-[#171F1E] px-4 py-3">
          <p className="text-xs text-slate-600">
            Page {pagination.currPage || 1} of {pagination.totalPages || 1}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={!pagination.hasPreviousPage}
              className="rounded-lg border border-[#293533] p-2 text-slate-500 transition-colors hover:bg-[#1B2422] hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={goToNextPage}
              disabled={!pagination.hasNextPage}
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
        <AssetFormModal
          editingAsset={editingAsset}
          formData={formData}
          setFormData={setFormData}
          onClose={() => {
            setShowForm(false);
            setEditingAsset(null);
          }}
          onSubmit={handleSubmit}
          saving={creating || updating}
          error={error}
        />
      )}

      {/* =================================================
                DETAILS MODAL
            ================================================= */}

      {showDetails && (
        <AssetDetailsModal
          asset={asset}
          loading={assetLoading}
          onClose={() => {
            setShowDetails(false);
            dispatch(clearAsset());
          }}
          onEdit={openEditModal}
        />
      )}

      {/* =================================================
                DELETE MODAL
            ================================================= */}

      {deleteTarget && (
        <DeleteModal
          asset={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          deleting={deleting}
        />
      )}
    </>
  );
};

export default Assets;