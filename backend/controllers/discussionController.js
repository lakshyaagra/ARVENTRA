const Discussion = require("../models/Learning/Discussion");
const Comment = require("../models/Learning/Comment");
const Like = require("../models/Learning/Like");

const createDiscussion = async (req, res)=>{
    try{
        req.body.user=req.user.id;
        const discussion=await Discussion.create(req.body);

        res.status(201).json({
            success: true,
            message: "Discussion created successfully.",
            discussion
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const getDiscussions = async (req, res) => {
    try {
        const filter = {};
        const allowedCategories = ["budgeting","saving","investment","mutual-funds","stocks","insurance",
                                    "loan","tax","credit-score","retirement","financial-planning","other"];

        const allowedTypes = ["blog","question"];
        const allowedSortFields = ["createdAt","views","likesCount","commentsCount","title"];

        const sortField = req.query.sort || "createdAt";
        const order = req.query.order || "desc";

        if (!allowedSortFields.includes(sortField) || (order !== "asc" && order !== "desc")){
            return res.status(400).json({
                success: false,
                message: "Invalid sort field or order."
            });
        }

        if(req.query.category && !allowedCategories.includes(req.query.category)){
            return res.status(400).json({
                success: false,
                message: "Invalid category."
            });
        }
        if(req.query.type &&!allowedTypes.includes(req.query.type)){
            return res.status(400).json({
                success: false,
                message: "Invalid type."
            });
        }
        if(req.query.category){
            filter.category = req.query.category;
        }
        if(req.query.type){
            filter.type = req.query.type;
        }
        const search = req.query.search?.trim();
        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    content: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalDiscussions = await Discussion.countDocuments(filter);
        const totalPages = Math.ceil(totalDiscussions/limit);
        const hasNextPage = page<totalPages;
        const hasPreviousPage = page>1;

        const sortOrder = order==="asc" ? 1 : -1;
        const sortObject = {
            [sortField]:sortOrder
        };

        const discussions=await Discussion.find(filter).populate("user", "name email")
                                          .sort(sortObject).skip(skip).limit(limit);
        res.status(200).json({
            success: true,
            message: "Discussions Retrieved",
            currentPage: page,
            totalDiscussions,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            discussions
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const updateDiscussionById=async (req,res)=>{
    try{
        const id=req.params.id;
        const discussion=await Discussion.findOne({
            _id: id,
            user: req.user.id
        });
        if(!discussion){
            return res.status(404).json({
                message: "Discussion not found",
                success: false
            })
        }

        Object.assign(discussion,req.body);
        discussion.isEdited=true;
        await discussion.save();

        res.status(200).json({
            message: "Discussion updated successfully.",
            success: true,
            discussion
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const deleteDiscussionById=async (req,res)=>{
    try{
        const id=req.params.id;
        const discussion=await Discussion.findOne({
            _id: id,
            user: req.user.id
        });
        if(!discussion){
            return res.status(404).json({
                message: "Discussion not found",
                success: false
            })
        }
        //uss discussion ke comments aur likes bhi delete krdo
        await Comment.deleteMany({
            discussion: discussion._id
        });
        await Like.deleteMany({
            discussion: discussion._id
        });

        await discussion.deleteOne()
        res.status(200).json({
            message: "Discussion Deleted",
            success: true,
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}

module.exports={ createDiscussion,getDiscussions,updateDiscussionById,deleteDiscussionById }