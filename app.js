const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Claude 3 Opus Web Chat Route (for Website)
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        temperature: 0.5,
        messages: [
          {
            role: "user",
            content: userMessage
          }
        ]
      },
      {
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY, // correct API key
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    const botReply = response.data.content[0].text.trim();
    res.json({ reply: botReply });

  } catch (error) {
    console.error('Error contacting Claude API for web chat:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error connecting to Claude API' });
  }
});

// Claude 3 Opus SMS Route (for Twilio)
app.post('/sms', async (req, res) => {
  const incomingMessage = req.body.Body;
  const fromNumber = req.body.From;

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        temperature: 0.5,
        messages: [
          {
            role: "user",
            content: incomingMessage
          }
        ]
      },
      {
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY, // correct API key
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    const botReply = response.data.content[0].text.trim();

    // Respond back to Twilio using TwiML
    const twimlResponse = `
      <Response>
        <Message>${botReply}</Message>
      </Response>
    `;
    res.type('text/xml').send(twimlResponse);

  } catch (error) {
    console.error('Error contacting Claude API for SMS:', error.response ? error.response.data : error.message);

    const fallbackResponse = `
      <Response>
        <Message>Sorry, there was an error processing your request.</Message>
      </Response>
    `;
    res.type('text/xml').send(fallbackResponse);
  }
});

// 404 Handler for any other requests
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 InfoHealthAI server is running at http://localhost:${port}`);
});
