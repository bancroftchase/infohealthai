const express = require('express');
const app = express();
const axios = require('axios');
app.use(express.urlencoded({ extended: true }));

const claudeApiUrl = 'https://api.anthropic.com/v1/messages';
const claudeApiKey = process.env.CLAUDE_API_KEY;

if (!claudeApiKey) {
  throw new Error("CLAUDE_API_KEY environment variable is not set");
}

app.post('/sms', async (req, res) => {
  try {
    const userMessage = req.body.Body?.toLowerCase()?.trim();

    console.log(`Incoming message: ${userMessage}`);

    const response = await axios.post(
      claudeApiUrl,
      {
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          'x-api-key': claudeApiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
      }
    );

    // Debug log the raw Claude response
    console.log('Claude raw response:', JSON.stringify(response.data, null, 2));

    let reply;

    if (Array.isArray(response.data.content)) {
      reply = response.data.content.map(c => c.text).join('\n').trim();
    } else if (typeof response.data.content === 'string') {
      reply = response.data.content.trim();
    }

    // Fallback reply if Claude response is empty or missing
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
    console.error('Claude API error:', error.message);
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
  console.log(`Server listening on http://localhost:${port}`);
});