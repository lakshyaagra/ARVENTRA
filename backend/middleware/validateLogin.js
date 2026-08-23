const validateLogin = (req, res, next) => {
 
    const email = req.body.email?.trim();
    const password = req.body.password;
 
    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required."
        });
    }
 
    if (!password) {
        return res.status(400).json({
            success: false,
            message: "Password is required."
        });
    }
 
    req.body.email = email;
 
    next();
};
 
module.exports = validateLogin;