import api from "../api/axios";

const getCreditHealth = async () => {
    const response = await api.get("/credit-health");
    return response.data;
};

export default { getCreditHealth };