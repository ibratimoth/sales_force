const SubscriptionRepository = require('../repositories/subscriptionRepository');
const { subscriptionRelation } = require('../models/relationship');
const axios = require('axios');
const qs = require('qs');

class SubscriptionService {
    constructor() {
        this.subscriptionRepo = new SubscriptionRepository();

        this.clientId = process.env.AZAMPAY_CLIENT_ID;
        this.clientSecret = process.env.AZAMPAY_CLIENT_SECRET;
        this.callbackURL = process.env.AZAMPAY_CALLBACK_URL;
        this.tokenURL = process.env.AZAMPAY_TOKEN_URL; // e.g., sandbox authenticator URL
        this.azampayBaseURL = 'https://sandbox.azampay.co.tz'; // sandbox base URL
    }

    // Generate OAuth token dynamically
    async getAccessToken() {
        try {
            const payload = qs.stringify({ grant_type: 'client_credentials' });
            const response = await axios.post(this.tokenURL, payload, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
                }
            });
            return response.data.access_token;
        } catch (error) {
            console.error('Failed to get AzamPay access token:', error.response?.data || error.message);
            throw new Error('Failed to authenticate with AzamPay');
        }
    }

    // Create subscription and generate payment request
    async createSubscription(companyId, plan, startDate, endDate, agentCount, paymentMethod) {
        try {
            const totalPrice = subscriptionRelation.calculateTotalPrice(plan, agentCount);

            const subscriptionData = {
                company_id: companyId,
                plan_id: plan.id,
                agent_count: agentCount,
                total_price: totalPrice,
                start_date: startDate,
                end_date: endDate,
                status: 'pending', // awaiting payment
                payment_method: paymentMethod // 'mpesa' or 'crdb'
            };

            const subscription = await this.subscriptionRepo.createSubscription(subscriptionData);

            // Generate payment request
            const paymentRequest = await this.generateAzamPayRequest(subscription);

            return {
                success: true,
                message: 'Subscription created, awaiting payment',
                data: { subscription, paymentRequest }
            };
        } catch (error) {
            console.error('Error creating subscription:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    // Generate AzamPay payment request
    async generateAzamPayRequest(subscription) {
        try {
            const token = await this.getAccessToken();

            const payload = {
                appName: 'agenttrack',
                clientId: this.clientId,
                amount: subscription.total_price,
                currency: 'TZS',
                externalId: subscription.id,
                redirectFailURL: this.callbackURL,
                redirectSuccessURL: this.callbackURL,
                provider: subscription.payment_method.toLowerCase(), // mpesa or crdb
                vendorName: 'AgentTrack',
                vendorId: 'sandbox-vendor-id',
                cart: { items: [] }
            };

            const response = await axios.post(`${this.azampayBaseURL}/api/v1/Partner/PostCheckout`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data; // contains payment URL for frontend
        } catch (error) {
            console.error('AzamPay request failed:', error.response?.data || error.message);
            throw new Error('Payment request failed');
        }
    }

    // Handle payment callback
    async handleAzamPayCallback(transactionReference, paymentStatus) {
        const status = paymentStatus.toLowerCase() === 'success' ? 'active' : 'failed';
        const subscription = await this.subscriptionRepo.updateSubscription(transactionReference, { status });
        return { success: true, message: 'Subscription status updated', data: subscription };
    }

    // Fetch subscriptions by company
    async getCompanySubscriptions(companyId) {
        const subscriptions = await this.subscriptionRepo.getSubscriptionsByCompany(companyId);
        return { success: true, message: 'Subscriptions fetched', data: subscriptions };
    }
}

module.exports = SubscriptionService;
