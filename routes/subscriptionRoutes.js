const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/subscriptionController');
const SubscriptionServices = new SubscriptionController();

// Create a new subscription
router.post('/subscriptions', SubscriptionServices.createSubscription.bind(SubscriptionServices));

// AzamPay payment callback
router.post('/subscriptions/callback', SubscriptionServices.azamPayCallback.bind(SubscriptionServices));

// Get all subscriptions for a company
router.get('/subscriptions/company/:company_id', SubscriptionServices.getSubscriptionsByCompany.bind(SubscriptionServices));

module.exports = router;
