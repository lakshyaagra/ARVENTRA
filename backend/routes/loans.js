const express = require('express');
const router = express.Router();
const validateLoan = require("../middleware/validateLoan");
const validateUpdateLoan= require('../middleware/validateUpdateLoan')
const { createLoan,getLoans,getLoanById,updateLoanById, deleteLoanById } = require("../controllers/loanController");
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',authMiddleware,validateLoan, createLoan);
router.get('/',authMiddleware,getLoans); 
router.get('/:id',authMiddleware, getLoanById);
router.put('/:id', authMiddleware,validateUpdateLoan, updateLoanById);
router.delete('/:id',authMiddleware, deleteLoanById);

module.exports = router;