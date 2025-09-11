const agentNoteRepo = require('../repositories/agentNoteRepo');

class AgentNoteService {
  async addNote(payload) {
    try {
      const note = await agentNoteRepo.createNote(payload);
      return { success: true, message: 'Note created', data: note };
    } catch (err) {
      return { success: false, message: err.message, data: null };
    }
  }

  async getNotes(agentId) {
    try {
      const notes = await agentNoteRepo.getNotesByAgent(agentId);
      return { success: true, message: 'Notes fetched', data: notes };
    } catch (err) {
      return { success: false, message: err.message, data: [] };
    }
  }

  async getNote(id) {
    try {
      const note = await agentNoteRepo.getNoteById(id);
      if (!note) return { success: false, message: 'Note not found', data: null };
      return { success: true, message: 'Note fetched', data: note };
    } catch (err) {
      return { success: false, message: err.message, data: null };
    }
  }

  async updateNote(id, updates) {
    try {
      const note = await agentNoteRepo.updateNote(id, updates);
      if (!note) return { success: false, message: 'Note not found', data: null };
      return { success: true, message: 'Note updated', data: note };
    } catch (err) {
      return { success: false, message: err.message, data: null };
    }
  }

  async deleteNote(id) {
    try {
      const note = await agentNoteRepo.deleteNote(id);
      if (!note) return { success: false, message: 'Note not found', data: null };
      return { success: true, message: 'Note deleted', data: note };
    } catch (err) {
      return { success: false, message: err.message, data: null };
    }
  }

  async getAgentNoteByDate(agentId, date) {
    try {
      const route = await agentNoteRepo.getAgentNotesByDate(agentId, date);
      return { success: true, message: 'Notes fetched', data: route };
    } catch (err) {
      console.log(err);
      return { success: false, message: err.message, data: [] };
    }
  }
}

module.exports = new AgentNoteService();
