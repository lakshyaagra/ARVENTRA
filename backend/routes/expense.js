const express = require('express');
const router = express.Router();
const validateExpense = require("../middleware/validateExpense");
const validateUpdateExpense = require('../middleware/validateUpdateExpense')
const { createExpense,getExpenses,getExpenseById,updateExpenseById,deleteExpenseById } = require("../controllers/expenseControllers");
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',authMiddleware,validateUpdateExpense, createExpense);
router.get('/',authMiddleware,getExpenses); 
router.get('/:id',authMiddleware, getExpenseById);
router.put('/:id', authMiddleware,validateUpdateExpense, updateExpenseById);
router.delete('/:id',authMiddleware, deleteExpenseById);

module.exports = router;
