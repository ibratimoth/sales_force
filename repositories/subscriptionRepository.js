const Subscription = require('../models/subscriptionModel');

class SubscriptionRepository {
    async getAllSubscriptions() {
        return await Subscription.findAll({ order: [['createdAt', 'DESC']] });
    }

    async getSubscriptionById(id) {
        return await Subscription.findByPk(id);
    }

    async createSubscription(subscriptionData) {
        return await Subscription.create(subscriptionData);
    }

    async updateSubscription(subscriptionId, subscriptionData) {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) throw new Error("Subscription not found");

        await subscription.update(subscriptionData);
        return subscription;
    }

    async deleteSubscription(subscriptionId) {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) throw new Error("Subscription not found");

        return await Subscription.destroy({ where: { id: subscriptionId } });
    }
}

module.exports = SubscriptionRepository;
