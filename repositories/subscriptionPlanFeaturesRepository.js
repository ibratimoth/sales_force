const SubscriptionPlanFeature = require('../models/subscriptionPlanFeatureModel');

class SubscriptionPlanFeatureRepository {
    async getAllFeatures() {
        return await SubscriptionPlanFeature.findAll({ order: [['createdAt', 'DESC']] });
    }

    async getFeatureById(id) {
        return await SubscriptionPlanFeature.findByPk(id);
    }

    async createFeature(featureData) {
        return await SubscriptionPlanFeature.create(featureData);
    }

    async updateFeature(featureId, featureData) {
        const feature = await SubscriptionPlanFeature.findByPk(featureId);
        if (!feature) throw new Error("Feature not found");

        await feature.update(featureData);
        return feature;
    }

    async deleteFeature(featureId) {
        const feature = await SubscriptionPlanFeature.findByPk(featureId);
        if (!feature) throw new Error("Feature not found");

        return await SubscriptionPlanFeature.destroy({ where: { id: featureId } });
    }
}

module.exports = SubscriptionPlanFeatureRepository;
