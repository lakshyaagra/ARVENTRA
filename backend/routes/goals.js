const express = require('express');
const router = express.Router();
const validateGoal = require("../middleware/validateGoal");
const validateUpdateGoal= require('../middleware/validateUpdateGoal')
const { createGoal,getGoals,getGoalById,updateGoalById, deleteGoalById } = require("../controllers/goalController");
const authMiddleware = require('../middleware/authMiddleware');
const upload=require('../config/multer')

router.post('/',authMiddleware,
    upload.single('goalImage') 
    ,validateGoal, createGoal
);

router.get('/',authMiddleware,getGoals); 
router.get('/:id',authMiddleware, getGoalById);
router.put('/:id', authMiddleware,upload.single("goalImage"),validateUpdateGoal, updateGoalById);
router.delete('/:id',authMiddleware, deleteGoalById);

module.exports = router;
