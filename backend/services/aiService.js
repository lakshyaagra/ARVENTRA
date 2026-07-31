const OpenAI=require('openai');
const client=new OpenAI({
    apikey= process.env.OPENAI_API_KEY
})

const aiService = async (prompt) => {
    try{
        const response = await client.responses.create({
            model:"gpt-5-mini",
            input: prompt,
            temperature: 0.2,
            max_output_tokens: 500,
        });
        return response.output_text;
    }
    catch(err){
        throw err;
    }
};
module.exports=aiService