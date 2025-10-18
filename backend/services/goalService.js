// backend/services/goalService.js

import { Goal } from '../models/goalModel.js';
import { User } from '../models/userModel.js';
import { Contribution } from '../models/contributionModel.js';

class GoalService {
  async createGoal(goalData, userId) {
    if (!goalData.name || !goalData.description) {
      throw new Error('Name and description are required');
    }

    const newGoal = {
      name: goalData.name,
      description: goalData.description,
      user: userId
    };

    const goal = await Goal.create(newGoal);

    const user = await User.findById(userId);
    if (user) {
      user.goals.push(goal._id);
      await user.save();
    }

    return goal;
  }

  async getUserGoals(userId) {
    return await Goal.find({ user: userId });
  }

  async getGoalById(goalId, userId) {
    const goal = await Goal.findOne({ _id: goalId, user: userId });
    if (!goal) {
      throw new Error('Goal not found');
    }
    return goal;
  }

  async updateGoal(goalId, userId, updateData) {
    const goal = await Goal.findOne({ _id: goalId, user: userId });
    if (!goal) {
      throw new Error('Goal not found');
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId, 
      updateData, 
      { new: true }
    );

    return updatedGoal;
  }


  async deleteGoal(goalId, userId) {
    const goal = await Goal.findOne({ _id: goalId, user: userId });
    if (!goal) {
      throw new Error('Goal not found');
    }

    const contributionIds = goal.contributions;
    const deletedContributions = [];

    if (contributionIds.length > 0) {
      for (const contributionId of contributionIds) {
        const contribution = await Contribution.findById(contributionId);
        if (contribution) {
          deletedContributions.push({
            isMilestone: contribution.isMilestone
          });
          await Contribution.findByIdAndDelete(contributionId);
        }
      }
    }

    await Goal.findByIdAndDelete(goalId);

    const user = await User.findById(userId);
    if (user) {
      user.goals.pull(goalId);
      await user.save();
    }

    return { deletedContributions };
  }

  async toggleGoalCompletion(goalId, userId, isComplete) {
    const goal = await this.updateGoal(goalId, userId, { isComplete });
    return goal;
  }
}

export default new GoalService();