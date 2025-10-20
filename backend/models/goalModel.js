import mongoose from "mongoose";

const goalSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        contributions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Contribution",
            },
        ],
        isComplete: {
            type: Boolean,
            default: false,
        },
        aiSuggestion: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true,
    }
);

export const Goal = mongoose.model('Goal', goalSchema);