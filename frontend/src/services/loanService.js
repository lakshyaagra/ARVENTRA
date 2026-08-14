import api from "../api/axios";

const getLoans = async ({
    page = 1,
    limit = 15,
    sort = "createdAt",
    order = "desc",
    status,
    search,
} = {}) => {
    const response = await api.get("/loans", {
        params: {
            page,
            limit,
            sort,
            order,
            ...(status ? { status } : {}),
            ...(search ? { search } : {}),
        },
    });

    return response.data;
};

const getLoanById = async (id) => {
    const response = await api.get(`/loans/${id}`);

    return response.data;
};

const createLoan = async (loanData) => {
    const response = await api.post("/loans", loanData);

    return response.data;
};

const updateLoan = async (id, loanData) => {
    const response = await api.put(`/loans/${id}`, loanData);

    return response.data;
};

const deleteLoan = async (id) => {
    const response = await api.delete(`/loans/${id}`);

    return response.data;
};

export default {
    getLoans,
    getLoanById,
    createLoan,
    updateLoan,
    deleteLoan,
};