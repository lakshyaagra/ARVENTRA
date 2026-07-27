const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
{
    discussion:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Discussion",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},
{
    timestamps:true
}
);

//The combination of discussion and user must always be unique. 1->Ascending Index
likeSchema.index(
{
    discussion:1,
    user:1
},
{
    unique:true
}
);
module.exports=mongoose.model("Like",likeSchema);