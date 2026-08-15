const express = require("express");
const router = express.Router();
const validateAIRequest = require("../middleware/validateAIRequest");

const authMiddleware = require("../middleware/authMiddleware");
const { chatWithAI } = require("../controllers/aiController");

router.post("/chat", authMiddleware, validateAIRequest, chatWithAI);

module.exports = router;