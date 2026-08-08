const express=require('express');
const router=express.Router();
const upload=require('../config/multer')

const {registerUser,loginUser, getCurrentUser}= require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/me',authMiddleware,getCurrentUser);


module.exports=router;