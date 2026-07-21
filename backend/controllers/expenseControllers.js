const Expense=require('../models/Expense')

const createExpense=async (req,res)=>{
    try{
        req.body.user=req.user.id;
        const expense=await Expense.create(req.body);
        res.status(201).json({
            message: "Expense Created",
            success: true,
            expense
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false,
        })
    }
}
const getExpenses=async (req,res)=>{
    try{
        //sorting
        const sortField=req.query.sort || 'createdAt';
        const allowedSortFields = ["createdAt","expenseName","paymentMethod","amount","expenseDate"];
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

        const allowedCategories = ["food","transport","shopping","entertainment","health",
                                "education","bills","travel","investment","family","other"];

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
            filter.expenseName={
                $regex:search,
                $options:"i"
            }
        }

        //pagination
        const page=Number(req.query.page) || 1;
        const limit=Number(req.query.limit) || 15;
        const skip=limit*(page-1);
        const totalExpenses=await Expense.countDocuments(filter);
        const totalPages=Math.ceil(totalExpenses/limit);
        const hasNextPage=page<totalPages;
        const hasPreviousPage=page>1;

        const expenses=await Expense.find(filter).populate('user',"name email")
                    .sort(sortObject).skip(skip).limit(limit);
        
        res.status(200).json({
            message:" Expenses Retrieved ",
            success:true,
            currPage:page,
            totalExpenses,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            expenses,
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const getExpenseById=async (req,res)=>{
    try{
        const id=req.params.id;  //as mongoDB generates id alphanumeric , converting to number will give NaN
        const expense=await Expense.findOne({
            _id: id,
            user: req.user.id
        });
        if(!expense){    //agr id meri document me nahi hai to null return karega
            return res.status(404).json({
                message: "Expense not found",
                success: false
            })
        }
        //else wala case , agr id meri document me hai to goal return karega
        res.status(200).json({
            message: "Expense Retrieved",
            success: true,
            expense
        })
    }
    catch(err){   //database fail wala case  
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const updateExpenseById=async (req,res)=>{
    try{
        const id=req.params.id;
        const expense=await Expense.findOne({
            _id: id, 
            user: req.user.id
        });
        if(!expense){
            return res.status(404).json({
                error: "Expense not found",
                success: false
            })
        }

        Object.assign(expense,req.body);
        await expense.save();

        res.status(200).json({
            message: "Expense Updated",
            success: true,
            expense
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const deleteExpenseById=async (req,res)=>{
    try{
        const id=req.params.id;
        const expense=await Expense.findOne({
            _id: id,
            user: req.user.id
        });
        if(!expense){
            return res.status(404).json({
                message: "Expense not found",
                success: false
            })
        }
        await expense.deleteOne()
        res.status(200).json({
            message: "Expense Deleted",
            success: true,
            expense
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}

module.exports={ createExpense,getExpenses,getExpenseById,updateExpenseById,deleteExpenseById }