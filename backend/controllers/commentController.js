const Discussion = require("../models/Learning/Discussion");
const Comment = require("../models/Learning/Comment");

const createComment = async (req, res) => {
    try {
        const discussionId = req.params.id;
        const discussion = await Discussion.findById(discussionId);

        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found."
            });
        }

        const comment = await Comment.create({
            discussion: discussionId,
            user: req.user.id,
            comment: req.body.comment
        });

        Discussion.findByIdAndUpdate(
            discussionId,
            {
                $inc:{
                    commentsCount:1
                }
            }
        );

        res.status(201).json({
            success: true,
            message: "Comment added successfully.",
            comment
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const getComments = async (req, res) => {
    try {
        const discussionId = req.params.id;
        const discussion = await Discussion.findById(discussionId);

        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found."
            });
        }

        const comments = await Comment.find({
            discussion: discussionId
        }).populate("user","name").sort({createdAt: -1});

        res.status(200).json({
            success: true,
            comments
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const updateCommentById = async (req, res) => {
    try {
        const id = req.params.id;

        const comment = await Comment.findOne({
            _id: id,
            user: req.user.id
        });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        comment.comment = req.body.comment;//there's only one editable field in comment, so we dont use object.assign():
        comment.isEdited = true;
        await comment.save();

        res.status(200).json({
            success: true,
            message: "Comment updated successfully.",
            comment
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const deleteCommentById = async (req, res) => {
    try {
        const id = req.params.id;
        const comment = await Comment.findOne({
            _id: id,
            user: req.user.id
        });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        await Discussion.findByIdAndUpdate(
            comment.discussion,
            {
                $inc: {
                    commentsCount: -1
                }
            }
        );

        await comment.deleteOne();

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully."
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
module.exports={ createComment,getComments,updateCommentById,deleteCommentById };