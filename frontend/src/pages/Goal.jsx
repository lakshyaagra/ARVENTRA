import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Plus,
  Search,
  Target,
  CheckCircle2,
  Clock3,
  ChevronLeft,
  ChevronRight,
  Wallet,
  X,
  ImagePlus,
  CalendarDays,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchGoals,
  fetchGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  clearGoal,
} from "../features/goals/goalSlice";

/* =====================================================================
HELPERS
===================================================================== */

const currency = (value = 0) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
  if (!value) return "No deadline";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getProgress = (currentAmount, targetAmount) => {
  if (!targetAmount || targetAmount <= 0) {
    return 0;
  }

  return Math.min(
    Math.max((Number(currentAmount || 0) / Number(targetAmount)) * 100, 0),
    100,
  );
};

/* =====================================================================
PRIORITY
===================================================================== */

const priorityStyles = {
  low: "border-slate-600/50 bg-slate-800/40 text-slate-400",
  medium: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  high: "border-red-500/20 bg-red-500/10 text-red-400",
};

const PriorityBadge = ({ priority }) => {
  if (!priority) return null;
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${
        priorityStyles[priority] || priorityStyles.medium
      }`}
    >
      {priority}
    </span>
  );
};

/* =====================================================================
STATUS
===================================================================== */

const StatusBadge = ({ status }) => {
  const completed = status === "completed";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
        completed
          ? "border-teal-500/20 bg-teal-500/10 text-teal-400"
          : "border-slate-600/50 bg-slate-800/40 text-slate-400"
      }`}
    >
      {completed ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <Clock3 className="h-3 w-3" />
      )}

      {completed ? "Completed" : "Active"}
    </span>
  );
};

/* =====================================================================
PROGRESS BAR
===================================================================== */

const ProgressBar = ({ progress }) => (
  <div className="h-2 overflow-hidden rounded-full bg-[#24302D]">
    <div
      className="h-full rounded-full bg-teal-500 transition-[width] duration-500"
      style={{
        width: `${progress}%`,
      }}
    />
  </div>
);

/* =====================================================================
GOAL IMAGE
===================================================================== */

