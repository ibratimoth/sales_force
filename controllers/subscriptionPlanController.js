const SubscriptionPlanServices = require('../services/subscriptionPlanService');

class SubscriptionPlanController {
    constructor() {
        this.subscriptionPlanServices = new SubscriptionPlanServices();
    }

    async getAllPlans(req, res) {
        try {
            const results = await this.subscriptionPlanServices.getAllPlans();
            if (!results.success) return res.status(400).json(results);
            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async getPlanById(req, res) {
        try {
            const { planId } = req.params;
            if (!planId) {
                return res.status(400).json({ success: false, message: 'planId is missing' });
            }

            const results = await this.subscriptionPlanServices.getPlanById(planId);
            if (!results.success) return res.status(400).json(results);
            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async createPlan(req, res) {
        try {
            const { name, price, billing_cycle } = req.body;
            if (!name || !price || !billing_cycle) {
                return res.status(400).json({ success: false, message: 'name, price, billing_cycle are required' });
            }

            const planData = { name, price, billing_cycle };
            const results = await this.subscriptionPlanServices.createPlan(planData);

            if (!results.success) return res.status(400).json(results);
            return res.status(201).json(results);

        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async updatePlan(req, res) {
        try {
            const { planId } = req.params;
            const { name, price, billing_cycle } = req.body;

            if (!planId || !name || !price || !billing_cycle) {
                return res.status(400).json({ success: false, message: 'planId, name, price, billing_cycle are required' });
            }

            const planData = { name, price, billing_cycle };
            const results = await this.subscriptionPlanServices.updatePlan(planId, planData);

            if (!results.success) return res.status(400).json(results);
            return res.status(200).json(results);

        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async deletePlan(req, res) {
        try {
            const { planId } = req.params;
            if (!planId) return res.status(400).json({ success: false, message: 'planId is missing' });

            const results = await this.subscriptionPlanServices.deletePlan(planId);
            if (!results.success) return res.status(400).json(results);

            return res.status(200).json(results);

        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }
}

module.exports = SubscriptionPlanController;
