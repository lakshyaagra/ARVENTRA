const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegister = (req, res, next) => {

    const name = req.body.name?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password;

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
    if (name.length > 100) {
        return res.status(400).json({
            success: false,
            message: "Name cannot exceed 100 characters."
        });
    }

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required."
        });
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address."
        });
    }

    if (!password) {
        return res.status(400).json({
            success: false,
            message: "Password is required."
        });
    }
    if (password.length < 7) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 7 characters."
        });
    }
    if (password.length > 128) {
        return res.status(400).json({
            success: false,
            message: "Password cannot exceed 128 characters."
        });
    }

    // Normalize whitespace so what gets hashed/stored matches what was validated above.
    req.body.name = name;
    req.body.email = email;

    next();
};

module.exports = validateRegister;