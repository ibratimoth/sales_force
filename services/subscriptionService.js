const SubscriptionRepository = require('../repositories/subscriptionRepository');

class SubscriptionServices {
    constructor() {
        this.subscriptionRepository = new SubscriptionRepository();
    }

    async getAllSubscriptions() {
        try {
            const results = await this.subscriptionRepository.getAllSubscriptions();
            if (results.length > 0) {
                return { success: true, message: 'Subscriptions fetched successfully', data: results };
            }
            return { success: false, message: 'No subscriptions found', data: [] };
        } catch (error) {
            console.log('Error while fetching subscriptions:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async getSubscriptionById(subscriptionId) {
        try {
            const results = await this.subscriptionRepository.getSubscriptionById(subscriptionId);
            if (results) {
                return { success: true, message: 'Subscription fetched successfully', data: results };
            }
            return { success: false, message: 'Subscription not found', data: null };
        } catch (error) {
            console.log('Error while fetching subscription:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async createSubscription(subscriptionData) {
        try {
            const results = await this.subscriptionRepository.createSubscription(subscriptionData);
            if (results) {
                return { success: true, message: 'Subscription created successfully', data: results };
            }
            return { success: false, message: 'Failed to create subscription', data: null };
        } catch (error) {
            console.log('Error while creating subscription:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async updateSubscription(subscriptionId, subscriptionData) {
        try {
            const results = await this.subscriptionRepository.updateSubscription(subscriptionId, subscriptionData);
            if (results) {
                return { success: true, message: 'Subscription updated successfully', data: results };
            }
            return { success: false, message: 'Failed to update subscription', data: null };
        } catch (error) {
            console.log('Error while updating subscription:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async deleteSubscription(subscriptionId) {
        try {
            const results = await this.subscriptionRepository.deleteSubscription(subscriptionId);
            if (results) {
                return { success: true, message: 'Subscription deleted successfully', data: results };
            }
            return { success: false, message: 'Failed to delete subscription', data: null };
        } catch (error) {
            console.log('Error while deleting subscription:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }
}

module.exports = SubscriptionServices;
