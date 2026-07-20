const validateAsset=(req,res,next)=>{
    const assetName=req.body.assetName?.trim();
    const currentValue=Number(req.body.currentValue);
    const allowedCategory=["bank","cash","fixed-deposit","recurring-deposit","mutual-fund",
              "stock","gold","property","crypto","epf","ppf","vehicle","business","other"];

    if (!assetName){
        return res.status(400).json({
            success: false,
            message: 'Asset name is required' 
        });
    }
    if(Number.isNaN(currentValue) || currentValue <=0){
        return res.status(400).json({
            success: false,
            message: 'Current Value must be a positive number.', 
        });
    }
    if(req.body.category && !allowedCategory.includes(req.body.category)){
        return res.status(400).json({
            success:false,
            message:'Invalid Category'
        })
    }
    if(req.body.purchaseValue!==undefined){
        const purchaseValue=Number(req.body.purchaseValue);
        if(Number.isNaN(purchaseValue) || purchaseValue < 0){
            return res.status(400).json({
                success: false,
                message: "Purchase Value can't be negative"
            });
        }
    }
    if(req.body.purchaseDate){
        const purchaseDate = new Date(req.body.purchaseDate);
        if (Number.isNaN(purchaseDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid purchase date."
            });
        }
        if (purchaseDate > new Date()) {
            return res.status(400).json({
                success: false,
                message: "Purchase date cannot be in the future."
            });
        }
    }
    if(req.body.institution && req.body.institution.trim()===""){
        return res.status(400).json({
            success:false,
            message: "Institution Name can't be empty."
        })
    }
    if(req.body.notes && req.body.notes.trim()===""){
        return res.status(400).json({
            success:false,
            message: "Notes can't be empty."
        })
    }
    next();
}
module.exports=validateAsset;