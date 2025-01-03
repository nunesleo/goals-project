import express from "express";
import { Contribution } from "../models/contributionModel.js";
import { Goal } from "../models/goalModel.js";

const router = express.Router();

// Route to get all contributions
router.get('/', async (request,response) => {
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

//Get contribution by id
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const contributions = await Contribution.findById(id);

        return response.status(200).json(contributions);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

// Route to save a contribution and link it to a goal
router.post('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        if (!id) {
            return response.status(400).send({
                message: 'The provided goal does not exist'
            });
        } 

        if (!request.body.name || !request.body.description) {
            return response.status(400).send({
                message: 'Send all required fields: name and description'
            });
        }

        const newContribution = {
            name: request.body.name,
            description: request.body.description,
            isMilestone: request.body.isMilestone,
        };

        const contribution = await Contribution.create(newContribution);

        const goal = await Goal.findById(id);
        if (!goal) {
            return response.status(404).send({ message: 'Goal not found' });
        }
        goal.contributions.push(contribution._id);
        await goal.save();

        return response.status(201).send(contribution);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to delete a contribution by id and update the contributions field of the respective goal
router.delete('/:goalId/:id', async (request, response) => {
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

