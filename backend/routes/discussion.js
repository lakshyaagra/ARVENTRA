const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const validateDiscussion = require("../middleware/validateDiscussion");
const validateUpdateDiscussion = require("../middleware/validateUpdateDiscussion");

const {createDiscussion,getDiscussions,updateDiscussionById,deleteDiscussionById}=require("../controllers/discussionController");

// Create Discussion

router.post("/",authMiddleware,validateDiscussion,createDiscussion);

// Get All Discussions
router.get("/",getDiscussions);

// Update Discussion
router.patch("/:id",authMiddleware,validateUpdateDiscussion,updateDiscussionById);

// Delete Discussion
router.delete("/:id",authMiddleware,deleteDiscussionById);

module.exports = router;