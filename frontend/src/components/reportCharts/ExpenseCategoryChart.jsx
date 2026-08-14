import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpenseCategoryChart = ({ expenseCategory = [] }) => {
  const labels = expenseCategory.map(
    (item) => item._id || "Other"
  );
  const expenseData = expenseCategory.map(
    (item) => item.totalAmount || 0
  );
  const chartData = {
    labels,
    datasets: [
      {
        label: "Expense",
        data: expenseData,

        backgroundColor: "#14B8A6",
        borderColor: "#14B8A6",

        borderWidth: 1,
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  const chartOptions = {
    responsive: true,

    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `₹${Number(
              context.raw || 0
            ).toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748B",
        },
        border: {
          color: "#293533",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#293533",
        },
        ticks: {
          color: "#64748B",
          callback: (value) =>
            `₹${Number(value).toLocaleString("en-IN")}`,
        },
        border: {
          display: false,
        },
      },
    },
  };

  if (expenseCategory.length === 0) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-xl border border-dashed border-[#293533]">
        <p className="text-sm text-slate-600">
          No expense category data available yet.
        </p>
      </div>
    );
  }

  return (
    <Bar
      data={chartData}
      options={chartOptions}
    />
  );
};

export default ExpenseCategoryChart;