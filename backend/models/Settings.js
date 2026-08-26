const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    notifications: {
        emiReminder: {
            type: Boolean,
            default: true
        },
        savingsAlert: {
            type: Boolean,
            default: true
        },
        aiRecommendation: {
            type: Boolean,
            default: true
        }
    },
    ai: {
        enableAI: {
            type: Boolean,
            default: true
        }
    },
    appearance: {
        reduceMotion: {
            type: Boolean,
            default: false
        }
    }
},{
    timestamps: true
});

module.exports = mongoose.model("Settings", settingsSchema);