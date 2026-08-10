const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const validateComment = require("../middleware/validateComment");
const validateUpdateComment = require("../middleware/validateUpdateComment");

const {createComment,getComments,updateCommentById,deleteCommentById}=
                        require("../controllers/commentController");

// Create Comment
router.post("/:id/comments",authMiddleware,validateComment,createComment);
// Get Comments
router.get("/:id/comments",getComments);
// Update Comment
router.patch("/comments/:id",authMiddleware,validateUpdateComment,updateCommentById);
// Delete Comment
router.delete("/comments/:id",authMiddleware,deleteCommentById);

module.exports = router;