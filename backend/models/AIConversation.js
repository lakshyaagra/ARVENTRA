const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
},{
    _id: false   //we donot need an id for message really
});
const aiConversationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        default: "New Conversation"
    },
    messages: [messageSchema],
    summary: {
        type: String,
        default: ""
    },
},{
    timestamps: true
});

module.exports = mongoose.model("AIConversation",aiConversationSchema);