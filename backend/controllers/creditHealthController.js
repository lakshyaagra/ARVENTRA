const mongoose = require("mongoose");

const Loan = require("../models/Loan");
const Asset = require("../models/Assets");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const {
  calculateCreditHealthScore,
  getCreditHealthStatus,
} = require("../services/creditHealthService");

const creditHealthSummary = async (req, res) => {
    try {

        const userId = new mongoose.Types.ObjectId(req.user.id);

        const [assetResult,loanResult,expenseResult,incomeResult,loanStatus]=await Promise.all([
            Asset.aggregate([
                {
                    $match: {
                        user: userId
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAssets: {
                            $sum: "$currentValue"
                        }
                    }
                }
            ]),
            Loan.aggregate([
                {
                    $match: {
                        user: userId
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalOutstandingLoans: {
                            $sum: "$outstandingAmount"
                        },
                        totalEMI: {
                            $sum: "$emiAmount"
                        }
                    }
                }
            ]),
            Expense.aggregate([
                {
                    $match: {
                        user: userId
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalExpense: {
                            $sum: "$amount"
                        }
                    }
                }
            ]),
            Income.aggregate([
                {
                    $match: {
                        user: userId
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalIncome: {
                            $sum: "$amount"
                        }
                    }
                }
            ]),
            Loan.aggregate([
                {
                    $match: {
                        user: userId
                    }
                },
                {
                    $group: {
                        _id: "$status",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ])
        ]);
        const totalAssets =assetResult.length > 0?assetResult[0].totalAssets:0;
        const totalOutstandingLoans =loanResult.length>0?loanResult[0].totalOutstandingLoans:0;

        const totalEMI=loanResult.length>0?loanResult[0].totalEMI:0;
        const totalExpense = expenseResult.length>0?expenseResult[0].totalExpense:0;
        const totalIncome = incomeResult.length>0?incomeResult[0].totalIncome:0;
        const activeLoans = loanStatus.find(item => item._id === "active")?.count || 0;
        const closedLoans = loanStatus.find(item => item._id === "closed")?.count || 0;

        const savings = totalIncome - totalExpense;
        const netWorth = totalAssets - totalOutstandingLoans;

        const savingsRate =totalIncome>0?Number(((savings/totalIncome)*100).toFixed(2)):0;
        const debtToIncomeRatio =totalIncome>0?Number((totalEMI / totalIncome).toFixed(2)):0;
        const assetLoanRatio = totalOutstandingLoans>0?
                    Number((totalAssets / totalOutstandingLoans).toFixed(2)):null;


        const score = calculateCreditHealthScore({
            savingsRate,
            debtToIncomeRatio,
            assetLoanRatio,
            activeLoans
        });

        const healthStatus = getCreditHealthStatus(score);

        res.status(200).json({
            success: true,
            message: "Credit Health Retrieved Successfully",
            creditHealth: {
                totalAssets,
                totalOutstandingLoans,
                totalIncome,
                totalExpense,
                totalEMI,

                savings,
                netWorth,

                savingsRate,
                debtToIncomeRatio,
                assetLoanRatio,

                activeLoans,
                closedLoans,

                score,
                healthStatus
            }
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = {
    creditHealthSummary
};