const crypto = require("crypto");

const CSRF_COOKIE_NAME = "csrfToken";
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_COOKIE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const issueCsrfToken = (req, res, next) => {
    if (!req.cookies?.[CSRF_COOKIE_NAME]) {
        const token = crypto.randomBytes(32).toString("hex");
        res.cookie(CSRF_COOKIE_NAME, token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: CSRF_COOKIE_TTL_MS,
            path: "/"
        });
        req.cookies = { ...req.cookies, [CSRF_COOKIE_NAME]: token };
    }
    next();
};

const verifyCsrfToken = (req, res, next) => {
    const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
    const headerToken = req.headers[CSRF_HEADER_NAME];

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        return res.status(403).json({
            success: false,
            message: "Invalid or missing CSRF token."
        });
    }
    next();
};

module.exports = {
    issueCsrfToken,
    verifyCsrfToken,
    CSRF_COOKIE_NAME,
    CSRF_HEADER_NAME
};