// Import required modules
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Twilio SMS Webhook Endpoint
app.post('/sms', (req, res) => {
  const MessagingResponse = twilio.twiml.MessagingResponse;
  const twiml = new MessagingResponse();

  const incomingMessage = req.body.Body ? req.body.Body.trim().toLowerCase() : '';

  let reply = '';

  // Simple fallback responses for SMS
  const smsFallback = {
    stroke: "Stroke is a serious emergency. Seek immediate medical help.",
    diabetes: "Diabetes management includes lifestyle changes and medications. Please consult a healthcare provider.",
    flu: "Flu symptoms include fever, cough, and body aches. Stay hydrated and rest.",
    covid: "COVID-19 symptoms vary. Testing and vaccination are recommended. Seek medical advice if symptoms worsen."
  };

  if (smsFallback[incomingMessage.replace(/\s+/g, '')]) {
    reply = smsFallback[incomingMessage.replace(/\s+/g, '')];
  } else {
    reply = "Thank you for contacting InfoHealthAI. For detailed medical advice, please consult your doctor.";
  }

  twiml.message(reply);

  res.type('text/xml').send(twiml.toString());
});

// Web Chatbot Endpoint
app.post('/chat', (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'No message provided' });
  }

  // Web chatbot fallback responses
  const webFallback = {
    stroke: "Stroke is a serious medical condition where blood flow to the brain is interrupted. Seek emergency medical help immediately.",
    diabetes: "Diabetes is a chronic condition that affects how the body processes blood sugar. Treatments include medication, diet, and exercise.",
    hypertension: "Hypertension, or high blood pressure, increases the risk of heart disease and stroke. Management involves lifestyle changes and medications.",
    asthma: "Asthma is a respiratory condition that causes difficulty breathing due to inflamed airways. Inhalers and medication help manage symptoms.",
    heartattack: "A heart attack occurs when blood flow to the heart is blocked. Symptoms include chest pain, shortness of breath, and nausea. Call emergency services immediately.",
    cancer: "Cancer refers to a group of diseases characterized by uncontrolled cell growth. Treatments vary and can include surgery, chemotherapy, and radiation therapy.",
    depression: "Depression is a mood disorder characterized by persistent sadness and loss of interest. Treatments include therapy, medications, and support systems.",
    flu: "The flu is a contagious respiratory illness caused by influenza viruses. Symptoms include fever, cough, sore throat, and body aches.",
    covid: "COVID-19 is a contagious disease caused by the SARS-CoV-2 virus. Symptoms range from mild to severe, and vaccines are available.",
    allergy: "Allergies occur when the immune system reacts to foreign substances. Treatments include avoiding triggers, antihistamines, and allergy shots."
  };

  const cleanedMessage = userMessage.toLowerCase().replace(/\s+/g, '');

  if (webFallback[cleanedMessage]) {
    return res.json({ reply: webFallback[cleanedMessage] });
  }

  return res.json({ reply: "Thank you for your question. Please consult a medical professional for personalized advice." });
});

// 404 Handler for unknown routes
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 InfoHealthAI server is running at http://localhost:${port}`);
});

