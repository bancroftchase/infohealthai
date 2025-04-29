require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

app.post('/sms', async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const userMessage = req.body.Body;

  if (!userMessage) {
    twiml.message('Please send a message.');
    res.set("Content-Type", "text/xml");
    res.send(twiml.toString());
    return;
  }

  try {
    const response = await axios.post(CLAUDE_API_URL, {
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{ role: 'user', content: userMessage }]
    }, {
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    });

    const botReply = response.data.content[0].text;
    twiml.message(botReply);
    res.set("Content-Type", "text/xml");
    res.send(twiml.toString());
  } catch (error) {
    console.error(error);
    twiml.message('An error occurred while processing your request.');
    res.set("Content-Type", "text/xml");
    res.send(twiml.toString());
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});