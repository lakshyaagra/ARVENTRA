const express=require('express');
const router=express.Router();
const upload=require('../config/multer')

const {registerUser,loginUser}= require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register',registerUser);
router.post('/login',loginUser);


module.exports=router;