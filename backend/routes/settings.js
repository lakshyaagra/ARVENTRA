const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const validateSettings = require("../middleware/validateSettings");
const {getSettings,updateSettings}=require("../controllers/settingsController");

// Get Settings
router.get("/",authMiddleware,getSettings);

// Update Settings
router.patch("/",authMiddleware,validateSettings,updateSettings);

module.exports = router;