const GoalImage = ({ image, goalName }) => {

  if (!image) {
    return (
      <div className="flex h-32 w-full items-center justify-center rounded-xl border
                     border-[#293533] bg-[#141B1A]">
        <div className="text-center">
          <ImagePlus className="mx-auto h-6 w-6 text-slate-700" />

          <p className="mt-2 text-xs text-slate-600">No image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#293533] bg-[#141B1A]">
      <img
        src={image}
        alt={`${goalName} goal`}
        className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
};

/* =====================================================================
GOAL CARD
===================================================================== */

const GoalCard = ({ goal, onEdit, onDelete, onViewDetails, deleting }) => {
  const progress = getProgress(goal.currentAmount, goal.targetAmount);

  return (
    <article className="group rounded-2xl border border-[#293533] bg-[#171F1E] p-6 transition-colors hover:border-[#3A4946]">

      {/* =========================================================
               HEADER
            ========================================================= */}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-medium text-slate-100">
              {goal.goalName}
            </h2>

            <PriorityBadge priority={goal.priority} />
          </div>

          {goal.category && (
            <p className="mt-1 text-xs capitalize text-slate-500">
              {goal.category}
            </p>
          )}
        </div>

        <StatusBadge status={goal.status} />
      </div>

      {/* =========================================================
               IMAGE - BELOW STATUS / TOP RIGHT
            ========================================================= */}

      <div className="mt-4 ml-auto w-full sm:w-56">
        <GoalImage image={goal.image} goalName={goal.goalName} />
      </div>

      {/* =========================================================
               DESCRIPTION
            ========================================================= */}

      {goal.description && (
        <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-500">
          {goal.description}
        </p>
      )}

      {/* =========================================================
               AMOUNTS
            ========================================================= */}

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-600">
            Progress
          </p>

          <p className="mt-2 text-xl font-semibold text-slate-100">
            {currency(goal.currentAmount)}
          </p>
        </div>

        <p className="text-sm text-slate-500">
          of {currency(goal.targetAmount)}
        </p>
      </div>

      {/* =========================================================
               PROGRESS
            ========================================================= */}

      <div className="mt-4">
        <ProgressBar progress={progress} />

        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-slate-600">
            {progress.toFixed(0)}% complete
          </p>

          <p className="text-xs text-slate-600">{formatDate(goal.deadline)}</p>
        </div>
      </div>


      {/* =========================================================
               ACTIONS
            ========================================================= */}

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#293533] pt-5">

        <button
          type="button"
          onClick={() => onViewDetails(goal._id)}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-medium text-[#10201D] transition-colors hover:bg-teal-400 disabled:opacity-50"
        >
          View Details
        </button>
        <button
          type="button"
          onClick={() => onEdit(goal)}
          disabled={deleting || goal.status === "completed"}
          className="inline-flex items-center gap-2 rounded-xl border border-[#293533] px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-teal-500/40 hover:bg-teal-500/5 hover:text-teal-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Pencil className="h-4 w-4" />
          {goal.status === "completed" ? "Completed" : "Edit"}
        </button>

        <button
          type="button"
          onClick={() => onDelete(goal)}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Delete
        </button>

      </div>
    </article>
  );
};

/* =====================================================================
EMPTY STATE
===================================================================== */

const EmptyState = ({ onCreate }) => (
  <div className="rounded-2xl border border-dashed border-[#34413E] bg-[#171F1E] px-6 py-16 text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10">
      <Target className="h-6 w-6 text-teal-400" />
    </div>

    <h2 className="mt-5 text-lg font-medium text-slate-100">No goals yet</h2>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
      Create your first financial goal and start tracking your progress toward
      it.
    </p>

    <button
      type="button"
      onClick={onCreate}
      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-medium text-[#10201D] transition-colors hover:bg-teal-400"
    >
      <Plus className="h-4 w-4" />
      Create goal
    </button>
  </div>
);

/* =====================================================================
INPUT
===================================================================== */

const Input = ({ label, error, ...props }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-300">
      {label}
    </label>

    <input
      {...props}
      className={`w-full rounded-xl border ${
        error ? "border-red-500/50" : "border-[#293533]"
      } bg-[#141B1A] px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-500/50`}
    />

    {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
  </div>
);

/* =====================================================================
SELECT
===================================================================== */

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-300">
      {label}
    </label>

    <select
      {...props}
      className="w-full rounded-xl border border-[#293533] bg-[#141B1A] px-4 py-3 text-sm text-slate-300 outline-none focus:border-teal-500/50"
    >
      {children}
    </select>
  </div>
);

/* =====================================================================
GOAL FORM MODAL
===================================================================== */

const GoalFormModal = ({ 
  open,
  onClose,
  onSubmit,
  submitting,
  editingGoal,
}) => {
  const isEditing = Boolean(editingGoal);

  const [form, setForm] = useState({
    goalName: "",
    targetAmount: "",
    currentAmount: "0",
    priority: "medium",
    category: "other",
    deadline: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formError, setFormError] = useState("");

  /* ================================================================
       LOAD EDIT DATA
    ================================================================ */

  useEffect(() => {
    if (!open) {
      setForm({
        goalName: "",
        targetAmount: "",
        currentAmount: "0",
        priority: "medium",
        category: "other",
        deadline: "",
        description: "",
      });

      setImage(null);
      setPreview(null);
      setFormError("");

      return;
    }

    if (editingGoal) {
      setForm({
        goalName: editingGoal.goalName || "",
        targetAmount: editingGoal.targetAmount || "",
        currentAmount: editingGoal.currentAmount || "0",
        priority: editingGoal.priority || "medium",
        category: editingGoal.category || "other",
        deadline: editingGoal.deadline
          ? new Date(editingGoal.deadline).toISOString().split("T")[0]
          : "",
        description: editingGoal.description || "",
      });

      setPreview(editingGoal.image || null);
      setImage(null);
    } else {
      setForm({
        goalName: "",
        targetAmount: "",
        currentAmount: "0",
        priority: "medium",
        category: "other",
        deadline: "",
        description: "",
      });

      setPreview(null);
      setImage(null);
    }

    setFormError("");
  }, [open, editingGoal]);

  if (!open) return null;

  /* ================================================================
       CHANGE
    ================================================================ */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* ================================================================
       IMAGE
    ================================================================ */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================================================================
       SUBMIT
    ================================================================ */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    const goalName = form.goalName.trim();
    const targetAmount = Number(form.targetAmount);
    const currentAmount = Number(form.currentAmount || 0);

    if (!goalName) {
      setFormError("Goal name is required.");
      return;
    }

    if (Number.isNaN(targetAmount) || targetAmount <= 0) {
      setFormError("Target amount must be greater than zero.");
      return;
    }

    if (Number.isNaN(currentAmount) || currentAmount < 0) {
      setFormError("Current amount cannot be negative.");
      return;
    }

    if (currentAmount > targetAmount) {
      setFormError("Current amount cannot exceed target amount.");
      return;
    }

    if (form.deadline) {
      const deadline = new Date(form.deadline);

      if (Number.isNaN(deadline.getTime()) || deadline <= new Date()) {
        setFormError("Deadline must be a future date.");
        return;
      }
    }

    const formData = new FormData();

    formData.append("goalName", goalName);
    formData.append("targetAmount", targetAmount);
    formData.append("currentAmount", currentAmount);
    formData.append("priority", form.priority);
    formData.append("category", form.category);

    if (form.deadline) {
      formData.append("deadline", form.deadline);
    }

    if (form.description.trim()) {
      formData.append("description", form.description.trim());
    }

    if (image) {
      formData.append("goalImage", image);
    }

    try {
      await onSubmit(formData, editingGoal?._id);
    } catch (error) {
      setFormError(
        error?.message || `Failed to ${isEditing ? "update" : "create"} goal.`,
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        style={{
          scrollbarWidth: "none",
        }}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#293533] bg-[#171F1E] shadow-2xl [&::-webkit-scrollbar]:hidden"
      >
        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#293533] bg-[#171F1E] px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Financial goals
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-100">
              {isEditing ? "Edit goal" : "Create a new goal"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-[#1F2927] hover:text-slate-200 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {formError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {formError}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Goal name"
                name="goalName"
                value={form.goalName}
                onChange={handleChange}
                placeholder="e.g. Emergency fund"
                disabled={submitting}
              />
            </div>

            <Input
              label="Target amount"
              name="targetAmount"
              type="number"
              min="1"
              step="0.01"
              value={form.targetAmount}
              onChange={handleChange}
              placeholder="50000"
              disabled={submitting}
            />

            <Input
              label="Current amount"
              name="currentAmount"
              type="number"
              min="0"
              step="0.01"
              value={form.currentAmount}
              onChange={handleChange}
              placeholder="0"
              disabled={submitting}
            />

            <Select
              label="Priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="low">Low</option>

              <option value="medium">Medium</option>

              <option value="high">High</option>
            </Select>

            <Select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="education">Education</option>
              <option value="travel">Travel</option>
              <option value="electronics">Electronics</option>
              <option value="vehicle">Vehicle</option>
              <option value="home">Home</option>
              <option value="investment">Investment</option>
              <option value="emergency">Emergency</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </Select>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Deadline
              </label>

              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full rounded-xl border border-[#293533] bg-[#141B1A] py-3 pl-10 pr-4 text-sm text-slate-300 outline-none focus:border-teal-500/50"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                disabled={submitting}
                rows={4}
                placeholder="What are you saving for?"
                className="w-full resize-none rounded-xl border border-[#293533] bg-[#141B1A] px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-500/50"
              />
            </div>
          </div>

          {/* IMAGE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Goal image
            </label>

            <label
              className={`flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#34413E] bg-[#141B1A] transition-colors hover:border-teal-500/40 ${
                submitting ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Goal preview"
                  className="h-48 w-full object-cover"
                />
              ):(
                <div className="flex flex-col items-center px-6 py-10 text-center">
                  <ImagePlus className="h-7 w-7 text-slate-600" />

                  <p className="mt-3 text-sm text-slate-400">Upload an image</p>
                  <p className="mt-1 text-xs text-slate-600">
                    PNG, JPG or WEBP
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="hidden"
                disabled={submitting}
              />
            </label>
          </div>

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-[#293533] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-[#293533] px-5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-[#3A4946] hover:text-slate-200 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-medium text-[#10201D] transition-colors hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {isEditing ? (
                    <>
                      <Pencil className="h-4 w-4" />
                      Update goal
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create goal
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =====================================================================
GOAL DETAILS MODAL
===================================================================== */

const GoalDetailsModal = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const { goal, goalLoading, goalError, updating } = useSelector(
    (state) => state.goals
  );

  const [contribution, setContribution] = useState("");
  const [contributionError, setContributionError] = useState("");
  const [contributing, setContributing] = useState(false);

  useEffect(() => {
    if (!open) {
      setContribution("");
      setContributionError("");
      setContributing(false);
    }
  }, [open]);

  if (!open) return null;

  const progress = getProgress(
    goal?.currentAmount,
    goal?.targetAmount
  );

  /* ================================================================
     ADD CONTRIBUTION
  ================================================================ */

  const handleAddContribution = async (event) => {
    event.preventDefault();

    setContributionError("");

    const amount = Number(contribution);

    if (!goal) {
      return;
    }

    if (Number.isNaN(amount) || amount <= 0) {
      setContributionError("Contribution must be greater than zero.");
      return;
    }

    const currentAmount = Number(goal.currentAmount || 0);
    const targetAmount = Number(goal.targetAmount || 0);

    const newAmount = currentAmount + amount;

    if (newAmount > targetAmount) {
      setContributionError(
        `You can only add ${currency(
          Math.max(targetAmount - currentAmount, 0)
        )} more to this goal.`
      );
      return;
    }

    try {
      setContributing(true);

      const formData = new FormData();

      formData.append("currentAmount", newAmount);

      await dispatch(
        updateGoal({
          id: goal._id,
          goalData: formData,
        })
      ).unwrap();

      setContribution("");

      // Refresh the goal details with the new amount.
      await dispatch(fetchGoalById(goal._id)).unwrap();
    } catch (error) {
      setContributionError(
        error?.message || "Failed to add contribution."
      );
    } finally {
      setContributing(false);
    }
  };

  const isSubmitting = contributing || updating;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div 
           className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#293533] bg-[#171F1E] shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-[#293533] px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
              Goal details
            </p>

            <h2 className="mt-1 text-lg font-semibold text-slate-100">
              {goalLoading ? "Loading..." : goal?.goalName || "Goal"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-[#1F2927] hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* LOADING */}

        {goalLoading && (
          <div className="space-y-4 p-5">
            <div className="h-44 animate-pulse rounded-xl bg-[#141B1A]" />

            <div className="h-5 w-40 animate-pulse rounded bg-[#24302D]" />

            <div className="h-3 animate-pulse rounded bg-[#24302D]" />
          </div>
        )}

        {/* ERROR */}

        {!goalLoading && goalError && (
          <div className="p-8 text-center">
            <p className="text-sm text-red-400">
              {goalError}
            </p>
          </div>
        )}

        {/* CONTENT */}

        {!goalLoading && !goalError && goal && (
          <div style={{ scrollbarWidth: 'none'}}
               className="max-h-[75vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">

            {/* IMAGE */}

            {goal.image ? (
              <img
                src={goal.image}
                alt={goal.goalName}
                className="h-52 w-full object-cover"
              />
            ) : (
              <div className="flex h-36 items-center justify-center bg-[#141B1A]">
                <Target className="h-10 w-10 text-slate-700" />
              </div>
            )}

            <div className="space-y-5 p-5">

              {/* TITLE + BADGES */}

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={goal.status} />

                  <PriorityBadge priority={goal.priority} />

                  {goal.category && (
                    <span className="rounded-full border border-[#34413E] bg-[#141B1A] px-2.5 py-1 text-[11px] capitalize text-slate-500">
                      {goal.category}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-xl font-semibold text-slate-100">
                  {goal.goalName}
                </h3>

                {goal.description && (
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {goal.description}
                  </p>
                )}
              </div>

              {/* PROGRESS */}

              <div className="rounded-xl border border-[#293533] bg-[#141B1A] p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-slate-600">
                      Saved
                    </p>

                    <p className="mt-1 text-xl font-semibold text-slate-100">
                      {currency(goal.currentAmount)}
                    </p>
                  </div>

                  <p className="text-xs text-slate-500">
                    of {currency(goal.targetAmount)}
                  </p>
                </div>

                <div className="mt-4">
                  <ProgressBar progress={progress} />
                </div>

                <div className="mt-2 flex justify-between">
                  <span className="text-[11px] text-slate-600">
                    {progress.toFixed(0)}% complete
                  </span>

                  <span className="text-[11px] text-slate-600">
                    {currency(
                      Math.max(
                        Number(goal.targetAmount || 0) -
                          Number(goal.currentAmount || 0),
                        0
                      )
                    )}{" "}
                    remaining
                  </span>
                </div>
              </div>

              {/* INFO */}

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-[#293533] bg-[#141B1A] p-4">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-teal-400" />

                    <p className="text-xs text-slate-600">
                      Target
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-200">
                    {currency(goal.targetAmount)}
                  </p>
                </div>

                <div className="rounded-xl border border-[#293533] bg-[#141B1A] p-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-teal-400" />

                    <p className="text-xs text-slate-600">
                      Deadline
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-200">
                    {formatDate(goal.deadline)}
                  </p>
                </div>

              </div>

              {/* ======================================================
                  ADD CONTRIBUTION
              ====================================================== */}

              {goal.status !== "completed" &&
                Number(goal.currentAmount || 0) <
                  Number(goal.targetAmount || 0) && (
                <form
                  onSubmit={handleAddContribution}
                  className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10">
                      <Plus className="h-4 w-4 text-teal-400" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Add contribution
                      </p>

                      <p className="text-xs text-slate-600">
                        Add money directly to this goal
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-600">
                        ₹
                      </span>

                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={contribution}
                        onChange={(event) => {
                          setContribution(event.target.value);
                          setContributionError("");
                        }}
                        placeholder="Enter amount"
                        disabled={isSubmitting}
                        className="w-full rounded-xl border border-[#293533] bg-[#141B1A] py-3 pl-8 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !contribution ||
                        Number(contribution) <= 0
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-sm font-medium text-[#10201D] transition-colors hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add
                        </>
                      )}
                    </button>
                  </div>

                  {contributionError && (
                    <p className="mt-2 text-xs text-red-400">
                      {contributionError}
                    </p>
                  )}

                  <p className="mt-3 text-[11px] text-slate-600">
                    Remaining:{" "}
                    {currency(
                      Math.max(
                        Number(goal.targetAmount || 0) -
                          Number(goal.currentAmount || 0),
                        0
                      )
                    )}
                  </p>
                </form>
              )}

              {/* CLOSE */}

              <div className="border-t border-[#293533] pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-[#293533] px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-[#3A4946] hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
/* =====================================================================
PAGE
===================================================================== */

const Goals = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { goals, loading, error, creating, updating, deleting, pagination } =
    useSelector((state) => state.goals);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  /* ================================================================
       FETCH
    ================================================================ */

  useEffect(() => {
    dispatch(
      fetchGoals({
        page,
        limit: 12,
        sort,
        order,
        status,
        search: search.trim(),
      }),
    );
  }, [dispatch, page, sort, order, status, search]);

  /* ================================================================
       SUMMARY
    ================================================================ */

  const summary = useMemo(() => {
    const activeGoals = goals.filter((goal) => goal.status === "active");

    const completedGoals = goals.filter((goal) => goal.status === "completed");

    const totalSaved = goals.reduce(
      (sum, goal) => sum + Number(goal.currentAmount || 0),
      0,
    );

    return {
      active: activeGoals.length,
      completed: completedGoals.length,
      saved: totalSaved,
    };
  }, [goals]);

  /* ================================================================
       OPEN CREATE
    ================================================================ */

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setModalOpen(true);
  };

  /* ================================================================
       OPEN EDIT
    ================================================================ */

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setModalOpen(true);
  };

  /* ================================================================
       CLOSE MODAL
    ================================================================ */

  const handleCloseModal = () => {
    if (creating || updating) return;

    setModalOpen(false);
    setEditingGoal(null);
  };

  /* ================================================================
       CREATE / UPDATE
    ================================================================ */

  const handleSubmitGoal = async (formData, goalId) => {
    if (goalId) {
      await dispatch(
        updateGoal({
          id: goalId,
          goalData: formData,
        }),
      ).unwrap();
      toast.success("Goal updated.");
    } else {
      await dispatch(createGoal(formData)).unwrap();
      toast.success("Goal created.");
    }

    setModalOpen(false);
    setEditingGoal(null);

    await dispatch(
      fetchGoals({
        page,
        limit: 12,
        sort,
        order,
        status,
        search: search.trim(),
      }),
    ).unwrap();
  };

  /* ================================================================
       DELETE
    ================================================================ */

  const handleDeleteGoal = async (goal) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${goal.goalName}"?`,
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteGoal(goal._id)).unwrap();

      toast.success("Goal deleted.");

      /*
       * If the deleted goal was the last item
       * on the current page, move back one page.
       */

      if (goals.length === 1 && page > 1) {
        setPage((current) => Math.max(current - 1, 1));

        return;
      }

      await dispatch(
        fetchGoals({
          page,
          limit: 12,
          sort,
          order,
          status,
          search: search.trim(),
        }),
      ).unwrap();
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to delete goal. Please try again."
      );
    }
  };

  const handleViewDetails = async (goalId) => {
    setDetailsOpen(true);

    try {
      await dispatch(fetchGoalById(goalId)).unwrap();
    } catch (error) {
      console.error("Failed to fetch goal details:", error);
    }
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    dispatch(clearGoal());
  };

  /* ================================================================
       LOADING
    ================================================================ */

  if (loading && goals.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-4 w-24 animate-pulse rounded bg-[#24302D]" />

        <div className="h-10 w-64 animate-pulse rounded bg-[#24302D]" />

        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl bg-[#171F1E]"
            />
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl bg-[#171F1E]"
            />
          ))}
        </div>
      </div>
    );
  }

  /* ================================================================
       ERROR
    ================================================================ */

  if (error && goals.length === 0) {
    return (
      <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-10 text-center">
        <p className="text-sm text-red-400">{error}</p>

        <button
          type="button"
          onClick={() =>
            dispatch(
              fetchGoals({
                page,
                limit: 12,
                sort,
                order,
                status,
                search: search.trim(),
              }),
            )
          }
          className="mt-5 text-sm text-teal-400 transition-colors hover:text-teal-300"
        >
          Try again →
        </button>
      </div>
    );
  }

  /* ================================================================
       PAGE
    ================================================================ */

  return (
    <div>
      {/* HEADER */}

      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-teal-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </button>

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Financial goals
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
              Your goals
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Track what you're saving for and see how close you are to reaching
              each goal.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-medium text-[#10201D] transition-colors hover:bg-teal-400"
          >
            <Plus className="h-4 w-4" />
            New goal
          </button>
        </div>
      </div>

      {/* SUMMARY */}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-5">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-slate-500" />

            <p className="text-sm text-slate-400">Active goals</p>
          </div>

          <p className="mt-3 text-2xl font-semibold text-slate-100">
            {summary.active}
          </p>
        </div>

        <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-slate-500" />

            <p className="text-sm text-slate-400">Completed</p>
          </div>

          <p className="mt-3 text-2xl font-semibold text-teal-400">
            {summary.completed}
          </p>
        </div>

        <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-5">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-slate-500" />

            <p className="text-sm text-slate-400">Saved toward goals</p>
          </div>

          <p className="mt-3 text-2xl font-semibold text-slate-100">
            {currency(summary.saved)}
          </p>
        </div>
      </section>

      {/* CONTROLS */}

      <section className="mt-6 rounded-2xl border border-[#293533] bg-[#171F1E] p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search goals..."
              className="w-full rounded-xl border border-[#293533] bg-[#141B1A] py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-500/50"
            />
          </div>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-[#293533] bg-[#141B1A] px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-teal-500/50"
          >
            <option value="">All statuses</option>

            <option value="active">Active</option>

            <option value="completed">Completed</option>
          </select>

          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-[#293533] bg-[#141B1A] px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-teal-500/50"
          >
            <option value="createdAt">Recently created</option>

            <option value="targetAmount">Target amount</option>

            <option value="goalName">Goal name</option>

            <option value="status">Status</option>
          </select>

          <select
            value={order}
            onChange={(event) => {
              setOrder(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-[#293533] bg-[#141B1A] px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-teal-500/50"
          >
            <option value="desc">Descending</option>

            <option value="asc">Ascending</option>
          </select>
        </div>
      </section>

      {/* GOALS */}

      <section className="mt-6">
        {goals.length === 0 ? (
          <EmptyState onCreate={handleOpenCreate} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {goals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteGoal}
                onViewDetails={handleViewDetails}
                deleting={deleting}
              />
            ))}
          </div>
        )}
      </section>

      {/* PAGINATION */}

      {pagination.totalPages > 1 && (
        <section className="mt-8 flex items-center justify-between border-t border-[#293533] pt-5">
          <p className="text-xs text-slate-600">
            Page {pagination.currPage} of {pagination.totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!pagination.hasPreviousPage}
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#293533] text-slate-400 transition-colors hover:border-[#3A4946] hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((current) => current + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#293533] text-slate-400 transition-colors hover:border-[#3A4946] hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* CREATE / EDIT MODAL */}

      <GoalFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitGoal}
        submitting={creating || updating}
        editingGoal={editingGoal}
      />
      <GoalDetailsModal
        open={detailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default Goals;