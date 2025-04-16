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
- If client shows interest in booking exactly:
  * send clear key response so that frontend can recognize the booking request and send it to the booking controller
- Keep responses clear and concise
- Ask clarifying questions when needed
- Maintain context throughout the conversation

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

      // Get relevant data based on the message
      const availableServices = await dataService.getAvailableServices();
      const context = {
        services: availableServices,
        conversationId
      };

      // Check if this is a lead qualification or booking request
      const isLeadQualification = await this.isLeadQualificationRequest(message);
      const isBookingRequest = await this.isBookingRequest(message);

      let response;
      if (isLeadQualification) {
        response = await this.handleLeadQualification(message, context);
      } else if (isBookingRequest) {
        response = await this.handleBookingRequest(message, context);
      } else {
        response = await this.handleServiceQuery(message, context);
      }

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

  async isLeadQualificationRequest(message) {
    const qualificationKeywords = [
      'interested', 'budget', 'timeline', 'requirements',
      'need help', 'looking for', 'want to know more',
      'pricing', 'cost', 'how much'
    ];
    
    return qualificationKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  },

  async isBookingRequest(message) {
    const bookingKeywords = [
      'book', 'schedule', 'meeting', 'call',
      'consultation', 'appointment', 'demo'
    ];
    
    return bookingKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  },

  async handleServiceQuery(message, context) {
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
  },

  async handleLeadQualification(message, context) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;

    // If the response indicates interest in booking, suggest booking options
    if (response.toLowerCase().includes('interested') || 
        response.toLowerCase().includes('book') ||
        response.toLowerCase().includes('schedule')) {
      return response + "\n\nWould you like to schedule a consultation call to discuss your requirements in detail?";
    }

    return response;
  },

  async handleBookingRequest(message, context) {
    // Extract booking details from the message
    const bookingDetails = await this.extractBookingDetails(message);
    
    // Create a new lead with the booking details
    const lead = new Lead({
      ...bookingDetails,
      status: 'New'
    });

    await lead.save();

    return `Thank you for your interest! I've scheduled your consultation for ${bookingDetails.bookingDetails.preferredDate} at ${bookingDetails.bookingDetails.preferredTime}. A member of our team will contact you shortly to confirm the details.`;
  },

  async extractBookingDetails(message) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Extract booking details from the following message. Return only a JSON object with name, email, phone, company, preferredDate, preferredTime, and meetingType." },
        { role: "user", content: message }
      ],
      temperature: 0.3,
      max_tokens: 200
    });

    return JSON.parse(completion.choices[0].message.content);
  }
};

module.exports = { chatController }; 