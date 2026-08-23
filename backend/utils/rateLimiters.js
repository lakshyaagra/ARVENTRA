const rateLimit = require("express-rate-limit");

// Applies to POST /users/login. Keyed per-IP by default. Counts only failed
// attempts (skipSuccessfulRequests) so a legitimate user who gets their
// password right isn't penalized by earlier mistakes in the same window.
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 8,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: "Too many login attempts. Please try again in a few minutes."
    }
});

// Looser — registration is naturally rarer per-IP than login attempts, but
// still worth capping to blunt automated account-creation spam.
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many accounts created from this network. Please try again later."
    }
});

// Forgot-password requests trigger an email send — cap tightly to stop
// someone from using it to spam an arbitrary inbox or enumerate accounts.
const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many password reset requests. Please try again in a few minutes."
    }
});

module.exports = { loginLimiter, registerLimiter, forgotPasswordLimiter };