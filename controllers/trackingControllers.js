// controllers/trackingController.js
const TrackingService = require('../services/trackingServices');

class TrackingController {
    constructor() {
        this.trackingService = new TrackingService();
    }

    /** AGENT CHECK-IN **/
    /** AGENT CHECK-IN **/
    async checkIn(req, res) {
        try {
            const { agentId } = req.body;
            const result = await this.trackingService.checkIn(agentId);

            // ✅ Emit real-time event
            if (result.success && req.app.get('io')) {
                req.app.get('io').emit('agentCheckIn', { agentId });
            }

            return res.status(result.success ? 200 : 400).json(result);
        } catch (err) {
            console.error('Check-in error:', err);
            return res.status(500).json({
                success: false,
                message: 'Server error during check-in',
                data: null
            });
        }
    }


    /** AGENT CHECK-OUT **/
    /** AGENT CHECK-OUT **/
    async checkOut(req, res) {
        try {
            const { agentId } = req.body;
            const result = await this.trackingService.checkOut(agentId);

            // ✅ Emit real-time event
            if (result.success && req.app.get('io')) {
                req.app.get('io').emit('agentCheckOut', { agentId });
            }

            return res.status(result.success ? 200 : 400).json(result);
        } catch (err) {
            console.error('Check-out error:', err);
            return res.status(500).json({
                success: false,
                message: 'Server error during check-out',
                data: null
            });
        }
    }

    /** ADD LOCATION **/
    async addLocation(req, res) {
        try {
            const { agentId, lat, lng } = req.body;
            const result = await this.trackingService.addLocation(agentId, lat, lng);

            // Emit to all managers (or optionally to rooms)
            if (result.success && req.app.get('io')) {
                const io = req.app.get('io');
                const payload = {
                    agentId,
                    lat,
                    lng,
                    timestamp: new Date().toISOString() // standardized timestamp
                };

                // Emit to all connected clients (e.g., managers)
                io.emit('locationUpdate', payload);

                // Optional: emit to a room per agent (if you want targeted updates)
                io.to(`agent_${agentId}`).emit('agentLocationUpdate', payload);
            }

            return res.status(result.success ? 200 : 400).json(result);
        } catch (err) {
            console.error('Add location error:', err);
            return res.status(500).json({
                success: false,
                message: 'Server error saving location',
                data: null
            });
        }
    }

    /** GET AGENT ROUTE HISTORY **/
    async getAgentRoute(req, res) {
        try {
            const { agentId } = req.params;
            const result = await this.trackingService.getAgentRoute(agentId);
            return res.status(result.success ? 200 : 400).json(result);
        } catch (err) {
            console.error('Get route error:', err);
            return res.status(500).json({ success: false, message: 'Server error fetching route', data: [] });
        }
    }

    async getLastLocation(req, res) {
        try {
            const { agentId } = req.params;
            const result = await this.trackingService.getLastLocation(agentId);
            return res.status(result.success ? 200 : 400).json(result);
        } catch (err) {
            console.error('Get last location error:', err);
            return res.status(500).json({ success: false, message: 'Server error fetching last location', data: null });
        }
    }

    async isCheckedIn(req, res) {
        try {
            const { agentId } = req.params;
            const result = await this.trackingService.isCheckedIn(agentId);
            return res.status(result.success ? 200 : 400).json(result);
        } catch (err) {
            console.error('Check-in status error:', err);
            return res.status(500).json({ success: false, message: 'Server error fetching check-in status', data: false });
        }
    }

    async getAgentsByStatus(req, res) {
        try {
            const result = await this.trackingService.getAgentsByStatus();
            return res.status(result.success ? 200 : 400).json(result);
        } catch (err) {
            console.error("Get agents status error:", err);
            return res.status(500).json({
                success: false,
                message: "Server error fetching agents status",
                data: { checkedIn: [], checkedOut: [] }
            });
        }
    }

    /** GET /api/tracking/route-history/:agentId?date=YYYY-MM-DD **/
    async getAgentRouteByDate(req, res) {
        try {
            const { agentId, date } = req.params;

            const result = await this.trackingService.getAgentRouteByDate(agentId, date);

            return res.status(result.success ? 200 : 400).json(result);
        } catch (err) {
            console.error('Get route error:', err);
            return res.status(500).json({
                success: false,
                message: 'Server error fetching route',
                data: [],
            });
        }
    }

}

module.exports = TrackingController;
