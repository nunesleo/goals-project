import { User } from '../models/userModel.js';

class UserPointsService {
    async awardPoints(userId, isMilestone) {
        const points = isMilestone ? 50 : 10;

        const user = await User.findById(userId);
        if (!user) {
            console.warn(`User ${userId} not found when awarding points`);
            return null;
        }

        user.contributionPoints += points;
        await user.save();

        return user;
    }

    async deductPoints(userId, isMilestone) {
        const points = isMilestone ? 50 : 10;

        const user = await User.findById(userId);
        if (!user) {
            console.warn(`User ${userId} not found when deducting points`);
            return null;
        }

        user.contributionPoints = Math.max(0, user.contributionPoints - points);
        await user.save();

        return user;
    }

    async getUserPoints(userId) {
        const user = await User.findById(userId);
        return user ? user.contributionPoints : 0;
    }
}

export default new UserPointsService();