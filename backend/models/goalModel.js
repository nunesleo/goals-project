import mongoose from "mongoose";
import { Contribution } from "./contributionModel.js";

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
    },
    {
        timestamps: true,
    }
);

export const Goal = mongoose.model('Goal', goalSchema);