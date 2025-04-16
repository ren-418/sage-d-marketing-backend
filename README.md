# SIA Chatbot Backend

This is the backend service for Jimmy, the AI assistant for Sage-D Marketing (sagedmarketing.co.za). SIA provides technical support for Apple devices and sales assistance for Sage-D Marketing's products.

## Features

- Technical support for Apple devices (iPhones, Apple Watches, iPads)
- Sales assistance and product recommendations
- Real-time chat responses using OpenAI's GPT-4
- Secure API endpoints
- Comprehensive logging
- Error handling and validation

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