require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Twilio webhook endpoint
app.post('/sms', (req, res) => {
  console.log('Received SMS request:', req.body);
  const message = req.body.Body; 
  const from = req.body.From; 

  console.log('Message:', message); // Log the incoming message

  let response;
  if (message && message.toLowerCase().includes('dehydration')) {
    response = 'Symptoms of dehydration include headaches, fatigue, dry mouth, and dizziness. Stay hydrated by drinking plenty of water!';
  } else if (message && (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi'))) {
    response = 'Hello! How can I assist you today?';
  } else {
    response = 'Thanks for reaching out!';
  }

  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(response);

  res.set("Content-Type", "text/xml");
  res.send(twiml.toString());
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});