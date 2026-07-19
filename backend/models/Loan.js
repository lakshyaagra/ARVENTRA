const mongoose=require('mongoose')

const loanSchema=new mongoose.Schema({
    loanName:{
        type:String,
        required: true,
        trim:true
    },
    lender:{
        type:String,
        required:true,
        trim:true
    },
    principalAmount:{
        type:Number,
        required:true,
        min:1
    },
    outstandingAmount:{
        type:Number,
        required:true,
        min:0
    },
    interestRate:{
        type:Number,
        required:true,
        min:0
    },
    loanTerm:{
        type:Number,
        required:true,
        min:1   // stored in months
    },
    loanType: {
        type: String,
        enum: ["home","education","vehicle","gold","personal","business","credit-card","friend","relative","other"],
        default: "other"
    },
    emiAmount:{
        type: Number,
        min: 0
    },
    nextDueDate:{
        type: Date,
        validate: {
            validator: function(value) {
                return !value || value > new Date();
            },
            message: "Next due date must be in the future."
        }
    },
    status:{
        type:String,
        enum:["active","closed"],
        default:"active"
    },
    notes: {
        type: String,
        trim: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})
const Loan=mongoose.model('Loan', loanSchema);
module.exports=Loan;