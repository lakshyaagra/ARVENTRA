const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const aiService = async (messages, jsonMode = false) => {
    try {
        const systemMessage = messages.find(
            (msg) => msg.role === "system"
        );
        const userMessages = messages.filter(
            (msg) => msg.role !== "system"
        );
        const contents = userMessages.map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [
                {
                    text: msg.content
                }
            ]
        }));
        const config = {
            temperature: 0.2,
            topP: 0.8,
            topK: 20,
            maxOutputTokens: 700
        };
        if (jsonMode) {
            config.responseMimeType = "application/json";
        }

        if (systemMessage) {
            config.systemInstruction = systemMessage.content;
        }
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents,
            config
        });
        return response.text;
    }
    catch (err) {
        throw err;
    }
};

module.exports = aiService;