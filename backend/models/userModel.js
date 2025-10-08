import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        contributionPoints: {
            type: Number,
            required: true,
            default: 0,
        },
        crowns: {
            type: Number,
            required: true,
            default: 0,
        },
        goals: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Goal",
            },
        ],
        contributions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Contribution",
            }
        ]
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model('User', userSchema);