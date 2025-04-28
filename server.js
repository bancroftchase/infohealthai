const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');
const { MessagingResponse } = require('twilio').twiml;

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Variables to store conversation history
const conversationHistories = {};

// Initialize Anthropic Claude API config
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-20240620";

if (!CLAUDE_API_KEY) {
  console.error("CLAUDE_API_KEY is not set in environment variables");
  process.exit(1);
}

// Helper function to call Claude API
async function callClaudeAPI(messages, systemPrompt = null) {
  try {
    const requestBody = {
      model: CLAUDE_MODEL,
      max_tokens: 4000,
      messages: messages,
    };
    
    // Add system prompt if provided
    if (systemPrompt) {
      requestBody.system = systemPrompt;
    }

    const response = await axios.post('https://api.anthropic.com/v1/messages', requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });

    return response.data.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error.response?.data || error.message);
    return "I'm sorry, I encountered an error processing your request.";
  }
}

// Web chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message, sessionId, systemPrompt } = req.body;
    
    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }

    // Initialize or retrieve conversation history
    if (!conversationHistories[sessionId]) {
      conversationHistories[sessionId] = [];
    }
    
    // Add user message to history
    conversationHistories[sessionId].push({
      role: 'user',
      content: message
    });

    // Call Claude API with conversation history
    const claudeResponse = await callClaudeAPI(
      conversationHistories[sessionId],
      systemPrompt
    );

    // Add Claude's response to history
    conversationHistories[sessionId].push({
      role: 'assistant',
      content: claudeResponse
    });

    // Manage conversation history length (limit to last 10 messages to prevent token limit issues)
    if (conversationHistories[sessionId].length > 10) {
      conversationHistories[sessionId] = conversationHistories[sessionId].slice(-10);
    }

    res.json({ response: claudeResponse });
  } catch (error) {
    console.error('Error in /chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SMS route for Twilio integration
app.post('/sms', async (req, res) => {
  try {
    const incomingMessage = req.body.Body;
    const fromNumber = req.body.From;
    
    if (!incomingMessage || !fromNumber) {
      return res.status(400).send('Missing required parameters');
    }

    // Use phone number as session ID
    const sessionId = `sms_${fromNumber}`;
    
    // Initialize or retrieve conversation history
    if (!conversationHistories[sessionId]) {
      conversationHistories[sessionId] = [];
    }
    
    // Add user message to history
    conversationHistories[sessionId].push({
      role: 'user',
      content: incomingMessage
    });

    // Custom system prompt for SMS interactions
    const smsSystemPrompt = "You are a helpful AI assistant available via SMS. Keep your responses concise and to the point, as they'll be delivered via text message. Limit your responses to 320 characters when possible.";

    // Call Claude API with conversation history
    const claudeResponse = await callClaudeAPI(
      conversationHistories[sessionId], 
      smsSystemPrompt
    );

    // Add Claude's response to history
    conversationHistories[sessionId].push({
      role: 'assistant',
      content: claudeResponse
    });

    // Manage conversation history length (keep even shorter for SMS)
    if (conversationHistories[sessionId].length > 6) {
      conversationHistories[sessionId] = conversationHistories[sessionId].slice(-6);
    }

    // Create TwiML response
    const twiml = new MessagingResponse();
    twiml.message(claudeResponse);

    // Send the response back to Twilio
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  } catch (error) {
    console.error('Error in /sms endpoint:', error);
    
    // Create error TwiML response
    const twiml = new MessagingResponse();
    twiml.message("I'm sorry, I couldn't process your message at this time.");
    
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Basic home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Clear conversation history
app.post('/clear-history', (req, res) => {
  const { sessionId } = req.body;
  
  if (sessionId && conversationHistories[sessionId]) {
    conversationHistories[sessionId] = [];
    res.json({ success: true, message: 'Conversation history cleared' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid session ID' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
