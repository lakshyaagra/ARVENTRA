const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
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
                    text: msg.content,
                },
            ],
        }));

        const config = {
            temperature: 0.4,
            topP: 0.9,
            topK: 30,

            // Give Arventra AI enough room for a proper answer.
            maxOutputTokens: 3000,

            // Gemini 3.x supports controlling thinking level.
            thinkingConfig: {
                thinkingLevel: "medium",
            },
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
            config,
        });

        const candidate = response.candidates?.[0];

        return response.text;
    } catch (err) {
        console.error("ARVENTRA AI ERROR:", err);
        throw err;
    }
};

module.exports = aiService;