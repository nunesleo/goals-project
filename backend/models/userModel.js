import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        contributionPoints: {
            type: Number,
            required: true,
        },
        crowns: {
            type: Number,
            required: true,
        },
        goals: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Goal",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model('User', userSchema);