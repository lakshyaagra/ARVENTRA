import api from "../api/axios";

const chatWithAI = async ({message,conversationId}) => {
    const response = await api.post("/ai/chat", {
        message,
        conversationId,
    });

    return response.data;
};
const getConversations = async () => {
    const response = await api.get("/ai/conversations");
    return response.data;
};

const getConversationById = async (conversationId) => {
    const response = await api.get(
        `/ai/conversations/${conversationId}`
    );
    return response.data;
};

const aiService = {
    chatWithAI,getConversations,getConversationById
};

export default aiService;