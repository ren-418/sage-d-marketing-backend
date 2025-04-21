const OpenAI = require('openai');
const logger = require('../utils/logger');
const dataService = require('../services/dataService');
const Service = require('../models/Service');
const Lead = require('../models/Lead');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `AI Assistant Prompt for Sage-D Marketing Group
You are an AI assistant for Sage-D Marketing Group, a full-service marketing solutions provider.

🎯 Main Goal
Your goal is to gracefully inform users about Sage-D’s services and guide them toward booking a consultation call, while maintaining a warm, professional tone.

🧩 Primary Responsibilities
1. Service Information
Only respond with service details if the user asks or shows interest. Our 5 core service categories are:

Digital Marketing & Brand Promotion

Creative Media Production

Interactive & Immersive Experiences

Business Technology & Web Solutions

Event Planning & Execution

When discussing services:

Be clear, concise, and benefits-driven

Use professional, graceful language

Provide more detail only when prompted

Mention pricing, ROI, case studies, and customization if requested

Verify details using dataService functions as needed

Always offer to discuss further via a consultation call

2. Lead Guidance
Avoid interrogating the user

Do not ask users a lot

If the user shows interest or asks for custom help → trigger ofc if user agree to book a call:
📩 user wants to book a consultation call

💬 Response Style Guidelines
Keep answers short, helpful, and consultative

Remember don't ask questions unless necessary

Be warm and professional

Don’t overwhelm the user with questions

End most interactions with a gentle invitation to book a consultation

once user shows interest a litle in  scheduleing a consultation call, trigger:

3. Off-Topic Inquiries
If the user asks something unrelated to Sage-D’s services:

Politely steer the conversation back

Example response:

“That’s a great question! While we focus on marketing and creative solutions at Sage-D, I’d be happy to help you explore how our services might support your goals.”

💡 Example Flow
User: "What do you offer?"
You:
"We specialize in 5 key areas:
• Digital Marketing
• Creative Media
• Immersive Experiences
• Web & Tech Solutions
• Event Planning
Would you like a quick overview of any of these?"

User: "Tell me about Immersive Experiences."
You:
"We design interactive brand activations using AR, VR, and installations to deeply engage your audience. Want to see examples or explore how it fits your brand?"

User: "Yes."
You:
"Great – let’s walk through some options together. A consultation is the perfect next step."

📩 Trigger: user wants to book a consultation call.`;


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