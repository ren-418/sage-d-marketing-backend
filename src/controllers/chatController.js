const OpenAI = require('openai');
const logger = require('../utils/logger');
const dataService = require('../services/dataService');
const Service = require('../models/Service');
const Lead = require('../models/Lead');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `You are an AI assistant for Sage-D Marketing Group, a comprehensive marketing solutions provider. 
Your primary roles are:
1. Service Information: Provide detailed information about Sage-D's marketing services
2. Lead Qualification: Identify potential clients and guide them through the booking process

For Service Information:
- Explain the following services in detail:
  * Digital Marketing & Brand Promotion
  * Creative Media Production
  * Interactive & Immersive Experiences
  * Business Technology & Web Solutions
  * Event Planning & Execution
- Provide pricing information when requested
- Explain service benefits and ROI
- Share case studies and success stories
- Discuss service packages and customization options

For Lead Qualification:
- Ask relevant questions to understand client needs
- Identify budget and timeline
- Determine service requirements
- Gauge interest level
- Suggest appropriate service packages
- Guide through booking process

General Guidelines:
- Maintain a professional, consultative tone
- Be specific and detailed in responses
- Use the dataService functions to verify:
  * Service availability
  * Current pricing
- If client eager to dive into deep conversation about the services or anyway if you think user is interested in discussing :
  * send response message as "user wants to book a consultation call" to the frontend so that frontend can recognize the booking request and send user to the booking page
- Keep responses clear and very very short
- Ask clarifying questions when needed
- Maintain context throughout the conversation

overall goal is to let users to book a consultation call or contact us eventually.

Remember to verify all service information and availability using the dataService functions before providing them to the client.`;


const services = [
  {
    name: "Digital Marketing & Brand Promotion",
    description: "Comprehensive digital marketing solutions including social media management, corporate profiling, and paid advertising",
    price: "Custom",
    features: [
      "Social Media & LinkedIn Management",
      "Corporate Client Profiling",
      "Paid Ads & Analytics",
      "Marketing & Promotions"
    ],
    category: "Digital Marketing",
    isAvailable: true
  },
  {
    name: "Creative Media Production",
    description: "Professional media production services including videography, photography, and CGI",
    price: "Custom",
    features: [
      "Videography",
      "Photography (Studio & Outdoor)",
      "Graphic Design",
      "Computer-Generated Imagery (CGI)",
      "TV Production",
      "Podcast Short Clipping",
      "Drone Footage"
    ],
    category: "Media Production",
    isAvailable: true
  },
  {
    name: "Interactive & Immersive Experiences",
    description: "Engaging digital experiences and interactive content solutions",
    price: "Custom",
    features: [
      "Interactive Content Development",
      "Gamification Strategies",
      "Augmented Reality (AR) Features"
    ],
    category: "Interactive",
    isAvailable: true
  },
  {
    name: "Business Technology & Web Solutions",
    description: "Comprehensive business automation and web development services",
    price: "Custom",
    features: [
      "Business Automations & CRM",
      "Web Development",
      "Database Marketing"
    ],
    category: "Technology",
    isAvailable: true
  },
  {
    name: "Event Planning & Execution",
    description: "Full-service event planning and marketing solutions",
    price: "Custom",
    features: [
      "Events Set Up",
      "Marketing & Promotions for Events",
      "Brand Activations"
    ],
    category: "Events",
    isAvailable: true
  }
];

const handleServiceQuery = async (message, context) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: message }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return completion.choices[0].message.content;
}

const chatController = {

  async initializeData(req, res, next) {
    try {
      // Clear existing data
      await Service.deleteMany({});
      await Lead.deleteMany({});

      // Insert new data
      await Service.insertMany(services);

      logger.info('Database initialized successfully');
      res.json({
        success: true,
        message: 'Database initialized successfully',
        data: {
          services: services.length
        }
      });
    } catch (error) {
      logger.error('Error initializing database:', error);
      next(error);
    }
  },

  async handleMessage(req, res, next) {
    try {
      const { message, conversationId } = req.body;
      const availableServices = await dataService.getAvailableServices();
      const context = {
        services: availableServices,
        conversationId
      };
      const response = await handleServiceQuery(message, context);
      res.json({
        success: true,
        data: {
          response,
          conversationId
        }
      });
    } catch (error) {
      logger.error('Error handling message:', error);
      next(error);
    }
  },


};

module.exports = { chatController }; 