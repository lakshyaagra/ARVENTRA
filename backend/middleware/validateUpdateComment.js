const validateUpdateComment = (req, res, next) => {
    const comment = req.body.comment;
    if (comment !== undefined) {
        if (comment.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Comment cannot be empty."
            });
        }
        if (comment.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Comment must contain at least 2 characters."
            });
        }
        if (comment.trim().length > 300) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot exceed 300 characters."
            });
        }
    }
    next();
};
module.exports = validateUpdateComment;