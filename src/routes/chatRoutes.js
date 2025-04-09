const express = require('express');
const router = express.Router();
const { chatController } = require('../controllers/chatController');
const { validateChatRequest } = require('../middleware/validators');

router.post('/message', validateChatRequest, chatController.handleMessage);

module.exports = router; 