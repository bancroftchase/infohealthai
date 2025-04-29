require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Twilio webhook endpoint
app.post('/sms', (req, res) => {
  const message = req.body.Body; // Message body
  const from = req.body.From; // Sender's phone number

  let response;
  if (message.toLowerCase().includes('dehydration')) {
    response = 'Symptoms of dehydration include headaches, fatigue, dry mouth, and dizziness. Stay hydrated by drinking plenty of water!';
  } else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
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