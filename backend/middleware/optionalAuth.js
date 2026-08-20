const jwt = require('jsonwebtoken');

// Like authMiddleware, but never blocks the request.
// If a valid token is present, req.user is populated (same as authMiddleware).
// If no token, or an invalid/expired one, req.user is left as null and the
// request continues anonymously.
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        req.user = null;
    }

    next();
};

module.exports = optionalAuth;