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
    status:{
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;