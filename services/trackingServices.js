// services/trackingService.js
const TrackingRepository = require('../repositories/trackingRepository');

class TrackingService {
  constructor() {
    this.trackingRepo = new TrackingRepository();
  }

  /** LOCATION METHODS **/

  async addLocation(agentId, lat, lng) {
    try {
      const checkedIn = await this.trackingRepo.isCheckedIn(agentId);
      if (!checkedIn) return { success: false, message: 'Agent is not checked in', data: null };

      const location = await this.trackingRepo.saveLocation(agentId, lat, lng);
      return { success: true, message: 'Location saved', data: location };
    } catch (err) {
      return { success: false, message: err.message, data: null };
    }
  }

  async getAgentRoute(agentId) {
    try {
      const route = await this.trackingRepo.getAgentLocations(agentId);
      return { success: true, message: 'Route fetched', data: route };
    } catch (err) {
      return { success: false, message: err.message, data: [] };
    }
  }

  async getLastLocation(agentId) {
    try {
      const location = await this.trackingRepo.getLastLocation(agentId);
      return { success: true, message: 'Last location fetched', data: location };
    } catch (err) {
      return { success: false, message: err.message, data: null };
    }
  }

  /** ATTENDANCE METHODS **/

  async checkIn(agentId) {
    try {
      const alreadyCheckedIn = await this.trackingRepo.isCheckedIn(agentId);
      if (alreadyCheckedIn) return { success: false, message: 'Agent already checked in', data: null };

      const result = await this.trackingRepo.createCheckin(agentId);
      return { success: true, message: 'Checked in successfully', data: result };
    } catch (err) {
      return { success: false, message: err.message, data: null };
    }
  }

  async checkOut(agentId) {
    try {
      const checkedIn = await this.trackingRepo.isCheckedIn(agentId);
      if (!checkedIn) return { success: false, message: 'Agent is not checked in', data: null };

      const result = await this.trackingRepo.checkout(agentId);
      return { success: true, message: 'Checked out successfully', data: result };
    } catch (err) {
      return { success: false, message: err.message, data: null };
    }
  }

  async isCheckedIn(agentId) {
    try {
      const checkedIn = await this.trackingRepo.isCheckedIn(agentId);
      return { success: true, message: 'Checked in status fetched', data: checkedIn };
    } catch (err) {
      return { success: false, message: err.message, data: false };
    }
  }

  async getAgentsByStatus() {
    try {
      const result = await this.trackingRepo.getAgentsByStatus();
      return { success: true, message: "Agents status fetched", data: result };
    } catch (err) {
      return { success: false, message: err.message, data: { checkedIn: [], checkedOut: [] } };
    }
  }

  async getAgentRouteByDate(agentId, date) {
    try {
      const route = await this.trackingRepo.getAgentLocationsByDate(agentId, date);
      return { success: true, message: 'Route fetched', data: route };
    } catch (err) {
      console.log(err);
      return { success: false, message: err.message, data: [] };
    }
  }

}

module.exports = TrackingService;
