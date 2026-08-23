const validateResetPassword = (req, res, next) => {
 
    const password = req.body.password;

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
 
    next();
};
 
module.exports = validateResetPassword;