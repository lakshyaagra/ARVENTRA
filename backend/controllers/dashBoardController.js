const mongoose = require("mongoose");

const Goal=require('../models/Goal')
const Loan = require("../models/Loan");
const Asset = require("../models/Assets");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const {
  calculateCreditHealthScore,
  getCreditHealthStatus,
} = require("../services/creditHealthService");

const getDashboard = async (req, res) =>{
    try {
        const userId=new mongoose.Types.ObjectId(req.user.id);
        const totalGoals = await Goal.countDocuments({ user: req.user.id });
        const totalLoans = await Loan.countDocuments({ user: req.user.id });
        const totalExpenseCount = await Expense.countDocuments({ user: req.user.id });
        const totalIncomeRecords = await Income.countDocuments({ user: req.user.id });

        const assetResult=await Asset.aggregate([
            {
                $match:{
                    user:userId
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
        const incomeResult=await Income.aggregate([
            {
                $match:{
                    user:userId
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
        const expenseResult=await Expense.aggregate([
            {
                $match:{
                    user:userId
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
                    user:userId
                }
            },
            {
                $group:{
                    _id:null,
                    totalOutstandingLoans:{
                        $sum:"$outstandingAmount"
                    },
                    totalEMI: {
                        $sum: "$emiAmount",
                    },
                }
            }
        ]);
        const totalOutstandingLoans =loanResult.length>0?loanResult[0].totalOutstandingLoans:0;

        const loanStatus=await Loan.aggregate([
            {
                $match:{
                    user:userId
                }
            },{
                $group:{
                    _id:"$status",
                    count:{
                        $sum:1
                    }
                }
            }
        ])
        const activeLoans=loanStatus.find(item => item._id === "active")?.count || 0;
        const closedLoans=loanStatus.find(item => item._id === "closed")?.count || 0;

        const goalStatus=await Goal.aggregate([
            {
                $match:{
                    user:userId
                }
            },{
                $group:{
                    _id:"$status",
                    count:{
                        $sum:1
                    }
                }
            }
        ])
        const activeGoals=goalStatus.find(item => item._id === "active")?.count || 0;
        const completedGoals=goalStatus.find(item => item._id === "completed")?.count || 0;

        const recentExpenses=await Expense.find({
            user:userId
        }).sort({createdAt:-1}).limit(5).populate("user","name email");
        const recentLoans=await Loan.find({
            user:userId
        }).sort({createdAt:-1}).limit(5).populate("user","name email");
        const recentIncome=await Income.find({
            user:userId
        }).sort({createdAt:-1}).limit(5).populate("user","name email");
        const recentGoals=await Goal.find({
            user:userId
        }).sort({createdAt:-1}).limit(5).populate("user","name email");
        const recentAssets = await Asset.find({
            user: userId
        }).sort({ createdAt: -1 }).limit(5).populate("user","name email");

        const netWorth=totalAssets-totalOutstandingLoans;
        const savings=totalIncome-totalExpense;
        const savingsRate =
        totalIncome > 0
            ? Number(((savings / totalIncome) * 100).toFixed(2))
            : 0;

        const totalEMI = loanResult.length > 0
        ? loanResult[0].totalEMI
        : 0;

        const debtToIncomeRatio =
        totalIncome > 0
            ? Number((totalEMI / totalIncome).toFixed(2))
            : 0;

        const assetLoanRatio =
        totalOutstandingLoans > 0
            ? Number((totalAssets / totalOutstandingLoans).toFixed(2))
            : null;

        const creditHealthScore = calculateCreditHealthScore({
            savingsRate,
            debtToIncomeRatio,
            assetLoanRatio,
            activeLoans,
        });

        const creditHealthStatus = getCreditHealthStatus(creditHealthScore);


        res.status(200).json({
            success:true,
            message: "Dashboard data retrieved successfully.",
            dashboard:{
                totalAssets,
                totalIncome,
                totalExpense,
                totalOutstandingLoans,

                netWorth,
                savings,
                savingsRate,
                totalEMI,
                debtToIncomeRatio,
                assetLoanRatio,

                creditHealthScore,
                creditHealthStatus,

                totalLoans,
                activeLoans,
                closedLoans,

                totalGoals,
                activeGoals,
                completedGoals,

                totalExpenseCount,
                totalIncomeRecords,

                recentAssets,
                recentExpenses,
                recentLoans,
                recentIncome,
                recentGoals
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

module.exports = {getDashboard};