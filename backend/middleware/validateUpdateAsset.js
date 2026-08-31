const validateUpdateAsset= (req,res,next)=>{
    const {assetName,purchaseValue,currentValue
            ,institution,category,notes,purchaseDate}=req.body;   //object destructing

    const allowedCategories=["bank","cash","fixed-deposit","recurring-deposit","mutual-fund",
              "stock","gold","property","crypto","epf","ppf","vehicle","business","other"];

    if(assetName !== undefined) {
        if(assetName.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Asset name cannot be empty"
            });
        }
    }
    if(purchaseValue !== undefined) {
        const parsedPurchaseValue = Number(purchaseValue);
        if(Number.isNaN(parsedPurchaseValue) || parsedPurchaseValue < 0){
            return res.status(400).json({
                success: false,
                message: "Purchase value cannot be negative."
            });
        }
    }
    if(currentValue !== undefined) {
        const parsedCurrentAmount = Number(currentValue);
        if(Number.isNaN(parsedCurrentAmount) || parsedCurrentAmount <= 0){
            return res.status(400).json({
                success: false,
                message: "Current value must be a positive number"
            });
        }
    }
    if(category!==undefined && !allowedCategories.includes(category)){
        return res.status(400).json({
            success:false,
            message:'Invalid Category'
        })
    }
    if(institution!==undefined){
        if(institution.trim()==""){
            return res.status(400).json({
                success:false,
                message: "Institution can't be empty."
            })
        }
    }
    if(notes!==undefined){
        if(typeof notes!=="string"){
            return res.status(400).json({
                success:false,
                message: "Notes must be text."
            })
        }
    }
    if(purchaseDate!==undefined){
        const parsedPurchaseDate=new Date(purchaseDate);
        if(Number.isNaN(parsedPurchaseDate.getTime())){
            return res.status(400).json({
                success:false,
                message:"Invalid Purchase Date"
            })
        }
        if (parsedPurchaseDate > new Date()) {
            return res.status(400).json({
                success: false,
                message: "Purchase date cannot be in the future."
            });
        }
    }
    next();
}
module.exports = validateUpdateAsset;