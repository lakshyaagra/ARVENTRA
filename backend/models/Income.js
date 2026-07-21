const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
{
    incomeSource:{
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
        enum:["salary","business","freelancing","investment","rental","interest","gift","bonus","refund","other"],
        default:"other"
    },
    paymentMethod:{
        type:String,
        enum:["cash","upi","credit-card","debit-card","bank-transfer","wallet","other"],
        default:"bank-transfer"
    },
    receivedDate:{
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

const Income = mongoose.model("Income", incomeSchema);
module.exports = Income;