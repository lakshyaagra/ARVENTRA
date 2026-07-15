const  validateGoal = (req, res, next) => {
    
    const goalName=req.body.goalName?.trim();
    const targetAmount=Number(req.body.targetAmount);
    const currentAmount=req.body.currentAmount===undefined?0:Number(req.body.currentAmount);
    const allowedPriorities=["low","medium","high"];
    const allowedCategories=["education","travel","electronics","vehicle","home","investment","emergency","personal","other"];

    if (!goalName){
        return res.status(400).json({
            success: false,
            message: 'Goal name is required' 
        });
    }
    if(Number.isNaN(targetAmount) || targetAmount <= 0){
        return res.status(400).json({
            success: false,
            message: 'Target amount must be a positive number' 
        });
    }
    if(Number.isNaN(currentAmount) || currentAmount < 0){
        return res.status(400).json({
            success: false,
            message: 'Current amount must be a positive number or zero' 
        });
    }
    if(currentAmount>targetAmount){
        return res.status(400).json({
            success: false,
            message: "Current amount cannot be greater than target amount"
        });
    }
    if(req.body.priority!==undefined && !allowedPriorities.includes(req.body.priority)){
        return res.status(400).json({
            success:false,
            message:'Invalid Priority'
        })
    }
    if(req.body.category!==undefined && !allowedCategories.includes(req.body.category)){
        return res.status(400).json({
            success:false,
            message:'Invalid Category'
        })
    }
    if(req.body.description && req.body.description.trim()===""){
        return res.status(400).json({
            success:false,
            message: "Description can't be empty."
        })
    }
    if(req.body.deadline!==undefined){
        const deadline=new Date(req.body.deadline);
        if(Number.isNaN(deadline.getTime())){
            return res.status(400).json({
                success:false,
                message:"Invalid Deadline"
            })
        }
    }
    next();
};

module.exports = validateGoal;
