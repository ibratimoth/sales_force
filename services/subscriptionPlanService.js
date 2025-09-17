const SubscriptionPlanRepository = require('../repositories/subscriptionPlanRepository');

class SubscriptionPlanServices {
    constructor() {
        this.subscriptionPlanRepository = new SubscriptionPlanRepository();
    }

    async getAllPlans() {
        try {
            const results = await this.subscriptionPlanRepository.getAllPlans();
            if (results.length > 0) {
                return { success: true, message: 'Plans fetched successfully', data: results };
            }
            return { success: false, message: 'No plans found', data: [] };
        } catch (error) {
            console.log('Error while fetching plans:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async getPlanById(planId) {
        try {
            const results = await this.subscriptionPlanRepository.getPlanById(planId);
            if (results) {
                return { success: true, message: 'Plan fetched successfully', data: results };
            }
            return { success: false, message: 'Plan not found', data: null };
        } catch (error) {
            console.log('Error while fetching plan:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async createPlan(planData) {
        try {
            const results = await this.subscriptionPlanRepository.createPlan(planData);
            if (results) {
                return { success: true, message: 'Plan created successfully', data: results };
            }
            return { success: false, message: 'Failed to create plan', data: null };
        } catch (error) {
            console.log('Error while creating plan:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async updatePlan(planId, planData) {
        try {
            const results = await this.subscriptionPlanRepository.updatePlan(planId, planData);
            if (results) {
                return { success: true, message: 'Plan updated successfully', data: results };
            }
            return { success: false, message: 'Failed to update plan', data: null };
        } catch (error) {
            console.log('Error while updating plan:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async deletePlan(planId) {
        try {
            const results = await this.subscriptionPlanRepository.deletePlan(planId);
            if (results) {
                return { success: true, message: 'Plan deleted successfully', data: results };
            }
            return { success: false, message: 'Failed to delete plan', data: null };
        } catch (error) {
            console.log('Error while deleting plan:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }
}

module.exports = SubscriptionPlanServices;
