const crypto = require("crypto");

const CSRF_COOKIE_NAME = "csrfToken";
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_COOKIE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// Frontend (Vercel) and backend (Render) live on different domains in
// production, so this cookie has to be sent cross-site. "None" is the
// only sameSite value browsers will send cross-site, and they require
// `secure: true` whenever sameSite is "None" — so both flip together
// based on environment rather than secure being production-only.
const isProduction = process.env.NODE_ENV === "production";

const csrfCookieOptions = {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: CSRF_COOKIE_TTL_MS,
    path: "/"
};

const issueCsrfToken = (req, res, next) => {
    if (!req.cookies?.[CSRF_COOKIE_NAME]) {
        const token = crypto.randomBytes(32).toString("hex");
        res.cookie(CSRF_COOKIE_NAME, token, csrfCookieOptions);
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