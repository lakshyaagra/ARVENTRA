const mongoose=require('mongoose')

const assetSchema=new mongoose.Schema({
    assetName:{
        type: String,
        required: true,
        trim:true
    },
    category:{
        type:String,
        enum:["bank","cash","fixed-deposit","recurring-deposit","mutual-fund",
              "stock","gold","property","crypto","epf","ppf","vehicle","business","other"],
        default:"other",
    },
    currentValue:{
        type: Number,
        required:true,
        min:1
    },
    purchaseValue:{
        type: Number,
        min:0
    },
    purchaseDate:{
        type: Date,
        validate: {
            validator: function(value) {
                return !value || value <= new Date();
            },
            message: "Purchase date can not be in the future."
        }
    },
    institution:{
        type: String,
        trim:true
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
},
{
    timestamps:true
})

const Assets=mongoose.model('Assets', assetSchema);
module.exports=Assets;