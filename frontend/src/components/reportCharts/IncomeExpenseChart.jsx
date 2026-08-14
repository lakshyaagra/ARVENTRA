import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const IncomeExpenseChart = ({ incomeReport = [], expenseReport = [] }) => {
  /*
   * Combine income and expense months.
   */
  const monthMap = new Map();

  incomeReport.forEach((item) => {
    const key = `${item._id.year}-${item._id.month}`;

    monthMap.set(key, {
      year: item._id.year,
      month: item._id.month,
      income: item.totalIncome,
      expense: 0,
    });
  });

  expenseReport.forEach((item) => {
    const key = `${item._id.year}-${item._id.month}`;

    if (monthMap.has(key)) {
      monthMap.get(key).expense = item.totalExpense;
    } else {
      monthMap.set(key, {
        year: item._id.year,
        month: item._id.month,
        income: 0,
        expense: item.totalExpense,
      });
    }
  });

  /*
   * Sort chronologically.
   */
  const monthlyData = Array.from(monthMap.values()).sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }

    return a.month - b.month;
  });

  /*
   * Chart labels.
   */
  const labels = monthlyData.map((item) => {
    return `${item.month}/${item.year}`;
  });

  /*
   * Income values.
   */
  const incomeData = monthlyData.map((item) => {
    return item.income;
  });

  /*
   * Expense values.
   */
  const expenseData = monthlyData.map((item) => {
    return item.expense;
  });

  /*
   * Chart data.
   */
  const chartData = {
    labels,

    datasets: [
      {
        label: "Income",
        data: incomeData,

        borderColor: "#2DD4BF",
        backgroundColor: "rgba(45, 212, 191, 0.12)",

        pointBackgroundColor: "#2DD4BF",
        pointBorderColor: "#171F1E",

        pointRadius: 3,
        pointHoverRadius: 5,

        borderWidth: 2,

        tension: 0.3,

        fill: false,
      },

      {
        label: "Expense",
        data: expenseData,

        borderColor: "#94A3B8",
        backgroundColor: "rgba(148, 163, 184, 0.08)",

        pointBackgroundColor: "#94A3B8",
        pointBorderColor: "#171F1E",

        pointRadius: 3,
        pointHoverRadius: 5,

        borderWidth: 2,

        tension: 0.3,

        fill: false,
      },
    ],
  };

  /*
   * Chart options.
   */
  const chartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",

        align: "end",

        labels: {
          color: "#94A3B8",

          usePointStyle: true,

          pointStyle: "circle",

          boxWidth: 8,

          padding: 20,

          font: {
            size: 12,
          },
        },
      },

      title: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#121817",
        borderColor: "#293533",
        borderWidth: 1,
        titleColor: "#F1F5F9",
        bodyColor: "#CBD5E1",
        padding: 12,
        displayColors: true,

        callbacks: {
          label: (context) => {
            const value = Number(context.raw || 0).toLocaleString("en-IN");
            return `${context.dataset.label}: ₹${value}`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          color: "rgba(41, 53, 51, 0.45)",
          drawBorder: false,
        },

        ticks: {
          color: "#64748B",
          font: {
            size: 11,
          },
        },

        border: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(41, 53, 51, 0.45)",
          drawBorder: false,
        },
        ticks: {
          color: "#64748B",
          font: {
            size: 11,
          },

          callback: (value) => {
            return `₹${Number(value).toLocaleString("en-IN")}`;
          },
        },

        border: {
          display: false,
        },
      },
    },
  };

  /*
   * Empty state.
   */
  if (monthlyData.length === 0) {
    return (
      <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-7">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Overview
        </p>

        <h2 className="mt-2 text-xl font-medium text-slate-100">
          Income vs Expense
        </h2>

        <div className="mt-7 flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-[#293533] px-5 text-center">
          <p className="text-sm leading-6 text-slate-500">
            Add income and expenses to start seeing your monthly cash flow.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#293533] bg-[#171F1E] p-7">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Overview
          </p>

          <h2 className="mt-2 text-xl font-medium text-slate-100">
            Income vs Expense
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Monthly income and spending over time.
          </p>
        </div>

        <span className="shrink-0 text-xs text-slate-600">Monthly</span>
      </div>

      {/* CHART */}

      <div className="mt-7 h-70">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default IncomeExpenseChart;
