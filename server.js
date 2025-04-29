require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/sms', (req, res) => {
  console.log('Request Body:', req.body); 
  const twiml = new twilio.twiml.MessagingResponse();
  
  if (req.body && req.body.Body) {
    const message = req.body.Body.toLowerCase();
    if (message.includes('dehydration')) {
      twiml.message('Symptoms of dehydration include headaches, fatigue, dry mouth, and dizziness. Stay hydrated by drinking plenty of water!');
    } else if (message.includes('hello') || message.includes('hi')) {
      twiml.message('Hello! How can I assist you today?');
    } else {
      twiml.message('Thanks for reaching out!');
    }
  } else {
    twiml.message('Thanks for reaching out!');
  }

  res.set("Content-Type", "text/xml");
  res.send(twiml.toString());
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});