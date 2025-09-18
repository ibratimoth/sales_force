const Subscription = require('../models/subscriptionModel');

class SubscriptionRepository {
    // Get all subscriptions
    async getAllSubscriptions() {
        return await Subscription.findAll({ order: [['createdAt', 'DESC']] });
    }

    // Get subscription by ID
    async getSubscriptionById(id) {
        return await Subscription.findByPk(id);
    }

    // Create subscription
    async createSubscription(subscriptionData) {
        return await Subscription.create(subscriptionData);
    }

    // Update subscription
    async updateSubscription(id, updateData) {
        const subscription = await Subscription.findByPk(id);
        if (!subscription) throw new Error('Subscription not found');

        await subscription.update(updateData);
        return subscription;
    }

    // Get subscriptions by company
    async getSubscriptionsByCompany(companyId) {
        return await Subscription.findAll({
            where: { company_id: companyId },
            order: [['createdAt', 'DESC']]
        });
    }
}

module.exports = SubscriptionRepository;
