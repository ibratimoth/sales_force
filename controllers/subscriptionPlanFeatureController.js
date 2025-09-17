const SubscriptionPlanFeatureServices = require('../services/subscriptionPlanFeatureServices');

class SubscriptionPlanFeatureController {
    constructor() {
        this.featureServices = new SubscriptionPlanFeatureServices();
    }

    async getAllFeatures(req, res) {
        try {
            const results = await this.featureServices.getAllFeatures();
            if (!results.success) return res.status(400).json(results);
            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async getFeatureById(req, res) {
        try {
            const { featureId } = req.params;
            if (!featureId) return res.status(400).json({ success: false, message: 'featureId is missing' });

            const results = await this.featureServices.getFeatureById(featureId);
            if (!results.success) return res.status(400).json(results);

            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async createFeature(req, res) {
        try {
            const { plan_id, feature_name, feature_value } = req.body;
            if (!plan_id || !feature_name) {
                return res.status(400).json({ success: false, message: 'planId and feature_name are required' });
            }

            const featureData = { plan_id, feature_name, feature_value };
            const results = await this.featureServices.createFeature(featureData);

            if (!results.success) return res.status(400).json(results);
            return res.status(201).json(results);

        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async updateFeature(req, res) {
        try {
            const { featureId } = req.params;
            const { plan_id, feature_name, feature_value } = req.body;

            if (!featureId || !plan_id || !feature_name) {
                return res.status(400).json({ success: false, message: 'featureId, planId, and name are required' });
            }

            const featureData = { plan_id, feature_name, feature_value };
            const results = await this.featureServices.updateFeature(featureId, featureData);

            if (!results.success) return res.status(400).json(results);
            return res.status(200).json(results);

        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async deleteFeature(req, res) {
        try {
            const { featureId } = req.params;
            if (!featureId) return res.status(400).json({ success: false, message: 'featureId is missing' });

            const results = await this.featureServices.deleteFeature(featureId);
            if (!results.success) return res.status(400).json(results);

            return res.status(200).json(results);

        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }
}

module.exports = SubscriptionPlanFeatureController;
