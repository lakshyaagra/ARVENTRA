const express = require("express");
const router = express.Router();
const validateAIRequest = require("../middleware/validateAIRequest");

const authMiddleware = require("../middleware/authMiddleware");
const { chatWithAI,getConversations,getConversationById } = require("../controllers/aiController");

router.post("/chat", authMiddleware, validateAIRequest, chatWithAI);
router.get("/conversations",authMiddleware,getConversations);
router.get("/conversations/:conversationId",authMiddleware,getConversationById);

module.exports = router;