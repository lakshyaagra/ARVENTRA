const validateComment = (req, res, next) => {
    const comment = req.body.comment?.trim();
    if (!comment) {
        return res.status(400).json({
            success: false,
            message: "Comment is required."
        });
    }
    if (comment.length < 2) {
        return res.status(400).json({
            success: false,
            message: "Comment must contain at least 2 characters."
        });
    }
    if (comment.length > 300) {
        return res.status(400).json({
            success: false,
            message: "Comment cannot exceed 300 characters."
        });
    }
    next();
};
module.exports = validateComment;