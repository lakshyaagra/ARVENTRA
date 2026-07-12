const Goal=require('../models/Goal')

const getDashboardStats=async (req,res)=>{
    try{
        const stats=await Goal.aggregate([
            {
                $match:{
                    user:req.user.id
                }
            },
            {
                $group:{
                    _id:null,

                    totalGoals:{$sum:1},
                    totalTargetAmount:{
                        $sum:"$targetAmount"
                    },
                    averageTargetAmount:{
                        $avg:"$targetAmount"
                    },
                    highestTarget:{
                        $max:"$targetAmount"
                    },
                    lowestTarget:{
                        $min:"$targetAmount"
                    }
                }
            }
        ])
        const dashboardStats=stats[0] || {
            totalGoals:0,
            totalTargetAmount:0,
            averageTargetAmount:0,
            highestTarget:0,
            lowestTarget:0
        };
        res.status(200).json({
            success:true,
            stats:dashboardStats
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message: err.message
        });
    }
}
module.exports={getDashboardStats}