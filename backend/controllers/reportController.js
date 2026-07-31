const Goal = require("../models/Goal");
const Loan = require("../models/Loan");
const Asset = require("../models/Assets");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
    
const getSummaryReport = async (req, res) => {
    try {
        const month = Number(req.query.month);
        const year = Number(req.query.year);

        const dateFilter={};

        if(month && year){
            dateFilter.$expr={
                $and:[
                    { $eq: [{$month: "$createdAt"}, month] },
                    { $eq: [{$year: "$createdAt"}, year] },               
                ]
            };
        }
        else if(year){
            dateFilter.$expr={
                $eq:[
                    { $year: "$createdAt" }, year           
                ]
            };
        }
        const incomeResult=await Income.aggregate([
        {
            $match:{
                user:req.user.id,
                ...dateFilter
            }
        },
        {
            $group:{
                _id:null,
                totalIncome:{
                    $sum:"$amount"
                }
            }
        }
        ]);
        const totalIncome=incomeResult.length>0?incomeResult[0].totalIncome:0;

        const assetResult=await Asset.aggregate([
            {
                $match:{
                    user:req.user.id,
                    ...dateFilter
                }
            },
            {
                $group:{
                    _id:null,
                    totalAssets:{
                        $sum:"$currentValue"
                    }
                }
            }
        ]);
        const totalAssets=assetResult.length>0?assetResult[0].totalAssets:0;

        const expenseResult=await Expense.aggregate([
            {
                $match:{
                    user:req.user.id,
                    ...dateFilter
                }
            },
            {
                $group:{
                    _id:null,
                    totalExpense:{
                        $sum:"$amount"
                    }
                }
            }
        ]);
        const totalExpense=expenseResult.length>0?expenseResult[0].totalExpense:0;
        const loanResult=await Loan.aggregate([
            {
                $match:{
                    user:req.user.id,
                    ...dateFilter
                }
            },
            {
                $group:{
                    _id:null,
                    totalOutstandingLoans:{
                        $sum:"$outstandingAmount"
                    }
                }
            }
        ]);
        const totalOutstandingLoans =loanResult.length>0?loanResult[0].totalOutstandingLoans:0;

        const netWorth=totalAssets-totalOutstandingLoans;
        const savings=totalIncome-totalExpense;

        res.status(200).json({
            success:true,
            report:{
                totalIncome,
                totalExpense,
                totalAssets,
                totalOutstandingLoans,
                savings,
                netWorth
            }
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
}
const getIncomeCategoryReport = async (req, res) => {
    try {
        const month = Number(req.query.month);
        const year = Number(req.query.year);

        const dateFilter = {};

        if (month && year) {
            dateFilter.$expr = {
                $and: [
                    { $eq: [{ $month: "$createdAt" }, month] },
                    { $eq: [{ $year: "$createdAt" }, year] }
                ]
            };
        }
        else if (year) {
            dateFilter.$expr = {
                $eq: [
                    { $year: "$createdAt" },
                    year
                ]
            };
        }
        const report = await Income.aggregate([
            {
                $match: {
                    user: req.user.id,
                    ...dateFilter
                }
            },
            {
                $group: {
                    _id: "$category",
                    totalAmount: {
                        $sum: "$amount"
                    },
                    totalTransactions: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    totalAmount: -1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            message: "Income category report generated successfully.",
            report
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const getExpenseCategoryReport = async (req, res) => {
    try {
        const month = Number(req.query.month);
        const year = Number(req.query.year);

        const dateFilter = {};

        if (month && year) {
            dateFilter.$expr = {
                $and: [
                    { $eq: [{ $month: "$expenseDate" }, month] },
                    { $eq: [{ $year: "$expenseDate" }, year] }
                ]
            };
        }
        else if (year) {
            dateFilter.$expr = {
                $eq: [
                    { $year: "$expenseDate" },
                    year
                ]
            };
        }
        const report = await Expense.aggregate([
            {
                $match: {
                    user: req.user.id,
                    ...dateFilter
                }
            },
            {
                $group: {
                    _id: "$category",
                    totalAmount: {
                        $sum: "$amount"
                    },
                    totalTransactions: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    totalAmount: -1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            message: "Expense category report generated successfully.",
            report
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const getMonthlyIncomeReport = async (req, res) => {
    try {
        const report = await Income.aggregate([
            {
                $match: {
                    user: req.user.id
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$receivedDate" },
                        month: { $month: "$receivedDate" }
                    },
                    totalIncome: {
                        $sum: "$amount"
                    },
                    totalTransactions: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            message: "Monthly income report generated successfully.",
            report
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const getMonthlyExpenseReport = async (req, res) => {
    try {
        const report = await Expense.aggregate([
            {
                $match: {
                    user: req.user.id
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$expenseDate" },
                        month: { $month: "$expenseDate" }
                    },
                    totalIncome: {
                        $sum: "$amount"
                    },
                    totalTransactions: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            message: "Monthly Expense report generated successfully.",
            report
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const getGoalStatusReport = async (req, res) => {
    try {
        const report = await Goal.aggregate([
            {
                $match: {
                    user: req.user.id
                }
            },
            {
                $group: {
                    _id: "$status",
                    totalLoans: {
                        $sum: 1
                    },
                    totalTargetAmount: {
                        $sum: "$targetAmount"
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            message: "Goal status report generated successfully.",
            report
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const getLoanStatusReport = async (req, res) => {
    try {
        const report = await Loan.aggregate([
            {
                $match: {
                    user: req.user.id
                }
            },
            {
                $group: {
                    _id: "$status",
                    totalLoans: {
                        $sum: 1
                    },
                    totalOutstandingAmount: {
                        $sum: "$outstandingAmount"
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            message: "Loan status report generated successfully.",
            report
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
module.exports = { getSummaryReport,getIncomeCategoryReport,getExpenseCategoryReport,
                   getMonthlyIncomeReport,getMonthlyExpenseReport,getLoanStatusReport,getGoalStatusReport };