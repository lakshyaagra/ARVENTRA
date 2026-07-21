const validateUpdateGoal= (req,res,next)=>{
    const {goalName,targetAmount,currentAmount
            ,priority,category,description,deadline}=req.body;   //object destructing

    const allowedPriorities=["low","medium","high"];
    const allowedCategories=["education","travel","electronics","vehicle","home","investment","emergency","personal","other"];

    if(goalName !== undefined) {
        if(goalName.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Goal name cannot be empty"
            });
        }
    }
    if(targetAmount !== undefined) {
        const parsedTargetAmount = Number(targetAmount);
        if(Number.isNaN(parsedTargetAmount) || parsedTargetAmount <= 0){
            return res.status(400).json({
                success: false,
                message: "Target amount must be a positive number"
            });
        }
    }
    if(currentAmount !== undefined) {
        const parsedCurrentAmount = Number(currentAmount);
        if(Number.isNaN(parsedCurrentAmount) || parsedCurrentAmount < 0){
            return res.status(400).json({
                success: false,
                message: "Current amount cannot be negative"
            });
        }
    }
    if(priority!==undefined && !allowedPriorities.includes(priority)){
        return res.status(400).json({
            success:false,
            message:'Invalid Priority'
        })
    }
    if(category!==undefined && !allowedCategories.includes(category)){
        return res.status(400).json({
            success:false,
            message:'Invalid Category'
        })
    }
    if(description!==undefined){
        if(typeof description!=="string" || description.trim()===""){
            return res.status(400).json({
                success:false,
                message: "Description can't be empty."
            })
        }
    }
    if(deadline!==undefined){
        const parsedDeadline=new Date(deadline);
        if(Number.isNaN(parsedDeadline.getTime())){
            return res.status(400).json({
                success:false,
                message:"Invalid Deadline"
            })
        }
    }
    next();
}
module.exports = validateUpdateGoal;