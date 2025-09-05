const express = require('express');
const router = express.Router();
const TrackingController = require('../controllers/trackingControllers');
const trackingController = new TrackingController();

// If you have auth middleware
const authMiddleware = require('../middlewares/authMiddleware');
const auth = new authMiddleware();

// Agent check-in
router.post('/checkin', auth.authToken, trackingController.checkIn.bind(trackingController));

// Agent check-out
router.post('/checkout', auth.authToken, trackingController.checkOut.bind(trackingController));

// Check if agent is currently checked in
router.get('/checkin-status/:agentId', auth.authToken, trackingController.isCheckedIn.bind(trackingController));

// Add location (only if agent is checked in)
router.post('/location', auth.authToken, trackingController.addLocation.bind(trackingController));

// Get all locations (route history) for an agent
router.get('/location/:agentId', auth.authToken, trackingController.getAgentRoute.bind(trackingController));

// Get last known location for an agent
router.get('/location/:agentId/last', auth.authToken, trackingController.getLastLocation.bind(trackingController));

// Get all checked-in and checked-out agents
router.get(
    "/agents/status",
    auth.authToken,
    trackingController.getAgentsByStatus.bind(trackingController)
);


module.exports = router;
