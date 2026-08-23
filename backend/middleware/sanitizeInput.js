const isPlainObject = (val) =>
    val !== null && typeof val === "object" && !Array.isArray(val);

// Recursively strips any object key that starts with "$" or contains "."
// — the two characters Mongo operator-injection payloads rely on, e.g.
// { "email": { "$gt": "" } } (bypasses an equality check) or
// { "user.role": "admin" } (targets a nested field directly).
//
// Mutates the object IN PLACE rather than reassigning req.query/req.body —
// express-mongo-sanitize's default approach reassigns req.query, which
// Express 5 made a read-only getter, so that library throws here. Walking
// and deleting keys in place sidesteps that entirely.
const stripDangerousKeys = (obj) => {
    if (!isPlainObject(obj)) return;

    for (const key of Object.keys(obj)) {
        if (key.startsWith("$") || key.includes(".")) {
            delete obj[key];
            continue;
        }

        const value = obj[key];
        if (isPlainObject(value)) {
            stripDangerousKeys(value);
        } else if (Array.isArray(value)) {
            value.forEach(stripDangerousKeys);
        }
    }
};

const sanitizeInput = (req, res, next) => {
    stripDangerousKeys(req.body);
    stripDangerousKeys(req.params);
    stripDangerousKeys(req.query);
    next();
};

module.exports = sanitizeInput;