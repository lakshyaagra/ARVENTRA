const express = require('express');
const router = express.Router();
const validateIncome = require("../middleware/validateIncome");
const validateUpdateIncome = require('../middleware/validateUpdateIncome')
const { createIncome,getIncomes,getIncomeById,updateIncomeById,deleteIncomeById } = require("../controllers/incomeControllers");
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',authMiddleware,validateUpdateIncome, createIncome);
router.get('/',authMiddleware,getIncomes); 
router.get('/:id',authMiddleware, getIncomeById);
router.put('/:id', authMiddleware,validateUpdateIncome, updateIncomeById);
router.delete('/:id',authMiddleware, deleteIncomeById);

module.exports = router;
