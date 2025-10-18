import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import contributionService from '../services/contributionService.js';
import userPointsService from '../services/userPointsService.js';
import { Contribution } from '../models/contributionModel.js';

const router = express.Router();

// Route to save a contribution and link it to a goal
router.post('/:id', authMiddleware, async (request, response) => {
    try {
        const { id: goalId } = request.params;
        const userId = request.user.userId;

        if (!goalId) {
            return response.status(400).send({
                message: 'Goal ID is required'
            });
        }

        const contribution = await contributionService.createContribution(
            goalId,
            request.body,
            userId
        );

        userPointsService.awardPoints(userId, contribution.isMilestone)
            .catch(error => console.error('Error awarding points:', error));

        return response.status(201).send(contribution);

    } catch (error) {
        console.error('Error creating contribution:', error.message);

        if (error.message === 'Goal not found') {
            return response.status(404).send({ message: error.message });
        }
        if (error.message === 'Name and description are required') {
            return response.status(400).send({ message: error.message });
        }

        return response.status(500).send({ message: error.message });
    }
});

// Route to get all contributions
router.get('/', authMiddleware, async (request, response) => {
    try {
        const userId = request.user.userId;
        const contributions = await contributionService.getUserContributions(userId);

        return response.status(200).json({
            count: contributions.length,
            data: contributions,
        });
    } catch (error) {
        console.error('Error fetching contributions:', error.message);
        return response.status(500).send({ message: error.message });
    }
});

// Route to get a single contribution by ID
router.get('/:id', authMiddleware, async (request, response) => {
    try {
        const { id } = request.params;
        const contribution = await contributionService.getContributionById(id);

        return response.status(200).json(contribution);
    } catch (error) {
        console.error('Error fetching contribution:', error.message);

        if (error.message === 'Contribution not found') {
            return response.status(404).send({ message: error.message });
        }

        return response.status(500).send({ message: error.message });
    }
});

// Route to delete a contribution by id and update the contributions field of the respective goal
router.delete('/:goalId/:id', authMiddleware, async (request, response) => {
    try {
        const { goalId, id: contributionId } = request.params;

        if (!contributionId || !goalId) {
            return response.status(400).json({
                message: "Contribution ID and Goal ID are required."
            });
        }

        const { contribution, goal } = await contributionService.deleteContribution(
            goalId,
            contributionId
        );

        userPointsService.deductPoints(contribution.user, contribution.isMilestone)
            .catch(error => console.error('Error deducting points:', error));

        return response.status(200).json({
            message: "Contribution deleted successfully and removed from the goal.",
            contribution,
            updatedGoal: goal,
        });

    } catch (error) {
        console.error('Error deleting contribution:', error.message);

        if (error.message === 'Goal not found' ||
            error.message === 'Contribution not found in the database') {
            return response.status(404).json({ message: error.message });
        }

        return response.status(500).json({ message: error.message });
    }
});

export default router;