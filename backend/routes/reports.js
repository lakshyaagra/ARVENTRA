const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getSummaryReport,getIncomeCategoryReport,getExpenseCategoryReport,
    getMonthlyIncomeReport,getMonthlyExpenseReport,getLoanStatusReport, getGoalStatusReport}=
    require("../controllers/reportController");

router.get("/summary", authMiddleware, getSummaryReport);

router.get("/income-category", authMiddleware, getIncomeCategoryReport);

router.get("/expense-category", authMiddleware, getExpenseCategoryReport);

router.get("/monthly-income", authMiddleware, getMonthlyIncomeReport);

router.get("/monthly-expense", authMiddleware, getMonthlyExpenseReport);

router.get("/loan-status", authMiddleware, getLoanStatusReport);

router.get("/goal-status", authMiddleware, getGoalStatusReport);

module.exports = router;