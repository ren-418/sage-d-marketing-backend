const OpenAI = require('openai');
const logger = require('../utils/logger');
const dataService = require('../services/dataService');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `You are Jimmy, an AI assistant for CellSell (cellsell.co.za), a cell phone retailer. 
Your primary roles are:
1. Technical Support: Help customers with Apple device issues (iPhones, Apple Watches, iPads)
2. Sales Assistant: Suggest products and deals based on customer needs

For Technical Support:
- Provide detailed step-by-step troubleshooting guides
- Help with common issues like:
  * iOS updates and installation problems
  * iCloud backup and sync issues
  * Apple ID recovery and password reset
  * Battery and performance problems
  * Screen and hardware issues
  * App crashes and software bugs
- Guide users through device setup and configuration
- Explain error messages and their solutions
- Provide warranty information and service options
- When needed, direct users to nearby service centers

For Sales Support:
- Suggest products based on:
  * User's budget
  * Specific needs (e.g., photography, gaming, business)
  * Current usage patterns
- Compare different models and their features
- Highlight current promotions and deals
- Check product availability and stock levels
- Provide detailed specifications and features
- Explain warranty and return policies
- Guide users through the purchase process

General Guidelines:
- Always maintain a friendly, professional tone
- Be specific and detailed in your responses
- Use the dataService functions to verify:
  * Product availability
  * Current prices and deals
  * Service center locations
- If unsure about something, be honest and offer to:
  * Connect with a human agent
  * Provide official Apple support documentation
  * Schedule a service center appointment
- Keep responses clear and concise
- Ask clarifying questions when needed
- Maintain context throughout the conversation

Remember to verify all product information, prices, and availability using the dataService functions before providing them to the user.`;

const chatController = {
  async handleMessage(req, res, next) {
    try {
      const { message, conversationId } = req.body;

      // Get relevant data based on the message
      const currentDeals = await dataService.getCurrentDeals();
      const productsOnSale = await dataService.getProductsOnSale();

      // Create a context with the current data
      const context = {
        currentDeals: JSON.stringify(currentDeals),
        productsOnSale: JSON.stringify(productsOnSale)
      };

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "system", content: `Current data context: ${JSON.stringify(context)}` },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
        functions: [
          {
            name: "getProductByModel",
            description: "Get product details by model name",
            parameters: {
              type: "object",
              properties: {
                model: {
                  type: "string",
                  description: "The model name of the product"
                }
              },
              required: ["model"]
            }
          },
          {
            name: "getServiceCentersNearLocation",
            description: "Find service centers near a location",
            parameters: {
              type: "object",
              properties: {
                latitude: {
                  type: "number",
                  description: "Latitude of the location"
                },
                longitude: {
                  type: "number",
                  description: "Longitude of the location"
                }
              },
              required: ["latitude", "longitude"]
            }
          }
        ],
        function_call: "auto"
      });

      const response = completion.choices[0].message;

      // Handle function calls if any
      if (response.function_call) {
        const functionName = response.function_call.name;
        const functionArgs = JSON.parse(response.function_call.arguments);

        let functionResult;
        switch (functionName) {
          case "getProductByModel":
            functionResult = await dataService.getProductByModel(functionArgs.model);
            break;
          case "getServiceCentersNearLocation":
            functionResult = await dataService.getServiceCentersNearLocation(
              functionArgs.latitude,
              functionArgs.longitude
            );
            break;
        }

        // Get final response with function results
        const finalCompletion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: message },
            { role: "assistant", content: response.content },
            { role: "function", name: functionName, content: JSON.stringify(functionResult) }
          ],
          temperature: 0.7,
          max_tokens: 500
        });

        response.content = finalCompletion.choices[0].message.content;
      }

      logger.info(`Chat response generated for conversation ${conversationId}`);

      res.json({
        success: true,
        data: {
          response: response.content,
          conversationId
        }
      });
    } catch (error) {
      logger.error('Error in chat controller:', error);
      next(error);
    }
  }
};

module.exports = { chatController }; 