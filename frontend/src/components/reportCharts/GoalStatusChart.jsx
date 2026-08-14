import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const GoalStatusChart = ({ goalStatus = [] }) => {
    const labels = goalStatus.map(
        (item) => item._id || "Other"
    );

    const goalData = goalStatus.map(
        (item) => item.totalGoals || 0
    );

    const chartData = {
        labels,
        datasets: [
            {
                label: "Goals",
                data: goalData,
                backgroundColor: [
                    "#14B8A6",
                    "#2DD4BF",
                    "#64748B",
                    "#334155",
                ],
                borderColor: "#171F1E",
                borderWidth: 3,
                hoverOffset: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#94A3B8",
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: "circle",
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return ` ${context.raw} goals`;
                    },
                },
            },
        },
    };
    return (
        <div>
            {goalStatus.length > 0 ? (
                <div className="h-72">
                    <Doughnut
                        data={chartData}
                        options={chartOptions}
                    />
                </div>
            ) : (
                <div className="flex min-h-56 items-center justify-center rounded-xl border border-dashed border-[#293533]">
                    <p className="text-sm text-slate-600">
                        No goal status data available yet.
                    </p>
                </div>
            )}
        </div>
    );
};
export default GoalStatusChart;