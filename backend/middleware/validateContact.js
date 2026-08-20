const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateContact = (req, res, next) => {

    const subject = req.body.subject?.trim();
    const message = req.body.message?.trim();

    // req.user is set by optionalAuth: an object when logged in, null otherwise.
    const isAuthenticated = !!req.user;

    if (!isAuthenticated) {
        const name = req.body.name?.trim();
        const email = req.body.email?.trim();

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required."
            });
        }
        if (name.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Name must contain at least 2 characters."
            });
        }
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "A valid email is required."
            });
        }
    }

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