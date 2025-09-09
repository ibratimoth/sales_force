const Location = require('../models/locationModel');
const Attendance = require('../models/ettendanceModal');
const { userRelation } = require('../models/relationship');
const { Op } = require('sequelize');

class TrackingRepository {

    // Save agent location
    async saveLocation(agentId, lat, lng) {
        return await Location.create({
            agent_id: agentId,
            lat,
            lng,
            timestamp: new Date()
        });
    }

    // Get all locations for an agent (route history)
    async getAgentLocations(agentId) {
        return await Location.findAll({
            where: { agent_id: agentId },
            order: [['timestamp', 'ASC']]
        });
    }

    // Get last known location
    async getLastLocation(agentId) {
        return await Location.findOne({
            where: { agent_id: agentId },
            order: [['timestamp', 'DESC']]
        });
    }

    /** ATTENDANCE METHODS **/

    // Create a new check-in
    async createCheckin(agentId) {
        return await Attendance.create({
            agent_id: agentId,
            checkin_time: new Date(),
            checkout_time: null
        });
    }

    // Get active check-in (checkout_time is null)
    async getActiveCheckin(agentId) {
        return await Attendance.findOne({
            where: { agent_id: agentId, checkout_time: null }
        });
    }

    // Set checkout_time for active check-in
    async checkout(agentId) {
        const active = await this.getActiveCheckin(agentId);
        if (!active) throw new Error('No active check-in found');
        active.checkout_time = new Date();
        return await active.save();
    }

    // Check if agent is currently checked in
    async isCheckedIn(agentId) {
        const active = await this.getActiveCheckin(agentId);
        return !!active;
    }

    // Get all agents with their check-in/out status
    async getAgentsByStatus() {
        const checkedIn = await Attendance.findAll({
            where: { checkout_time: null },
            include: userRelation,
            order: [['checkin_time', 'DESC']]
        });

        const checkedOut = await Attendance.findAll({
            where: { checkout_time: { [require('sequelize').Op.ne]: null } },
            include: userRelation,
            order: [['checkout_time', 'DESC']]
        });

        return { checkedIn, checkedOut };
    }

    async getAgentLocationsByDate(agentId, date) {
        const where = { agent_id: agentId };

        if (date) {
            where.timestamp = {
                [Op.between]: [
                    new Date(`${date}T00:00:00.000Z`),
                    new Date(`${date}T23:59:59.999Z`),
                ],
            };
        }

        return await Location.findAll({
            where,
            order: [['timestamp', 'ASC']],
        });
    }

}

module.exports = TrackingRepository;
