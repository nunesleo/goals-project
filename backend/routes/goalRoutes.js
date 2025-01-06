import express from "express";
import dotenv from 'dotenv';
import { Goal } from "../models/goalModel.js";
import { Contribution } from "../models/contributionModel.js";
import { User } from "../models/userModel.js";

const router = express.Router();
dotenv.config();
const ADMIN_ID = process.env.ADMIN_ID;

// Route to save a Goal
router.post('/', async (request, response) => {
    try {
        if (!request.body.name || !request.body.description) {
            return response.status(400).send({
                message: 'Send all required fields: name and description'
            });
        }

        const newGoal = {
            name: request.body.name,
            description: request.body.description,
        };

        const goal = await Goal.create(newGoal);

        const user = await User.findById(ADMIN_ID);

        user.goals.push(goal._id);
        await user.save();

        return response.status(201).send(goal);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Get all goals
router.get('/', async (request, response) => {
    try {
        const goals = await Goal.find({});

        return response.status(200).json({
            count: goals.length,
            data: goals
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Get goal by id
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const goals = await Goal.findById(id);

        return response.status(200).json(goals);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const goal = await Goal.findById(id);
        const user = await User.findById(ADMIN_ID);

        if (!goal) {
            return response.status(404).json({ message: "Goal not found." });
        }

        if (goal.contributions.length > 0) {
            for (const contributionId of goal.contributions) {
                const contribution = await Contribution.findById(contributionId);

                user.contributionPoints -= contribution.isMilestone ? 50 : 10;

                await Contribution.findByIdAndDelete(contributionId);
            }

            goal.contributions = [];
            await goal.save();
        }
        console.log("Checkpoint 2");

        await Goal.findByIdAndDelete(id);

        user.goals.pull(id);
        await user.save();

        return response.status(200).send({ message: "Goal and its contributions deleted successfully." });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Update a goal
router.put('/:id', async (request, response) => {
    try {
        if (!request.body.name ||
            !request.body.description) {
            return response.status(400).send({
                message: "Send all required fields: name, description"
            });
        }

        const { id } = request.params;
        const result = await Goal.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).json({ message: "Goal not found." });
        }

        return response.status(200).send({ message: "Goal updates successfully." });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

export default router;