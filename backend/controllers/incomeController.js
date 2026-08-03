const Income=require('../models/Income')
const User=require('../models/User')
const {createNotification}=require('../services/notificationService')

const createIncome = async (req, res) => {
    try {
        req.body.user = req.user.id;
        const income = await Income.create(req.body);

        // Income Added Notification
        await createNotification({
            user: req.user.id,
            title: "💰 Income Added",
            message: `₹${income.amount} has been added as ${income.incomeSource}.`,
            type: "income"
        });

        //promotional notification for income increase
        const now = new Date();
        const currentMonthStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const currentMonthEnd = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        // Current Month Income
        const currentMonthIncome = await Income.aggregate([
            {
                $match: {
                    user: req.user.id,
                    receivedDate: {
                        $gte: currentMonthStart,
                        $lt: currentMonthEnd
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount"
                    }
                }
            }
        ]);


        const currentIncome=currentMonthIncome.length>0?currentMonthIncome[0].total:0;

        // Find latest previous month having income
        const previousIncomeDoc = await Income.findOne({
            user: req.user.id,
            receivedDate: {
                $lt: currentMonthStart
            }
        }).sort({ receivedDate: -1 });

        if (previousIncomeDoc) {
            const previousDate = previousIncomeDoc.receivedDate;

            const previousMonthStart = new Date(
                previousDate.getFullYear(),
                previousDate.getMonth(),
                1
            );

            const previousMonthEnd = new Date(
                previousDate.getFullYear(),
                previousDate.getMonth() + 1,
                1
            );

            const previousMonthIncome = await Income.aggregate([
                {
                    $match: {
                        user: req.user.id,
                        receivedDate: {
                            $gte: previousMonthStart,
                            $lt: previousMonthEnd
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount"
                        }
                    }
                }
            ]);

            const previousIncome =previousMonthIncome.length > 0? previousMonthIncome[0].total: 0;
            const currentMonthKey=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, "0")}`;
            //August 2026 becomes 2026-08

            const user = await User.findById(req.user.id);

            if (previousIncome > 0 && currentIncome > previousIncome &&
                user.lastIncomeIncreaseNotification !== currentMonthKey){
                await createNotification({
                    user: req.user.id,
                    title: "📈 Income Increased",
                    message: "Congratulations! Your income this month is higher than your last earning month.",
                    type: "income"
                });
                user.lastIncomeIncreaseNotification = currentMonthKey;
                await user.save();
            }
        }
        res.status(201).json({
            success: true,
            message: "Income Created",
            income
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const getIncomes=async (req,res)=>{
    try{
        //sorting
        const sortField=req.query.sort || 'createdAt';
        const allowedSortFields = ["createdAt","incomeSource","amount","receivedDate"];
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

        const allowedCategories=["salary","business","freelancing","investment",
                                "rental","interest","gift","bonus","refund","other"];

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
            filter.incomeSource={
                $regex:search,
                $options:"i"
            }
        }

        //pagination
        const page=Number(req.query.page) || 1;
        const limit=Number(req.query.limit) || 15;
        const skip=limit*(page-1);
        const totalIncomes=await Income.countDocuments(filter);
        const totalPages=Math.ceil(totalIncomes/limit);
        const hasNextPage=page<totalPages;
        const hasPreviousPage=page>1;

        const incomes=await Income.find(filter).populate('user',"name email")
                    .sort(sortObject).skip(skip).limit(limit);
        
        res.status(200).json({
            message:"Incomes Retrieved",
            success:true,
            currPage:page,
            totalIncomes,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            incomes,
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const getIncomeById=async (req,res)=>{
    try{
        const id=req.params.id;  //as mongoDB generates id alphanumeric , converting to number will give NaN
        const income=await Income.findOne({
            _id: id,
            user: req.user.id
        });
        if(!income){    //agr id meri document me nahi hai to null return karega
            return res.status(404).json({
                message: "Income not found",
                success: false
            })
        }
        //else wala case , agr id meri document me hai to goal return karega
        res.status(200).json({
            message: "Income Retrieved",
            success: true,
            income
        })
    }
    catch(err){   //database fail wala case  
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const updateIncomeById=async (req,res)=>{
    try{
        const id=req.params.id;
        const income=await Income.findOne({
            _id: id, 
            user: req.user.id
        });
        if(!income){
            return res.status(404).json({
                message: "Income not found",
                success: false
            })
        }

        Object.assign(income,req.body);
        await income.save();

        res.status(200).json({
            message: "Income Updated",
            success: true,
            income
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const deleteIncomeById=async (req,res)=>{
    try{
        const id=req.params.id;
        const income=await Income.findOne({
            _id: id,
            user: req.user.id
        });
        if(!income){
            return res.status(404).json({
                message: "Income not found",
                success: false
            })
        }
        await income.deleteOne()
        res.status(200).json({
            message: "Income Deleted",
            success: true,
            income
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
module.exports={ createIncome,getIncomes,getIncomeById,updateIncomeById,deleteIncomeById }