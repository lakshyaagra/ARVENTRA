import api from "../api/axios";

const getSummaryReport = async ({ month, year } = {}) => {
    const response = await api.get("/reports/summary", {
        params: {
            ...(month ? { month } : {}),
            ...(year ? { year } : {}),
        },
    });

    return response.data;
};

const getIncomeCategoryReport = async ({ month, year } = {}) => {
    const response = await api.get("/reports/income-category", {
        params: {
            ...(month ? { month } : {}),
            ...(year ? { year } : {}),
        },
    });

    return response.data;
};

const getExpenseCategoryReport = async ({ month, year } = {}) => {
    const response = await api.get("/reports/expense-category", {
        params: {
            ...(month ? { month } : {}),
            ...(year ? { year } : {}),
        },
    });

    return response.data;
};

const getMonthlyIncomeReport = async () => {
    const response = await api.get("/reports/monthly-income");
    return response.data;
};

const getMonthlyExpenseReport = async () => {
    const response = await api.get("/reports/monthly-expense");
    return response.data;
};

const getLoanStatusReport = async () => {
    const response = await api.get("/reports/loan-status");
    return response.data;
};

const getGoalStatusReport = async () => {
    const response = await api.get("/reports/goal-status");
    return response.data;
};

export default {
    getSummaryReport,
    getIncomeCategoryReport,
    getExpenseCategoryReport,
    getMonthlyIncomeReport,
    getMonthlyExpenseReport,
    getLoanStatusReport,
    getGoalStatusReport,
};