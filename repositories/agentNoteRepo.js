const AgentNote = require('../models/agentNoteModel');

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
