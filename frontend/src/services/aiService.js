import api from "../api/axios";

const chatWithAI = async (message) => {
    const response = await api.post("/ai/chat", {
        message,
    });

    return response.data;
};

const aiService = {
    chatWithAI,
};

export default aiService;