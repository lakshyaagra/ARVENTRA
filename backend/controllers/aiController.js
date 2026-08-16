const Income = require("../models/Income");
const Expense = require("../models/Expense");
const Goal = require("../models/Goal");
const Loan = require("../models/Loan");
const Asset = require("../models/Assets");
const AIConversation = require("../models/AIConversation");

const financialAnalyzer = require("../services/financialAnalyzer");
const promptBuilder = require("../services/promptBuilder");
const aiService = require("../services/aiService");

const generateConversationTitle = (message) => {
    const cleaned = message
        .replace(/\s+/g, " ")
        .trim();

    if (!cleaned) {
        return "New Conversation";
    }
    if (cleaned.length <= 50) {
        return cleaned;
    }
    return cleaned.slice(0, 47) + "...";
};

const chatWithAI = async (req,res)=>{
    try{
        const { message,conversationId } = req.body;
        if(!message){
            return res.status(400).json({
                success:false,
                message:"Message is required"
            });
        }

        const [income, expenses, goals, loans, assets] = await Promise.all([
            Income.find({ user: req.user.id }),
            Expense.find({ user: req.user.id }),
            Goal.find({ user: req.user.id }),
            Loan.find({ user: req.user.id }),
            Asset.find({ user: req.user.id })
        ]);

        const analysis = financialAnalyzer({income,expenses,goals,loans,assets});
        
        // const prompt = promptBuilder(analysis,conversation.messages,message); 
        //message is the req.body from user and not the above array of messages
        const { systemPrompt, financialContext } = promptBuilder(analysis);

        let conversation=await AIConversation.findOne({
            user: req.user.id,
            _id: conversationId,
        });
        if (!conversation) {
            const title = generateConversationTitle(message);
            conversation=await AIConversation.create({
                user: req.user.id,
                messages: [],
                title,
            });
        }

        const history = conversation.messages.slice(-10);
        const messages=[
            {
                role: "system",
                content:`${systemPrompt}

            ${financialContext}
            Conversation Summary:
            ${conversation.summary || "No previous summary available."}
            `
            },
            ...history,
            {
                role:"user",
                content: message
            }
        ];

        const aiReply = await aiService(messages);
        conversation.messages.push({
            role: "user",
            content: message
        });
        conversation.messages.push({
            role: "assistant",
            content: aiReply
        });
        if(conversation.messages.length >= 20 &&
            conversation.messages.length % 10 === 0){

                const summaryMessages = [
                    {
                        role: "system",
                        content: `
    You are maintaining memory for Project Udaan AI.
    
    Update the existing conversation summary.

    Maximum 250 words.

    Current Summary:

    ${conversation.summary}

    Keep only useful long-term information.

    Include:

    • User financial goals
    • Income details
    • Spending behaviour
    • Investments
    • Assets
    • Loans
    • Risk appetite
    • Preferences
    • Important financial facts

    Do not include greetings or small talk.

    Always base answers on BOTH:

    1. Current Financial Summary
    2. Conversation Summary

    If they conflict, trust Current Financial Summary.

    Never invent missing values.
    `
                    },

                    ...conversation.messages.slice(-20)

                ];

                try{
                    const updatedSummary = await aiService(summaryMessages);
                    conversation.summary = updatedSummary;
                }
                catch(err){
                    console.log("Summary Generation failed.")
                }

            }
        //Keep last 100 messages only
        if(conversation.messages.length > 100) {
            conversation.messages = conversation.messages.slice(-100);
        }
        await conversation.save();
        return res.status(200).json({
            success: true,
            reply: aiReply,
            conversationId: conversation._id,
            title: conversation.title,
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const getConversations = async (req, res) => {
    try {
        const conversations = await AIConversation.find({
            user: req.user.id,
        })
            .select("_id title createdAt updatedAt")
            .sort({ updatedAt: -1 })
            .limit(20);

        return res.status(200).json({
            success: true,
            conversations,
        });
    } catch (err) {
        console.error("GET AI CONVERSATIONS ERROR:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to load conversations.",
        });
    }
};
const getConversationById = async (req, res) => {
    try {
        const conversation = await AIConversation.findOne({
            _id: req.params.conversationId,
            user: req.user.id,
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found.",
            });
        }

        return res.status(200).json({
            success: true,
            conversation,
        });
    } catch (err) {
        console.error("GET AI CONVERSATION ERROR:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to load conversation.",
        });
    }
};

module.exports={chatWithAI,getConversations,getConversationById};