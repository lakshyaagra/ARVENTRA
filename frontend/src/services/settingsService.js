import api from "../api/axios";

const getSettings = async () => {
    const response = await api.get("/settings");

    return response.data;
};

const updateSettings = async (settingsData) => {
    const response = await api.patch("/settings", settingsData);

    return response.data;
};

export default {
    getSettings,
    updateSettings,
};