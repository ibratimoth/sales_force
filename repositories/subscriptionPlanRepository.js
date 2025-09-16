const SubscriptionPlan = require('../models/subscriptionPlanModel');

class SubscriptionPlanRepository {
    async getAllPlans() {
        return await SubscriptionPlan.findAll({ order: [['createdAt', 'DESC']] });
    }

    async getPlanById(id) {
        return await SubscriptionPlan.findByPk(id);
    }

    async createPlan(planData) {
        return await SubscriptionPlan.create(planData);
    }

    async updatePlan(planId, planData) {
        const plan = await SubscriptionPlan.findByPk(planId);
        if (!plan) throw new Error("Subscription plan not found");

        await plan.update(planData);
        return plan;
    }

    async deletePlan(planId) {
        const plan = await SubscriptionPlan.findByPk(planId);
        if (!plan) throw new Error("Subscription plan not found");

        return await SubscriptionPlan.destroy({ where: { id: planId } });
    }
}

module.exports = SubscriptionPlanRepository;
