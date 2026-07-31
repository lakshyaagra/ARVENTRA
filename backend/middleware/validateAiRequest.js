const validateAIRequest = (req, res, next) => {

    const message = req.body.message?.trim();
    if (!message) {
        return res.status(400).json({
            success: false,
            message: "Message is required."
        });
    }
    if (message.length < 10) {
        return res.status(400).json({
            success: false,
            message: "Message should contain at least 10 characters."
        });
    }
    if (message.length > 1000) {
        return res.status(400).json({
            success: false,
            message: "Message cannot exceed 1000 characters."
        });
    }
    next();
};
module.exports = validateAIRequest;