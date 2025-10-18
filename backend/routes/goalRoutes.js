import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import goalService from "../services/goalService.js";
import userService from "../services/userService.js";

const router = express.Router();

// Route to save a Goal
router.post('/', authMiddleware, async (request, response) => {
    try {
        const userId = request.user.userId;
        const goal = await goalService.createGoal(request.body, userId);
        return response.status(201).send({ goal });
    } catch (error) {
        console.error('Error creating goal:', error.message);
        if (error.message === 'Name and description are required') {
            return response.status(400).send({ message: error.message });
        }
        return response.status(500).send({ message: error.message });
    }
});

// Get all goals
router.get('/', authMiddleware, async (request, response) => {
    try {
        const userId = request.user.userId;
        const goals = await goalService.getUserGoals(userId);

        return response.status(200).json({
            count: goals.length,
            data: goals
        });
    } catch (error) {
        console.error('Error fetching goals:', error.message);
        return response.status(500).send({ message: error.message });
    }
});

// Get goal by id
router.get('/:id', authMiddleware, async (request, response) => {
    try {
        const { id } = request.params;
        const userId = request.user.userId;

        const goal = await goalService.getGoalById(id, userId);

        return response.status(200).json(goal);

    } catch (error) {
        console.error('Error fetching goal:', error.message);
        
        if (error.message === 'Goal not found') {
            return response.status(404).json({ message: error.message });
        }
        
        return response.status(500).send({ message: error.message });
    }
});

// Delete a goal
router.delete('/:id', authMiddleware, async (request, response) => {
    try {
        const { id } = request.params;
        const userId = request.user.userId;

        const { deletedContributions } = await goalService.deleteGoal(id, userId);

        if (deletedContributions.length > 0) {
            userService.deductPointsForContributions(userId, deletedContributions)
                .catch(error => console.error('Error deducting points:', error));
        }

        return response.status(200).send({ 
            message: "Goal and its contributions deleted successfully." 
        });

    } catch (error) {
        console.error('Error deleting goal:', error.message);
        
        if (error.message === 'Goal not found') {
            return response.status(404).json({ message: error.message });
        }
        return response.status(500).send({ message: error.message });
    }
});

// Update a goal
router.put('/:id', authMiddleware, async (request, response) => {
    try {
        const { id } = request.params;
        const userId = request.user.userId;

        const previousGoal = await goalService.getGoalById(id, userId);
        const wasComplete = previousGoal.isComplete;
        const willBeComplete = request.body.isComplete;

        await goalService.updateGoal(id, userId, request.body);

        if (willBeComplete === true && wasComplete !== true) {
            userService.awardCrown(userId)
                .catch(error => console.error('Error awarding crown:', error));
        } else if (willBeComplete === false && wasComplete === true) {
            userService.removeCrown(userId)
                .catch(error => console.error('Error removing crown:', error));
        }

        return response.status(200).send({ 
            message: "Goal updated successfully." 
        });

    } catch (error) {
        console.error('Error updating goal:', error.message);
        
        if (error.message === 'Goal not found') {
            return response.status(404).json({ message: error.message });
        }
        
        return response.status(500).send({ message: error.message });
    }
});

export default router;