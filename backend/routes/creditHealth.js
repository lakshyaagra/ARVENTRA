const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { getCreditHealth } = require("../controllers/creditHealthController");

router.get("/", authMiddleware, getCreditHealth);

module.exports = router;