const express = require('express');
const router = express.Router();
const agentNoteController = require('../controllers/agentNoteController');

// Create note
router.post('/agent-note', agentNoteController.addNote.bind(agentNoteController));

// Get all notes for an agent
router.get('/agent-note/:agentId', agentNoteController.getNotes.bind(agentNoteController));

// Get single note
router.get('/agent-note/single/:id', agentNoteController.getNote.bind(agentNoteController));

// Update note
router.put('/agent-note/:id', agentNoteController.updateNote.bind(agentNoteController));

// Delete note
router.delete('/agent-note/:id', agentNoteController.deleteNote.bind(agentNoteController));

router.get('/agent-note/:agentId/:date', agentNoteController.getAgentNoteByDate.bind(agentNoteController));

module.exports = router;
