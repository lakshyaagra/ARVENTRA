// const goals=[];
const Goal = require('../models/Goal');
const createGoal = async (req, res) => {
    try{
        // req.body.targetAmount = Number(req.body.targetAmount);
        req.body.user=req.user.id;  //user id is coming from auth middleware
        const goal = await Goal.create(req.body);
        res.status(201).json({
            message: "Goal Created",
            success: true,
            goal: goal
        });
    }
    catch(error){
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}
const getGoals = async (req, res) => {
    try{
        //sort apis handle
        const sortField = req.query.sort || 'createdAt';
        const allowedSortFields = ['createdAt', 'targetAmount', 'goalName','status'];
        const order=req.query.order || 'desc';
        if(!allowedSortFields.includes(sortField) || (order !== 'asc' && order !== 'desc')){
            return res.status(400).json({
                message: "Invalid sort field or order.",
                success: false
            });
        }
        const sortOrder = order === 'asc'?1:-1;
        const sortObject={
            [sortField]: sortOrder
        }
        //filter api handle
        const allowedStatus = ['active', 'completed'];
        if(req.query.status && !allowedStatus.includes(req.query.status)){
            return res.status(400).json({
                message: "Invalid status value (only active and completed allowed).",
                success: false
            });
        }
        const filter={
            user:req.user.id,
        }
        if(req.query.status){
            filter.status=req.query.status
        }

        //searching
        const search=req.query.search?.trim()
        if(search){
            filter.goalName={
                $regex:search,
                $options:"i"
            }
        }

        //pagination
        const page=Number(req.query.page) || 1;
        const limit=Number(req.query.limit) || 15;
        const skip=limit*(page-1);

        const totalGoals=await Goal.countDocuments(filter);
        const totalPages=Math.ceil(totalGoals/limit);
        const hasNextPage=page<totalPages;
        const hasPreviousPage=page>1;
        //api response limiting
        // const fields=req.query.fields;
        // let selectedFields;
        // if(fields){
        //     selectedFields=fields.replaceAll(","," ") + "user";
        // }                     
        // const goals=await Goal.find();   //Goal is a Model which is used to fetch data from MongoDB database
        const goals=await Goal.find(filter)
        .populate('user',"name email").sort(sortObject).skip(skip).limit(limit);

        res.status(200).json({
            message:" Goals Retrieved ",
            success:true,
            currPage:page,
            totalGoals,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            goals:goals,
        })
    }    
    catch(err){  //Database Error
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const getGoalById=async (req, res)=>{
    // const id=Number(req.params.id);
    // const goal=goals.find(goal=>goal.id===id)
    try{
        const id=req.params.id;  //as mongoDB generates id alphanumeric , converting to number will give NaN
        const goal=await Goal.findOne({
            _id: id,
            user: req.user.id
        });
        if(!goal){    //agr id meri document me nahi hai to null return karega
            return res.status(404).json({
                error: "Goal not found",
                success: false
            })
        }
        //else wala case , agr id meri document me hai to goal return karega
        res.status(200).json({
            message: "Goal Retrieved",
            success: true,
            goal:goal
        })

    }
    catch(err){   //database fail wala case  
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const updateGoalById=async (req,res)=>{
    // const id=Number(req.params.id);
    // const goal=goals.find(goal=>goal.id===id)
    try{
        const id=req.params.id;
        // const goal=await Goal.findByIdAndUpdate(
        //     id, 
        //     req.body, 
        //     { new: true }
        // );
        const goal=await Goal.findOneAndUpdate(
            {
                _id: id,
                user: req.user.id
            }, 
            req.body,
            { 
                new: true,
                runValidators: true
            }
        );
        if(!goal){
            return res.status(404).json({
                message: "Goal not found",
                success: false
            })
        }
        // Object.assign(goal,req.body);
        res.status(200).json({
            message: "Goal Updated",
            success: true,
            goal:goal
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const deleteGoalById=async (req,res)=>{
    try{
        // const id=req.params.id;
        // const goal=await Goal.findByIdAndDelete(id);
        const id=req.params.id;
        const goal=await Goal.findOne({
            _id: id,
            user: req.user.id
        });
        if(!goal){
            return res.status(404).json({
                message: "Goal not found",
                success: false
            })
        }
        await goal.deleteOne()
        res.status(200).json({
            message: "Goal Deleted",
            success: true,
            goal:goal
        })
    }
    // goals.splice(index, 1);    //is index se 1 length ka element delete kar do
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
module.exports={createGoal, getGoals, getGoalById, updateGoalById, deleteGoalById};