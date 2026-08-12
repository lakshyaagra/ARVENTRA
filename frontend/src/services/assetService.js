import api from "../api/axios";

const getAssets = async ({
    page = 1,
    limit = 15,
    sort = "createdAt",
    order = "desc",
    category,
    search,
} = {}) => {
    const response = await api.get("/assets", {
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

const getAssetById = async (id) => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
};

const createAsset = async (assetData) => {
    const response = await api.post("/assets", assetData);
    return response.data;
};

const updateAsset = async (id, assetData) => {
    const response = await api.put(
        `/assets/${id}`,
        assetData
    );
    return response.data;
};

const deleteAsset = async (id) => {
    const response = await api.delete(`/assets/${id}`);
    return response.data;
};

export default {
    getAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset,
};