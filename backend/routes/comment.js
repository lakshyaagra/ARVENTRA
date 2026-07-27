const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const validateComment = require("../middleware/validateComment");
const validateUpdateComment = require("../middleware/validateUpdateComment");

const {createComment,getComments,updateCommentById,deleteCommentById}=
                        require("../controllers/commentController");

// Create Comment
router.post("/:id/comments",auth,validateComment,createComment);

// Get Comments
router.get("/:id/comments",auth,getComments);

// Update Comment
router.patch("/comments/:id",auth,validateUpdateComment,updateCommentById);

// Delete Comment
router.delete("/comments/:id",auth,deleteCommentById);

module.exports = router;