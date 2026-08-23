const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        select:false,  //password ko response me nahi bhejna chahte , isliye select:false kar diya
        minLength:7,
    },
    lastIncomeIncreaseNotification: {
        type: String,
        default: ""
    },
    lastExpenseIncreaseNotification: {
        type: String,
        default: ""
    },
    lastSavingsAlertMonth: {
        type: String,
        default: ""
    },
    lastSavingsAlertLevel: {
        type: String,
        default: ""
    },
    lastAINotificationDate: {
        type: String,
        default: ""
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    //Hashed email-verification token
    emailVerificationToken: {
        type: String,
        select: false
    },
    emailVerificationExpires: {
        type: Date,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    //Hashed password-reset token
    passwordResetExpires: {
        type: Date,
        select: false
    },
    // Hash of the current refresh token, so a stolen refresh token can be
    // invalidated server-side (logout / rotation) without a separate table.
    // Single active session per user — see README note if multi-device
    // sessions are needed later.
    refreshTokenHash: {
        type: String,
        select: false
    },
})
const User=mongoose.model('User',userSchema);
module.exports=User;