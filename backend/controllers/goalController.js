const goals=[];
const createGoal = (req, res) => {
    req.body.targetAmount = Number(req.body.targetAmount);
    goals.push(req.body);
    res.status(201).json({
        message: "Goal Created",
        success: true,
        goal: req.body
    });
    console.log(goals);
}
const getGoals = (req, res) => {
    // const goals=await Goal.find();   //Goal is a Model which is used to fetch data from MongoDB database
    res.status(200).json({
        message: "Goals Retrieved",
        success: true,
        goals: goals
    })
}
const getGoalById=(req,res)=>{
    const id=Number(req.params.id);
    const goal=goals.find(goal=>goal.id===id)
    if(!goal){
        return res.status(404).json({
            error: "Goal not found",
            success: false
        })
    }
    res.status(200).json({
        message: "Goal Retrieved",
        success: true,
        goal: goal
    })
}
const updateGoalById=(req,res)=>{
    const id=Number(req.params.id);
    const goal=goals.find(goal=>goal.id===id)
    if(!goal){
        return res.status(404).json({
            error: "Goal not found",
            success: false
        })
    }
    Object.assign(goal,req.body);

    res.status(200).json({
        message: "Goal Updated",
        success: true,
        goal:goal
    })
}
const deleteGoalById=(req,res)=>{
    const id=Number(req.params.id);
    const index=goals.findIndex(goal=>goal.id===id);
    if(index===-1){
        return res.status(404).json({
            error: "Goal not found",
            success: false
        })
    }
    goals.splice(index, 1);    //is index se 1 length ka element delete kar do
    res.status(200).json({
        message: "Goal Deleted",
        success: true
    })
}
module.exports={createGoal, getGoals, getGoalById, updateGoalById, deleteGoalById};