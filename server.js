// Import required modules
const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

// Middleware to parse JSON requests
app.use(express.json());

const rareDiseasesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'rareDiseases.json')));

// Serve index.html when visiting the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Chatbot route to handle user messages
app.post('/sms', (req, res) => {
  const userMessage = req.body.Body?.toLowerCase()?.trim();
  let response = '';

  function searchData(data, query) {
    let result = '';
    Object.keys(data).forEach(key => {
      if (key.toLowerCase().includes(query)) {
        result += `${key}: ${JSON.stringify(data[key])}\n`;
      } else if (typeof data[key] === 'object') {
        const nestedResult = searchData(data[key], query);
        if (nestedResult) {
          result += nestedResult;
        }
      }
    });
    return result;
  }

  response = searchData(rareDiseasesData, userMessage);

  if (!response) {
    response = 'Please consult a medical professional for personalized advice.';
  }

  res.set("Content-Type", "text/xml");
  res.send(`
    <?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Message>${response}</Message>
    </Response>
  `);
});

// Handle unknown routes with a 404 message
app.use((req, res) => {
  res.status(404).send('<h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p>');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 InfoHealthAI server is running at http://localhost:${port}`);
});