const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.json());

const claudeApiUrl = 'https://api.anthropic.com/v1/messages';
const claudeApiKey = 'YOUR_API_KEY'; // Replace with your actual API key

app.post('/sms', async (req, res) => {
  const userMessage = req.body.Body?.toLowerCase()?.trim();

  try {
    const response = await axios.post(claudeApiUrl, {
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    }, {
      headers: {
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
    });

    let reply = response.data.content[0].text;

    if (!reply) {
      reply = 'Please consult a medical professional for personalized advice.';
    }

    res.set("Content-Type", "text/xml");
    res.send(`
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Message>${reply}</Message>
      </Response>
    `);
  } catch (error) {
    console.error(error);
    res.set("Content-Type", "text/xml");
    res.send(`
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Message>Please consult a medical professional for personalized advice.</Message>
      </Response>
    `);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});