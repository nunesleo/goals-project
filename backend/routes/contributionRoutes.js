import express from "express";
import { Contribution } from "../models/contributionModel.js";
import { Goal } from "../models/goalModel.js";
import { User } from "../models/userModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get all contributions
router.get('/', async (request, response) => {
    try {
        const contributions = await Contribution.find({});

        return response.status(200).json({
            count: contributions.length,
            data: contributions
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

// Route to get all contributions by user
router.get('/:id', authMiddleware, async (request, response) => {
    try {
        const { id } = request.params;
        const userId = request.user.userId;

        const contribution = await Contribution.findById(id);

        if (!contribution) {
            return response.status(404).json({ message: "Contribution not found" });
        }

        // Optional: Check if the contribution belongs to the authenticated user
        if (contribution.user.toString() !== userId) {
            return response.status(403).json({ message: "Access denied" });
        }

        return response.status(200).json(contribution);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to save a contribution and link it to a goal
router.post('/:id', authMiddleware, async (request, response) => {
    try {
        const { id } = request.params;
        const userId = request.user.userId;

        if (!id) {
            return response.status(400).send({ message: 'The provided goal does not exist' });
        }

        if (!request.body.name || !request.body.description) {
            return response.status(400).send({ message: 'Send all required fields: name and description' });
        }

        const goal = await Goal.findById(id);
        if (!goal) {
            return response.status(404).send({ message: 'Goal not found' });
        }

        const newContribution = {
            name: request.body.name,
            description: request.body.description,
            isMilestone: request.body.isMilestone || false,
            goal: id,
            user: userId
        };

        const contribution = await Contribution.create(newContribution);
        goal.contributions.push(contribution._id);

        const user = await User.findById(userId);
        if (user) {
            user.contributionPoints += contribution.isMilestone ? 50 : 10;
            await user.save();
        }

        await goal.save();

        return response.status(201).send(contribution);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to delete a contribution by id and update the contributions field of the respective goal
router.delete('/:goalId/:id', authMiddleware, async (request, response) => {
    try {
        const { goalId, id } = request.params;

        if (!id || !goalId) {
            return response.status(400).json({ message: "Contribution ID and Goal ID are required." });
        }

        const goal = await Goal.findById(goalId);
        if (!goal) {
            return response.status(404).json({ message: "Goal not found." });
        }

        goal.contributions.pull(id);
        await goal.save();

        const contribution = await Contribution.findByIdAndDelete(id);
        if (!contribution) {
            return response.status(404).json({ message: "Contribution not found in the database." });
        }

        //Currently only includes a single user
        const user = await User.findById("677b314df4a42d7fa23648b6");
        user.contributionPoints -= contribution.isMilestone ? 50 : 10;
        await user.save();

        return response.status(200).json({
            message: "Contribution deleted successfully and removed from the goal.",
            contribution,
            updatedGoal: goal,
        });
    } catch (error) {
        console.error("Error:", error.message);
        return response.status(500).json({ message: error.message });
    }
});

export default router;

