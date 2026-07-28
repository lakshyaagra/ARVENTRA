const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    appearance: {
        theme: {
            type: String,
            enum: ["light", "dark", "system"],
            default: "system"
        }
    },
    notifications: {
        emiReminder: {
            type: Boolean,
            default: true
        },
        goalReminder: {
            type: Boolean,
            default: true
        },
        monthlyReport: {
            type: Boolean,
            default: true
        },
        communityNotification: {
            type: Boolean,
            default: true
        },
        aiRecommendation: {
            type: Boolean,
            default: true
        }
    },
    financial: {
        currency: {
            type: String,
            default: "INR"
        },
        salaryDay: {
            type: Number,
            default: 1,
            min: 1,
            max: 31
        }
    },
    ai: {
        enableAI: {
            type: Boolean,
            default: true
        },
        dailySummary: {
            type: Boolean,
            default: true
        },
        weeklyInsights: {
            type: Boolean,
            default: true
        }
    },
    language: {
        type: String,
        default: "English"
    }
},{
    timestamps: true
});

module.exports = mongoose.model("Settings", settingsSchema);