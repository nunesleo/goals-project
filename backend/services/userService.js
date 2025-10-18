import { User } from '../models/userModel.js';

class UserService {
  async awardCrown(userId) {
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`User ${userId} not found when awarding crown`);
      return null;
    }

    user.crowns += 1;
    await user.save();
    
    return user;
  }

  async removeCrown(userId) {
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`User ${userId} not found when removing crown`);
      return null;
    }

    user.crowns = Math.max(0, user.crowns - 1);
    await user.save();
    
    return user;
  }

  async deductPointsForContributions(userId, contributions) {
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`User ${userId} not found when deducting points`);
      return null;
    }

    let totalPoints = 0;
    for (const contrib of contributions) {
      totalPoints += contrib.isMilestone ? 50 : 10;
    }

    user.contributionPoints = Math.max(0, user.contributionPoints - totalPoints);
    await user.save();
    
    return user;
  }

  async getUserById(userId) {
    return await User.findById(userId);
  }
}

export default new UserService();