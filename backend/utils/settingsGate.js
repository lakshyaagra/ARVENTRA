const Settings = require("../models/Settings");
 
// Returns the user's Settings document, or null if they've never saved one.
// Every toggle in the schema defaults to true, so "no document yet" is
// equivalent to "everything on" — callers should only treat a toggle as
// OFF when it's explicitly === false, never just because settings is null.
const getUserSettings = async (userId) => {
    return Settings.findOne({ user: userId });
};
 
module.exports = { getUserSettings };