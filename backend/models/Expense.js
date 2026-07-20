const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
{
    expenseName:{
        type:String,
        required:true,
        trim:true
    },
    amount:{
        type:Number,
        required:true,
        min:1
    },
    category:{
        type:String,
        enum:["food","transport","shopping","entertainment","health",
            "education","bills","travel","investment","family","other"],
        default:"other"
    },
    paymentMethod:{
        type:String,
        enum:["cash","upi","credit-card","debit-card","bank-transfer","wallet","other"],
        default:"cash"
    },
    expenseDate:{
        type:Date,
        default:Date.now
    },
    notes:{
        type:String,
        trim:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},
{
    timestamps:true
});

const Expense = mongoose.model("Expense",expenseSchema);
module.exports=Expense;