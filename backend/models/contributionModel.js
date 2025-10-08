import mongoose from "mongoose";

const contributionSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        isMilestone: {
            type: Boolean,
            required: true
        },
        goal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Goal",
            required: true
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

export const Contribution = mongoose.model('Contribution', contributionSchema);