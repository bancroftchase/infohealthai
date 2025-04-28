const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Claude 3 Opus Chat Route
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
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    const botReply = response.data.content[0].text.trim();
    res.json({ reply: botReply });

  } catch (error) {
    console.error('Error contacting Claude API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error connecting to Claude API' });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 InfoHealthAI server is running at http://localhost:${port}`);
});


