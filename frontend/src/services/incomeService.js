import api from "../api/axios";

const getIncomes = async ({
    page = 1,
    limit = 15,
    sort = "createdAt",
    order = "desc",
    category,
    search,
} = {}) => {
    const response = await api.get("/income", {
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

const getIncomeById = async (id) => {
    const response = await api.get(`/income/${id}`);

    return response.data;
};

const createIncome = async (incomeData) => {
    const response = await api.post("/income", incomeData);

    return response.data;
};

const updateIncome = async (id, incomeData) => {
    const response = await api.put(
        `/income/${id}`,
        incomeData
    );

    return response.data;
};

const deleteIncome = async (id) => {
    const response = await api.delete(`/income/${id}`);

    return response.data;
};

export default {
    getIncomes,
    getIncomeById,
    createIncome,
    updateIncome,
    deleteIncome,
};