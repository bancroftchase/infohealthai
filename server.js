app.post('/sms', (req, res) => {
  console.log('Request Body:', req.body); // Log the request body
  const message = req.body.Body || req.body.message; 

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