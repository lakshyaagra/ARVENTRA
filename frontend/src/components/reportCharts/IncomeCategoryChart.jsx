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

const IncomeCategoryChart = ({ incomeCategory = [] }) => {
  const labels = incomeCategory.map(
    (item) => item._id || "Other"
  );
  const incomeData = incomeCategory.map(
    (item) => item.totalAmount || 0
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,

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
  if (incomeCategory.length === 0) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-xl border border-dashed border-[#293533]">
        <p className="text-sm text-slate-600">
          No income category data available yet.
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
export default IncomeCategoryChart;