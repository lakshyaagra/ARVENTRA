const validateDiscussion= (req, res, next) => {
    
    const title=req.body.title?.trim();
    const content=req.body.content?.trim();
    const tags=req.body.tags;
    const type=req.body.type;
    const allowedTypes=["blog","question"];
    const allowedCategories=["budgeting","saving","investment","mutual-funds","stocks","insurance",
                            "loan","tax","credit-score","retirement","financial-planning","other"];

    if(!title){
        return res.status(400).json({
            success: false,
            message: 'Title is required' 
        });
    }
    if(title.length<5){
        return res.status(400).json({
            success: false,
            message: "Title must contain at least 5 characters."
        });
    }

    if(title.length>150){
        return res.status(400).json({
            success: false,
            message: "Title cannot exceed 150 characters."
        });
    }
    if(!content){
        return res.status(400).json({
            success: false,
            message: 'Content is required' 
        });
    }
    if (content.length < 20) {
        return res.status(400).json({
            success: false,
            message: "Content should contain at least 20 characters."
        });
    }
    if(!type){
        return res.status(400).json({
            success: false,
            message: 'Type is required' 
        });
    }
    if(!allowedTypes.includes(type)){
        return res.status(400).json({
            success:false,
            message:'Invalid Type'
        })
    }
    if(req.body.category!==undefined && !allowedCategories.includes(req.body.category)){
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
};

module.exports = validateDiscussion;
