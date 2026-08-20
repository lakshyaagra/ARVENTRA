const Settings=require('../models/Settings')

const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne({
            user: req.user.id
        });

        // Create default settings if they don't exist
        if (!settings) {
            settings = await Settings.create({
                user: req.user.id
            });
        }
        res.status(200).json({
            success: true,
            settings
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne({
            user: req.user.id
        });
        if (!settings) {
            settings = await Settings.create({
                user: req.user.id
            });
        }
        if (req.body.notifications) {
            const { emiReminder,savingsAlert,aiRecommendation } = req.body.notifications;

            if (emiReminder !== undefined) {
                settings.notifications.emiReminder =
                    emiReminder;
            }
            if (savingsAlert !== undefined) {
                settings.notifications.savingsAlert =
                    savingsAlert;
            }
            if (aiRecommendation !== undefined) {
                settings.notifications.aiRecommendation =
                    aiRecommendation;
            }
        }
        if (req.body.ai) {
            if(req.body.ai.enableAI !== undefined){
                settings.ai.enableAI = req.body.ai.enableAI;
            }
        }
        await settings.save();
        res.status(200).json({
            success: true,
            message: "Settings updated successfully.",
            settings,
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = { getSettings,updateSettings };