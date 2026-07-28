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

        Object.assign(settings, req.body);
        await settings.save();

        res.status(200).json({
            success: true,
            message: "Settings updated successfully.",
            settings
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { getSettings,updateSettings };