// Import required modules
const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// Middleware to parse JSON requests
app.use(express.json());

// Fallback dictionary for common health topics
const fallbackResponses = {
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

// Serve index.html when visiting the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Chatbot route to handle user messages
app.post('/chat', (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'No message provided' });
  }

  // Normalize the user's message (lowercase, remove spaces)
  const cleanedMessage = userMessage.toLowerCase().replace(/\s+/g, '');

  // Check if the cleaned message matches a fallback
  if (fallbackResponses[cleanedMessage]) {
    return res.json({ reply: fallbackResponses[cleanedMessage] });
  }

  // Default response if no fallback match
  return res.json({ reply: "Thank you for your question. Please consult a medical professional for personalized advice." });
});

// Handle unknown routes with a 404 message
app.use((req, res) => {
  res.status(404).send('<h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p>');
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 InfoHealthAI server is running at http://localhost:${port}`);
});
