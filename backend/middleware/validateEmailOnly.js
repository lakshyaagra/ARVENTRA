const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
const validateEmailOnly = (req, res, next) => {
    const email = req.body.email?.trim();
 
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address."
        });
    }
 
    req.body.email = email;
 
    next();
};
 
module.exports = validateEmailOnly;