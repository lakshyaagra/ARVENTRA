const  validateGoal = (req, res, next) => {
    
    const goalName=req.body.goalName;
    const targetAmount=Number(req.body.targetAmount);

    if (!goalName || goalName.trim()===""){
        return res.status(400).json({
            error: 'Goal name is required' 
        });
    }
    if(Number.isNaN(targetAmount) || targetAmount <= 0){
        return res.status(400).json({
            error: 'Target amount must be a positive number' 
        });
    }
    next();
};

module.exports = validateGoal;
