const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const REFRESH_COOKIE_NAME = "refreshToken";

// Short-lived JWT sent in the response body and used in the Authorization
// header for every normal API request — same signing secret/shape as the
// old 7-day token, just a much shorter expiry.
const signAccessToken = (userId) =>
    jwt.sign(
        { id: userId }, 
        process.env.JWT_SECRET, 
        { 
            expiresIn: ACCESS_TOKEN_TTL 
        }
    );

// Refresh tokens are NOT JWTs — they're an opaque random value, exactly
// like the password-reset/email-verification tokens already used
// elsewhere in this codebase. Only the SHA-256 hash is ever stored, so a
// DB leak alone can't be used to mint sessions.
const generateRefreshToken = () => {
    const rawToken = crypto.randomBytes(40).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    return { rawToken, hashedToken };
};

const hashRefreshToken = (rawToken) =>
    crypto.createHash("sha256").update(rawToken).digest("hex");

// Frontend (Vercel) and backend (Render) live on different domains in
// production, so this cookie has to be sent cross-site on every
// /users/refresh-token and /users/logout call. "None" is the only
// sameSite value browsers will send cross-site, and they require
// `secure: true` whenever sameSite is "None" — so both flip together
// based on environment, matching the same fix made in csrf.js, rather
// than secure alone being production-gated.
//
// Centralized so the cookie options can never drift between where it's
// set (login, refresh) and where it's cleared (logout).
const refreshCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: REFRESH_TOKEN_TTL_MS,
        path: "/users",
    };
};

module.exports = {
    ACCESS_TOKEN_TTL,
    REFRESH_TOKEN_TTL_MS,
    REFRESH_COOKIE_NAME,
    signAccessToken,
    generateRefreshToken,
    hashRefreshToken,
    refreshCookieOptions,
};