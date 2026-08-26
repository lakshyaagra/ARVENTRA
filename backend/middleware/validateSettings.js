const validateSettings = (req, res, next) => {

    const notifications = req.body.notifications;
    const ai = req.body.ai;

    if (notifications !== undefined) {
        const notificationKeys = ["emiReminder","savingsAlert","aiRecommendation"];
        for (const key of notificationKeys) {
            if (notifications[key] !== undefined && typeof notifications[key] !== "boolean"){
                return res.status(400).json({
                    success: false,
                    message: `${key} must be a boolean.`
                });
            }
        }
    }
    if (ai !== undefined){
        if(ai.enableAI !== undefined && typeof ai.enableAI !== "boolean"){
            return res.status(400).json({
                success: false,
                message: "enableAI must be a boolean."
            });
        }
    }
    const appearance = req.body.appearance;
    if (appearance !== undefined) {
        if (appearance.reduceMotion !== undefined && typeof appearance.reduceMotion !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "reduceMotion must be a boolean."
            });
        }
    }
    next();
};
module.exports = validateSettings;