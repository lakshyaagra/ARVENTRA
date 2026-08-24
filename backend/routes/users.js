const express=require('express');
const router=express.Router();

const { registerUser, loginUser, getCurrentUser,refreshAccessToken, logoutUser,verifyEmail, 
        resendVerification,forgotPassword, resetPassword }= require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRegister = require('../middleware/validateRegister');
const validateLogin = require('../middleware/validateLogin');
const validateEmailOnly = require('../middleware/validateEmailOnly');
const validateResetPassword = require('../middleware/validateResetPassword');
const { loginLimiter, registerLimiter, forgotPasswordLimiter } = require('../utils/rateLimiters');

router.post('/register',registerLimiter,validateRegister,registerUser);
router.post('/login',loginLimiter,validateLogin,loginUser);
router.get('/me',authMiddleware,getCurrentUser);

router.post('/refresh-token',refreshAccessToken);
router.post('/logout',logoutUser);

router.post('/verify-email/:token',verifyEmail);
router.post('/resend-verification',forgotPasswordLimiter,validateEmailOnly,resendVerification);

router.post('/forgot-password',forgotPasswordLimiter,validateEmailOnly,forgotPassword);
router.post('/reset-password/:token',validateResetPassword,resetPassword);

module.exports=router;