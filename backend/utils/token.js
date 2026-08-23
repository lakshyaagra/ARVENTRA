const crypto = require("crypto");
 
// Returns { rawToken, hashedToken } — rawToken is what goes in the emailed
// link (never stored), hashedToken is what we save to the DB so a DB leak
// alone can't be used to reset a password or verify an email.
const generateToken = () => {
    const rawToken = crypto.randomBytes(32).toString("hex");  //64 CHARS
    //hash the raw token
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    return { rawToken, hashedToken };
};
 
const hashToken = (rawToken) =>
    crypto.createHash("sha256").update(rawToken).digest("hex");
 
module.exports = { generateToken, hashToken };