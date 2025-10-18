import { Contribution } from '../models/contributionModel.js';
import { Goal } from '../models/goalModel.js';

class ContributionService {

    async createContribution(goalId, contributionData, userId) {
        if (!contributionData.name || !contributionData.description) {
            throw new Error('Name and description are required');
        }

        const goal = await Goal.findById(goalId);
        if (!goal) {
            throw new Error('Goal not found');
        }

        const newContribution = {
            name: contributionData.name,
            description: contributionData.description,
            isMilestone: contributionData.isMilestone || false,
            goal: goalId,
            user: userId
        };

        const contribution = await Contribution.create(newContribution);

        goal.contributions.push(contribution._id);
        await goal.save();

        return contribution;
    }

    async getUserContributions(userId) {
        return await Contribution.find({ user: userId });
    }

    async getContributionById(contributionId) {
        const contribution = await Contribution.findById(contributionId);
        if (!contribution) {
            throw new Error('Contribution not found');
        }
        return contribution;
    }

    async deleteContribution(goalId, contributionId) {
        const goal = await Goal.findById(goalId);
        if (!goal) {
            throw new Error('Goal not found');
        }

        goal.contributions.pull(contributionId);
        await goal.save();

        const contribution = await Contribution.findByIdAndDelete(contributionId);
        if (!contribution) {
            throw new Error('Contribution not found in the database');
        }

        return { contribution, goal };
    }
}

export default new ContributionService();