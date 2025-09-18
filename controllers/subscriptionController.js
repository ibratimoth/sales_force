const SubscriptionService = require('../services/subscriptionService');

class SubscriptionController {
    constructor() {
        this.subscriptionService = new SubscriptionService();
    }

    async createSubscription(req, res) {
        try {
            const { company_id, plan_id, agent_count, start_date, end_date, payment_method } = req.body;

            if (!company_id || !plan_id || !agent_count || !start_date || !end_date || !payment_method) {
                return res.status(400).json({ status: 400, success: false, message: 'All required fields must be provided' });
            }

            const results = await this.subscriptionService.createSubscription(
                company_id,
                { id: plan_id },
                new Date(start_date),
                new Date(end_date),
                agent_count,
                payment_method
            );

            if (!results.success) return res.status(500).json({ status: 500, success: false, message: results.message, data: results.error });

            return res.status(201).json({ status: 201, success: true, message: results.message, data: results.data });
        } catch (error) {
            console.error('Error creating subscription:', error);
            return res.status(500).json({ status: 500, success: false, message: 'Error occurred', data: error });
        }
    }

    async azamPayCallback(req, res) {
        try {
            const { transactionReference, paymentStatus, signature } = req.body;

            if (!transactionReference || !paymentStatus || !signature) {
                return res.status(400).json({ status: 400, success: false, message: 'Missing required fields' });
            }

            // Optional: verify callback signature using Client Secret here

            const results = await this.subscriptionService.handleAzamPayCallback(transactionReference, paymentStatus);

            return res.status(200).json({ status: 200, success: results.success, message: results.message, data: results.data });
        } catch (error) {
            console.error('Error in AzamPay callback:', error);
            return res.status(500).json({ status: 500, success: false, message: 'Error occurred', data: error });
        }
    }

    async getSubscriptionsByCompany(req, res) {
        try {
            const { company_id } = req.params;
            if (!company_id) return res.status(400).json({ status: 400, success: false, message: 'company_id is missing' });

            const results = await this.subscriptionService.getCompanySubscriptions(company_id);

            if (!results.success) return res.status(500).json({ status: 500, success: false, message: results.message, data: results.error });

            return res.status(200).json({ status: 200, success: true, message: results.message, data: results.data });
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            return res.status(500).json({ status: 500, success: false, message: 'Error occurred', data: error });
        }
    }
}

module.exports = SubscriptionController;
