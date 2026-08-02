const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
const aiService = async (messages) => {
    try {
        const contents = messages.map(msg => {
            let role = "user";
            if (msg.role === "assistant") {
                role = "model";
            }
            if (msg.role === "system") {
                role = "user";
            }
            return {
                role,
                parts: [
                    {
                        text: msg.content
                    }
                ]
            };
        });

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents,
            config: {
                temperature: 0.2,
                topP: 0.8,
                topK: 20,
                maxOutputTokens: 700
            }
        });
        return response.text;
    }catch(err){
        throw err;
    }
};
module.exports = aiService;



// const OpenAI=require('openai');
// const client=new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });

// const aiService = async (messages) => {
//     try{
//         const response = await client.responses.create({
//             model:"gpt-5-mini",
//             input: messages,
//             reasoning: {
//                 effort: "low"
//             },
//             max_output_tokens: 500,
//         });
//         return response.output_text;
//     }
//     catch(err){
//         throw err;
//     }
// };
// module.exports=aiService