const validateContact = (req, res, next) => {

    const subject = req.body.subject?.trim();
    const message = req.body.message?.trim();

    if (!subject) {
        return res.status(400).json({
            success: false,
            message: "Subject is required."
        });
    }
    if (subject.length < 5) {
        return res.status(400).json({
            success: false,
            message: "Subject must contain at least 5 characters."
        });
    }
    if (subject.length > 100) {
        return res.status(400).json({
            success: false,
            message: "Subject cannot exceed 100 characters."
        });
    }
    if (!message) {
        return res.status(400).json({
            success: false,
            message: "Message is required."
        });
    }
    if (message.length < 20) {
        return res.status(400).json({
            success: false,
            message: "Message should contain at least 20 characters."
        });
    }
    next();
};

module.exports = validateContact;