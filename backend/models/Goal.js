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
    }
});
const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;