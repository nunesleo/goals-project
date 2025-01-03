import express from "express";
import { Goal } from "../models/goalModel.js";
import { Contribution } from "../models/contributionModel.js";

const router = express.Router();

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

        if (!goal) {
            return response.status(404).json({ message: "Goal not found." });
        }

        if (goal.contributions.length > 0) {
            const contributionIds = goal.contributions.map(contribution => contribution._id);
            
            await Contribution.deleteMany({ _id: { $in: contributionIds } });

            goal.contributions = [];
            await goal.save();
        }

        await Goal.findByIdAndDelete(id);

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