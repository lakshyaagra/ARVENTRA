const cron = require("node-cron");
const Loan = require("../models/Loan");
const { createNotification } = require("../services/notificationService");
const { getUserSettings } = require("../utils/settingsGate")

const emiReminderJob=()=>{
    cron.schedule("0 8 * * *", async () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const tomorrowEnd = new Date(tomorrow);
        tomorrowEnd.setHours(23, 59, 59, 999);
        const loans = await Loan.find({
            status: "active",
            nextDueDate: {
                $gte: tomorrow,
                $lte: tomorrowEnd
            }
        });

        for (const loan of loans) {
            const settings = await getUserSettings(loan.user);
            if (settings && settings.notifications?.emiReminder === false) {
                continue;
            }

            await createNotification({
                user: loan.user,
                title: "💳 EMI Reminder",
                message: `Your EMI for "${loan.loanName}" is due tomorrow.`,
                type: "loan"
            });
        }
    });
}
module.exports = emiReminderJob;