# SIA Chatbot Backend

This is the backend service for SIA, the AI assistant for Sage-D Marketing (sagedmarketing.co.za). SIA provides service related questions and guide users to proceed for Sage-D Marketing's services.

## Features

- AI-powered chat interface using OpenAI's GPT-4
- Service information and consultation for:
  * Digital Marketing & Brand Promotion
  * Creative Media Production
  * Interactive & Immersive Experiences
  * Business Technology & Web Solutions
  * Event Planning & Execution
- Lead qualification and booking assistance
- Conversation tracking with unique conversation IDs
- Service availability checking
- Real-time chat responses
- Secure API endpoints
- Comprehensive logging
- Error handling and validation
- Database integration for service and lead management

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Add your OpenAI API key to the `.env` file

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### POST /api/chat/message

Send a message to SIA and get a response.

Request body:
```json
{
  "message": "Your message here",
  "conversationId": "unique-conversation-id"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "response": "Jimmy's response",
    "conversationId": "unique-conversation-id"
  }
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 400: Bad Request (invalid input)
- 500: Internal Server Error

## Logging

Logs are stored in the `logs` directory:
- `error.log`: Error messages
- `combined.log`: All logs

## Security

- CORS enabled
- Helmet security headers
- Input validation
- Environment variable protection 