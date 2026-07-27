const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { toggleLike }=require("../controllers/likeController");

// Toggle Like
router.post("/:id/like",authMiddleware,toggleLike);

module.exports = router;