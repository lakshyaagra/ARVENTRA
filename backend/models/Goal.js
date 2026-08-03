const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    goalName: {
        type: String,
        required: true,
        trim: true
    },
    targetAmount: {
        type: Number,
        required: true,
        min:1
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    priority:{
        type:String,
        enum:["low","medium","high"],
        default:"medium"
    },
    category: {
        type: String,
        enum: ["education","travel","electronics","vehicle","home","investment","emergency","personal","other"],
        default: "other"
    },
    deadline:{
        type: Date,
        validate: {
            validator: function(value){
                return !value || value>new Date();
            },
            message: "Deadline must be a future date."
        }
    },
    description:{
        type:String,
        trim:true
    },
    status:{
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    image:{
        type:String,
    },
    publicId:{
        type:String,
    },
    milestonesNotified: {
        type: [Number],
        default: []
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;