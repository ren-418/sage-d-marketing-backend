const Joi = require('joi');
const { errorHandler } = require('./errorHandler');

const chatRequestSchema = Joi.object({
  message: Joi.string().required().min(1).max(1000),
  conversationId: Joi.string().required()
});

const validateChatRequest = (req, res, next) => {
  const { error } = chatRequestSchema.validate(req.body);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    return next(err);
  }
  
  next();
};

module.exports = { validateChatRequest }; 