const cron = require("node-cron");

const User = require("../models/User");
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const Goal = require("../models/Goal");
const Loan = require("../models/Loan");
const Asset = require("../models/Assets");

const financialAnalyzer = require("../services/financialAnalyzer");
const aiNotificationPromptBuilder = require("../services/aiNotificationPromptBuilder");
const aiService = require("../services/aiService");
const { createNotification } = require("../services/notificationService");

cron.schedule("30 9 * * *", async () => {
    try {
        const users = await User.find();
        const today = new Date().toISOString().split("T")[0];

        for (const user of users) {
            if (user.lastAINotificationDate === today) {
                continue;
            }
            const [income, expenses, goals, loans, assets] =
                await Promise.all([
                    Income.find({ user: user._id }),
                    Expense.find({ user: user._id }),
                    Goal.find({ user: user._id }),
                    Loan.find({ user: user._id }),
                    Asset.find({ user: user._id })
                ]);

            const analysis = financialAnalyzer({income,expenses,goals,loans,assets});

            const { systemPrompt, financialContext } = aiNotificationPromptBuilder(analysis);
            const messages = [
                {
                    role: "system",
                    content: `${systemPrompt}

${financialContext}`
                }
            ];
            try {
                try{
                    const response = await aiService(messages,true);
                    const aiNotification = JSON.parse(response);
                }
                catch(err){
                    console.log(
                        `Invalid AI response for user ${user._id}`
                    );
                    continue;
                }

                if (typeof aiNotification.title === "string" && typeof aiNotification.message === "string"
                    && aiNotification.title.trim() !== "" && aiNotification.message.trim() !== "") {
                        await createNotification({
                            user: user._id,
                            title: aiNotification.title,
                            message: aiNotification.message,
                            type: "ai"
                        });
                        user.lastAINotificationDate = today;
                        await user.save();
                }
            }
            catch (err) {
                console.log(
                    `AI Notification Failed for User ${user._id}`
                );
            }
        }
        console.log("✅ Daily AI Smart Notification Cron Executed");
    }
    catch (err) {
        console.log(err.message);
    }

});