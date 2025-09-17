const SubscriptionServices = require('../services/subscriptionService');

class SubscriptionController {
    constructor() {
        this.subscriptionServices = new SubscriptionServices();
    }

    async getAllSubscriptions(req, res) {
        try {
            const results = await this.subscriptionServices.getAllSubscriptions();
            if (!results.success) return res.status(400).json(results);
            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async getSubscriptionById(req, res) {
        try {
            const { subscriptionId } = req.params;
            if (!subscriptionId) return res.status(400).json({ success: false, message: 'subscriptionId is missing' });

            const results = await this.subscriptionServices.getSubscriptionById(subscriptionId);
            if (!results.success) return res.status(400).json(results);

            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async createSubscription(req, res) {
        try {
            const { company_id, plan_id, start_date, end_date, status } = req.body;
            if (!company_id || !plan_id || !start_date || !end_date) {
                return res.status(400).json({ success: false, message: 'companyId, planId, startDate are required' });
            }

            const subscriptionData = { company_id, plan_id, start_date, end_date, status };
            const results = await this.subscriptionServices.createSubscription(subscriptionData);

            if (!results.success) return res.status(400).json(results);
            return res.status(201).json(results);

        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async updateSubscription(req, res) {
        try {
            const { subscriptionId } = req.params;
            const { company_id, plan_id, start_date, end_date, status } = req.body;

            if (!subscriptionId || !company_id || !plan_id) {
                return res.status(400).json({ success: false, message: 'subscriptionId, companyId, planId are required' });
            }

            const subscriptionData = { company_id, plan_id, start_date, end_date, status };
            const results = await this.subscriptionServices.updateSubscription(subscriptionId, subscriptionData);

            if (!results.success) return res.status(400).json(results);
            return res.status(200).json(results);

        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async deleteSubscription(req, res) {
        try {
            const { subscriptionId } = req.params;
            if (!subscriptionId) return res.status(400).json({ success: false, message: 'subscriptionId is missing' });

            const results = await this.subscriptionServices.deleteSubscription(subscriptionId);
            if (!results.success) return res.status(400).json(results);

            return res.status(200).json(results);

        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }
}

module.exports = SubscriptionController;
