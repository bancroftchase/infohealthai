const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const userMessage = req.body.Body;
  const MessagingResponse = require('twilio').twiml.MessagingResponse;
  const twiml = new MessagingResponse();

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-haiku-20240307',
        max_tokens: 400,
        messages: [{ role: 'user', content: userMessage }]
      },
      {
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    twiml.message(response.data.content[0].text.trim());
  } catch (error) {
    console.error(error);
    twiml.message("Sorry, I'm having trouble responding right now.");
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

module.exports = router;
