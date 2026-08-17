import React from "react";
import { TrendingUp } from "lucide-react";

const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value));
};

const CalculatorResult = ({ calculator, result }) => {
  if (!result) {
    return (
      <div className="mt-6 rounded-xl border border-[#293533] bg-[#141B1A] p-5">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-4 w-4 text-slate-700" />

          <p className="text-xs text-slate-600">
            Your calculation result will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-[#293533] pt-6">

      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
        Result
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">

        {calculator.results.map((item) => (
          <div
            key={item.key}
            className={`rounded-xl border p-4 ${
              item.primary
                ? "border-teal-500/20 bg-teal-500/5 sm:col-span-2"
                : "border-[#293533] bg-[#141B1A]"
            }`}
          >
            <p className="text-xs text-slate-600">
              {item.label}
            </p>

            <p
              className={`mt-2 font-semibold ${
                item.primary
                  ? "text-2xl text-teal-400"
                  : "text-base text-slate-200"
              }`}
            >
              {item.currency
                ? formatCurrency(result[item.key])
                : `${result[item.key]}${item.suffix || ""}`}
            </p>
          </div>
        ))}

      </div>

      <p className="mt-4 text-[11px] leading-5 text-slate-600">
        This result is an estimate based on the values you entered.
        Actual financial outcomes may differ.
      </p>

    </div>
  );
};

export default CalculatorResult;