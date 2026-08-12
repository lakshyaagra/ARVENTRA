import api from "../api/axios";

const getExpenses = async ({
    page = 1,
    limit = 15,
    sort = "createdAt",
    order = "desc",
    category,
    search,
} = {}) => {
    const response = await api.get("/expenses", {
        params: {
            page,
            limit,
            sort,
            order,
            ...(category ? { category } : {}),
            ...(search ? { search } : {}),
        },
    });
    return response.data;
};

const getExpenseById = async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
};

const createExpense = async (expenseData) => {
    const response = await api.post("/expenses", expenseData);
    return response.data;
};

const updateExpense = async (id, expenseData) => {
    const response = await api.put(
        `/expenses/${id}`,
        expenseData
    );
    return response.data;
};

const deleteExpense = async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
};

export default {
    getExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
};