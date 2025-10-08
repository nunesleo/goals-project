import express from "express";
import { Goal } from "../models/goalModel.js";
import { User } from "../models/userModel.js";
import { Contribution } from "../models/contributionModel.js";
import { cat, pipeline } from '@xenova/transformers';
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to save a Goal
router.post('/', authMiddleware, async (request, response) => {
    try {
        if (!request.body.name || !request.body.description) {
            return response.status(400).send({
                message: 'Send all required fields: name and description'
            });
        }

        const newGoal = {
            name: request.body.name,
            description: request.body.description,
            user: request.user.userId
        };

        const goal = await Goal.create(newGoal);
        const user = await User.findById(request.user.userId);

        user.goals.push(goal._id);
        await user.save();

        // AI SUGGESTION FEATURE
        //const output = await generateSuggestions(goal.description);
        //const suggestion = output
        //return response.status(201).send({ goal, suggestion });

        return response.status(201).send({ goal });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Get all goals
router.get('/', authMiddleware, async (request, response) => {
    try {
        const goals = await Goal.find({ user: request.user.userId });

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
router.get('/:id', authMiddleware, async (request, response) => {
    try {
        const { id } = request.params;
        const goal = await Goal.findOne({ _id: id, user: request.user.userId });

        if (!goal) {
            return response.status(404).json({ message: "Goal not found" });
        }

        return response.status(200).json(goal);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

router.delete('/:id', authMiddleware, async (request, response) => {
    try {
        const { id } = request.params;

        const goal = await Goal.findOne({ _id: id, user: request.user.userId });
        const user = await User.findById(request.user.userId);

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
router.put('/:id', authMiddleware, async (request, response) => {
    try {
        const { id } = request.params;

        const goal = await Goal.findOne({ _id: id, user: request.user.userId });
        if (!goal) {
            return response.status(404).json({ message: "Goal not found." });
        }

        const result = await Goal.findByIdAndUpdate(id, request.body, { new: true });
        console.log(request.body);

        if (!result) {
            return response.status(404).json({ message: "Goal not found." });
        }

        if (request.body.isComplete == true) {
            const user = await User.findById(request.user.userId);
            user.crowns += 1;
            await user.save();
        }

        if (request.body.isComplete == false && !request.body.name && !request.body.description) {
            const user = await User.findById(request.user.userId);
            user.crowns -= 1;
            await user.save();
        }

        return response.status(200).send({ message: "Goal updates successfully." });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// async function generateSuggestions(goal) {
//     try {
//         const generator = await pipeline('text-generation', 'Xenova/phi-2');
//         const output = await generator('How can I achieve the goal: ' + goal + '?', { max_new_tokens: 100});
//         console.log(output);
//         return output[0].generated_text;
//     } catch (error) {
//         console.error("Error generating suggestions:", error);
//     }
// }

export default router;
