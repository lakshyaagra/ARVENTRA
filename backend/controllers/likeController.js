const Discussion = require("../models/Discussion");
const Like = require("../models/Learning/Like");

const toggleLike = async (req, res) => {
    try {
        const discussionId = req.params.id;
        const discussion = await Discussion.findById(discussionId);

        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found."
            });
        }

        const existingLike = await Like.findOne({
            discussion: discussionId,
            user: req.user.id
        });

        if (existingLike) {
            await existingLike.deleteOne();

            await Discussion.findByIdAndUpdate(
                discussionId,
                {
                    $inc: {
                        likesCount: -1
                    }
                }
            );

            return res.status(200).json({
                success: true,
                message: "Discussion unliked."
            });
        }

        //agr like nhi h to bna do 
        await Like.create({
            discussion: discussionId,
            user: req.user.id
        });

        await Discussion.findByIdAndUpdate(
            discussionId,
            {
                $inc: {
                    likesCount: 1
                }
            }
        );
        res.status(201).json({
            success: true,
            message: "Discussion liked."
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports={toggleLike};