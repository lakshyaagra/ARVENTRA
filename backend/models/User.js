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
})
const User=mongoose.model('User',userSchema);
module.exports=User;