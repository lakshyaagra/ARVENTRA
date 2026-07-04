const express = require('express');
const router = express.Router();
const validateGoal = require("../middleware/validateGoal");
const { createGoal,getGoals,getGoalById,updateGoalById, deleteGoalById } = require("../controllers/goalController");

router.post('/',validateGoal, createGoal);
router.get('/', getGoals);
router.get('/:id', getGoalById);
router.put('/:id', validateGoal, updateGoalById);
router.delete('/:id', deleteGoalById);

module.exports = router;