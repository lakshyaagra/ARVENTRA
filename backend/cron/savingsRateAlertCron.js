const cron = require("node-cron");

const User = require("../models/User");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

const { createNotification } = require("../services/notificationService");

cron.schedule("0 8 * * *", async () => {
    try {
        const users = await User.find();
        const now = new Date();

        const monthStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const monthEnd = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999
        );

        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        for (const user of users) {
            const incomes = await Income.find({
                user: user._id,
                receivedDate: {
                    $gte: monthStart,
                    $lte: monthEnd
                }
            });
            const expenses = await Expense.find({
                user: user._id,
                expenseDate: {
                    $gte: monthStart,
                    $lte: monthEnd
                }
            });
            const totalIncome = incomes.reduce(
                (sum, income) => sum + income.amount,
                0
            );
            const totalExpense = expenses.reduce(
                (sum, expense) => sum + expense.amount,
                0
            );

            if (totalIncome === 0) continue;
            
            const monthlySavings = totalIncome - totalExpense;

            const savingsRate =
                (monthlySavings / totalIncome) * 100;

            let level = null;
            let title = "";
            let message = "";

            if (monthlySavings < 0) {
                level = "overspending";
                title = "❌ Overspending Alert";
                message =
                    "Your expenses have exceeded your income this month. Review your spending to regain financial balance.";
            }
            else if (savingsRate < 10) {
                level = "critical";
                title = "🚨 Critical Savings Alert";
                message =
                    `Your savings rate is only ${savingsRate.toFixed(1)}%. Try reducing non-essential expenses.`;
            }
            else if (savingsRate < 20) {
                level = "warning";
                title = "⚠️ Savings Alert";
                message =
                    `Your savings rate is ${savingsRate.toFixed(1)}%. Consider increasing your monthly savings.`;
            }

            if (!level) continue;

            if (user.lastSavingsAlertMonth === currentMonthKey &&
                user.lastSavingsAlertLevel === level){
                continue;
            }
            await createNotification({
                user: user._id,
                title,
                message,
                type: "ai"
            });
            user.lastSavingsAlertMonth = currentMonthKey;
            user.lastSavingsAlertLevel = level;
            await user.save();
        }
        console.log("✅ Savings Rate Alert Cron Executed");
    }
    catch (err) {
        console.log("Savings Rate Alert Cron Error:", err.message);
    }
});