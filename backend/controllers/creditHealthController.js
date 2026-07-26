const Loan = require("../models/Loan");
const Asset = require("../models/Assets");
const Expense = require("../models/Expense");
const Income = require("../models/Income");

const creditHealthSummary=async (req,res)=>{
    try{
        const assetResult=await Asset.aggregate([
        {
            $match:{
                user:req.user.id
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

    const loanResult=await Loan.aggregate([
        {
            $match:{
                user:req.user.id
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

    const expenseResult=await Expense.aggregate([
        {
            $match:{
                user:req.user.id
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

    const incomeResult=await Income.aggregate([
        {
            $match:{
                user:req.user.id
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

    const loanStatus=await Loan.aggregate([
        {
            $match:{
                user:req.user.id
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

    const savings=totalIncome-totalExpense;
    const netWorth=totalAssets-totalOutstandingLoans
    const savingsRate= totalIncome>0?Number(((savings/totalIncome)*100).toFixed(2)):0;
    const debtToIncomeRatio=totalIncome>0?Number((totalOutstandingLoans/totalIncome).toFixed(2)):0;
    const assetLoanRatio=totalOutstandingLoans>0?Number((totalAssets/totalOutstandingLoans).toFixed(2)):Infinity;

    const score=calculateCreditHealthScore({ savingsRate,debtToIncomeRatio,
                                                        assetLoanRatio,activeLoans });

    let healthStatus;

    if (score >= 90)
        healthStatus = "Excellent";
    else if (score >= 80)
        healthStatus = "Good";
    else if (score >= 60)
        healthStatus = "Average";
    else if (score >= 40)
        healthStatus = "Poor";
    else
        healthStatus = "Critical";

    res.status(200).json({
        message:"Credit Health Fetched Successfully",
        success:true,
        creditHealth: {
            totalAssets,
            totalOutstandingLoans,
            totalIncome,
            totalExpense,

            netWorth,
            savings,

            savingsRate,
            debtToIncomeRatio,
            assetLoanRatio,

            activeLoans,

            score,
            healthStatus
        }
    })
    }
    catch(err){
        res.status(500).json({
            message:err.message,
            success:false,
        })
    }
}

const calculateCreditHealthScore = ({
    savingsRate,
    debtToIncomeRatio,
    assetLoanRatio,
    activeLoans
}) => {

    let score = 0;

    // Savings Rate (35)

    if (savingsRate >= 40) score += 35;
    else if (savingsRate >= 35) score += 30;
    else if (savingsRate >= 20) score += 25;
    else if (savingsRate >= 10) score += 15;
    else score += 5;

    // Debt To Income (35)

    if (debtToIncomeRatio < 1) score += 35;
    else if (debtToIncomeRatio < 1.5) score += 30;
    else if (debtToIncomeRatio < 3) score += 25;
    else if (debtToIncomeRatio < 5) score += 15;
    else score += 5;

    // Asset Loan Ratio (20)
    if (assetLoanRatio===Infinity) score += 20;
    else if (assetLoanRatio > 5) score += 20;
    else if (assetLoanRatio >= 3) score += 15;
    else if (assetLoanRatio >= 2) score += 10;
    else if (assetLoanRatio >= 1) score += 5;

    // Active Loans (10)

    if (activeLoans === 0) score += 10;
    else if (activeLoans === 1) score += 8;
    else if (activeLoans === 2) score += 6;
    else if (activeLoans === 3) score += 4;
    else score += 2;

    return score;
};
module.exports={ creditHealthSummary }