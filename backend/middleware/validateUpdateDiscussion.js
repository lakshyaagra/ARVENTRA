const validateUpdateDiscussion= (req,res,next)=>{
    const { type,title,content
            ,tags,category }=req.body;   //object destructing

    const allowedTypes=["blog","question"];
    const allowedCategories=["budgeting","saving","investment","mutual-funds","stocks","insurance",
                            "loan","tax","credit-score","retirement","financial-planning","other"];                        
    if(title !== undefined){
        if (typeof title !== "string") {
            return res.status(400).json({
                success: false,
                message: "Title must be a string."
            });
        }
        if(title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Title cannot be empty"
            });
        }
        if (title.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message: "Title must contain at least 5 characters."
            });
        }
        if (title.trim().length > 150) {
            return res.status(400).json({
                success: false,
                message: "Title cannot exceed 150 characters."
            });
        }
    }
    if(content !== undefined) {
        if (typeof content !== "string") {
            return res.status(400).json({
                success: false,
                message: "Content must be a string."
            });
        }
        if(content.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Content cannot be empty"
            });
        }
        if(content.trim().length < 20) {
            return res.status(400).json({
                success: false,
                message: "Content should contain at least 20 characters."
            });
        }
    }
    if(type!==undefined && !allowedTypes.includes(type)){
        return res.status(400).json({
            success:false,
            message:'Invalid Type'
        })
    }
    if(category!==undefined && !allowedCategories.includes(category)){
        return res.status(400).json({
            success:false,
            message:'Invalid Category'
        })
    }
    if(tags!==undefined){
        if(!Array.isArray(tags)){
            return res.status(400).json({
                success: false,
                message: "Tags must be an array."
            });
        }
        if(tags.length > 10){
            return res.status(400).json({
                success: false,
                message: "Maximum 10 tags are allowed."
            });
        }
        for (const tag of tags) {
            if(typeof tag !== "string" || tag.trim() === ""){
                return res.status(400).json({
                    success: false,
                    message: "Each tag must be a valid string."
                });
            }
        }
    }
    next();
}
module.exports = validateUpdateDiscussion;