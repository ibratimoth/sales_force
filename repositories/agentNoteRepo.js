const AgentNote = require('../models/agentNoteModel');
const { Op } = require('sequelize');

class AgentNoteRepo {
  async createNote({ agentId, lat, lng, locationName, activityDone }) {
    return await AgentNote.create({
      agent_id: agentId,
      lat,
      lng,
      location_name: locationName,
      activity_done: activityDone,
      timestamp: new Date(),
    });
  }

  async getNotesByAgent(agentId) {
    return await AgentNote.findAll({
      where: { agent_id: agentId },
      order: [['timestamp', 'DESC']],
    });
  }

  async getNoteById(id) {
    return await AgentNote.findByPk(id);
  }

  async getAgentNotesByDate(agentId, date) {
    const where = { agent_id: agentId };

    if (date) {
      where.timestamp = {
        [Op.between]: [
          new Date(`${date}T00:00:00.000Z`),
          new Date(`${date}T23:59:59.999Z`),
        ],
      };
    }

    return await AgentNote.findAll({
      where,
      order: [['timestamp', 'ASC']],
    });
  }

  async updateNote(id, updates) {
    const note = await this.getNoteById(id);
    if (!note) return null;
    return await note.update(updates);
  }

  async deleteNote(id) {
    const note = await this.getNoteById(id);
    if (!note) return null;
    await note.destroy();
    return note;
  }
}

module.exports = new AgentNoteRepo();
