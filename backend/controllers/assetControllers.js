const Asset=require('../models/Assets');

const createAsset=async (req,res)=>{
    try{
        req.body.user=req.user.id;
        const asset=await Asset.create(req.body);
        res.status(201).json({
            message: "Asset Created",
            success: true,
            asset
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false,
        })
    }
}
const getAssets=async (req,res)=>{
    try{
        //sorting
        const sortField=req.query.sort || 'createdAt';
        const allowedSortFields = ["createdAt","assetName","currentValue","purchaseValue","purchaseDate"];
        const order=req.query.order || 'desc';
        if(!allowedSortFields.includes(sortField) || (order!=='asc' && order!=='desc')){
            return res.status(400).json({
                message: "Invalid sort field or order.",
                success: false
            });
        }
        const sortOrder=order==="asc"?1:-1;
        const sortObject={
            [sortField]:sortOrder
        }

        const allowedCategories = ["bank","cash","fixed-deposit","recurring-deposit","mutual-fund","stock",
                        "gold","property","crypto","epf","ppf","vehicle","business","other"];

        if(req.query.category !== undefined && !allowedCategories.includes(req.query.category)){
            return res.status(400).json({
                message:"Invalid Category",
                success:false,
            })
        }

        //filtering
        const filter={
            user:req.user.id,
        }

        if(req.query.category){
            filter.category = req.query.category;
        }

        //searching
        const search=req.query.search?.trim()
        if(search){
            filter.assetName={
                $regex:search,
                $options:"i"
            }
        }

        //pagination
        const page=Number(req.query.page) || 1;
        const limit=Number(req.query.limit) || 15;
        const skip=limit*(page-1);
        const totalAssets=await Asset.countDocuments(filter);
        const totalPages=Math.ceil(totalAssets/limit);
        const hasNextPage=page<totalPages;
        const hasPreviousPage=page>1;

        const assets=await Asset.find(filter).populate('user',"name email")
                    .sort(sortObject).skip(skip).limit(limit);
        
        res.status(200).json({
            message:" Assets Retrieved ",
            success:true,
            currPage:page,
            totalAssets,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            assets,
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const getAssetById=async (req,res)=>{
    try{
        const id=req.params.id;  //as mongoDB generates id alphanumeric , converting to number will give NaN
        const asset=await Asset.findOne({
            _id: id,
            user: req.user.id
        });
        if(!asset){    //agr id meri document me nahi hai to null return karega
            return res.status(404).json({
                message: "Asset not found",
                success: false
            })
        }
        //else wala case , agr id meri document me hai to goal return karega
        res.status(200).json({
            message: "Asset Retrieved",
            success: true,
            asset
        })
    }
    catch(err){   //database fail wala case  
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const updateAssetById=async (req,res)=>{
    try{
        const id=req.params.id;
        const asset=await Asset.findOne({
            _id: id, 
            user: req.user.id
        });
        if(!asset){
            return res.status(404).json({
                error: "Asset not found",
                success: false
            })
        }

        Object.assign(asset,req.body);
        await asset.save();

        res.status(200).json({
            message: "Asset Updated",
            success: true,
            asset
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const deleteAssetById=async (req,res)=>{
    try{
        const id=req.params.id;
        const asset=await Asset.findOne({
            _id: id,
            user: req.user.id
        });
        if(!asset){
            return res.status(404).json({
                message: "Asset not found",
                success: false
            })
        }
        await asset.deleteOne()
        res.status(200).json({
            message: "Asset Deleted",
            success: true,
            asset
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
module.exports={ createAsset,getAssets,getAssetById,updateAssetById,deleteAssetById }