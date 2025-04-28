// Claude 3 Opus Web Chat Route
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
          'x-api-key': process.env.CLAUDE_API_KEY,
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
