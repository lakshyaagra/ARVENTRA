import React from "react";
import { Calculator as CalculatorIcon, RotateCcw } from "lucide-react";

const CalculatorForm = ({
  calculator,
  values,
  onChange,
  onCalculate,
  onReset,
  loading,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onCalculate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div className="flex items-center gap-3 border-b border-[#293533] pb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10">
          <CalculatorIcon className="h-4 w-4 text-teal-400" />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-200">
            Enter your numbers
          </p>

          <p className="text-xs text-slate-600">
            Change the values to explore different outcomes.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">

        {calculator.fields.map((field) => (
          <div key={field.name}>

            <label className="mb-2 block text-xs font-medium text-slate-400">
              {field.label}
            </label>

            {field.type === "select" ? (
              <select
                value={values[field.name] ?? ""}
                onChange={(event) =>
                  onChange(field.name, event.target.value)
                }
                className="w-full rounded-xl border border-[#293533] bg-[#141B1A]
                           px-4 py-3 text-sm text-slate-200 outline-none transition
                         focus:border-teal-500/50"
              >
                {field.options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="relative">

                {field.prefix && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-600">
                    {field.prefix}
                  </span>
                )}

                <input
                  type={field.type || "number"}
                  value={values[field.name] ?? ""}
                  onChange={(event) =>
                    onChange(field.name, event.target.value)
                  }
                  placeholder={field.placeholder}
                  min="0"
                  step="any"
                  className={`w-full rounded-xl border border-[#293533] bg-[#141B1A] py-3 text-sm text-slate-200 outline-none placeholder:text-slate-700 transition focus:border-teal-500/50 ${
                    field.prefix ? "pl-9" : "pl-4"
                  } ${
                    field.suffix ? "pr-16" : "pr-4"
                  }`}
                />

                {field.suffix && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-600">
                    {field.suffix}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

      </div>

      <div className="flex gap-3 pt-2">

        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-[#0E1514] transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Calculating..." : "Calculate"}
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#293533] px-4 py-3 text-sm text-slate-500 transition hover:border-[#40504D] hover:text-slate-300 disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>

      </div>

    </form>
  );
};

export default CalculatorForm;