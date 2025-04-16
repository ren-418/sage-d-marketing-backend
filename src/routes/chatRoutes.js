const express = require('express');
const router = express.Router();
const { chatController } = require('../controllers/chatController');
const { validateChatRequest } = require('../middleware/validators');

// Initialize database with sample data
router.post('/init', chatController.initializeData);

// Handle chat messages
router.post('/message', validateChatRequest, chatController.handleMessage);

module.exports = router; 