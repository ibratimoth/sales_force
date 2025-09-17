const SubscriptionPlanFeatureRepository = require('../repositories/subscriptionPlanFeatureRepository');

class SubscriptionPlanFeatureServices {
    constructor() {
        this.featureRepository = new SubscriptionPlanFeatureRepository();
    }

    async getAllFeatures() {
        try {
            const results = await this.featureRepository.getAllFeatures();
            if (results.length > 0) {
                return { success: true, message: 'Features fetched successfully', data: results };
            }
            return { success: false, message: 'No features found', data: [] };
        } catch (error) {
            console.log('Error while fetching features:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async getFeatureById(featureId) {
        try {
            const results = await this.featureRepository.getFeatureById(featureId);
            if (results) {
                return { success: true, message: 'Feature fetched successfully', data: results };
            }
            return { success: false, message: 'Feature not found', data: null };
        } catch (error) {
            console.log('Error while fetching feature:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async createFeature(featureData) {
        try {
            const results = await this.featureRepository.createFeature(featureData);
            if (results) {
                return { success: true, message: 'Feature created successfully', data: results };
            }
            return { success: false, message: 'Failed to create feature', data: null };
        } catch (error) {
            console.log('Error while creating feature:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async updateFeature(featureId, featureData) {
        try {
            const results = await this.featureRepository.updateFeature(featureId, featureData);
            if (results) {
                return { success: true, message: 'Feature updated successfully', data: results };
            }
            return { success: false, message: 'Failed to update feature', data: null };
        } catch (error) {
            console.log('Error while updating feature:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async deleteFeature(featureId) {
        try {
            const results = await this.featureRepository.deleteFeature(featureId);
            if (results) {
                return { success: true, message: 'Feature deleted successfully', data: results };
            }
            return { success: false, message: 'Failed to delete feature', data: null };
        } catch (error) {
            console.log('Error while deleting feature:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }
}

module.exports = SubscriptionPlanFeatureServices;
