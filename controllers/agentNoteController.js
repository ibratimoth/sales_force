const agentNoteService = require('../services/agentNoteService');

class AgentNoteController {
  async addNote(req, res) {
    try {
      console.log(req.body)
      const result = await agentNoteService.addNote(req.body);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error', data: null });
    }
  }

  async getNotes(req, res) {
    try {
      const { agentId } = req.params;
      const result = await agentNoteService.getNotes(agentId);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error', data: [] });
    }
  }

  async getNote(req, res) {
    try {
      const { id } = req.params;
      const result = await agentNoteService.getNote(id);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error', data: null });
    }
  }

  async updateNote(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const result = await agentNoteService.updateNote(id, updates);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error', data: null });
    }
  }

  async deleteNote(req, res) {
    try {
      const { id } = req.params;
      const result = await agentNoteService.deleteNote(id);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error', data: null });
    }
  }

  async getAgentNoteByDate(req, res) {
    try {
      const { agentId, date } = req.params;

      const result = await agentNoteService.getAgentNoteByDate(agentId, date);

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

module.exports = new AgentNoteController();
