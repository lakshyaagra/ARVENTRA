const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { creditHealthSummary } = require("../controllers/creditHealthController");

router.get("/", authMiddleware, creditHealthSummary);

module.exports = router;