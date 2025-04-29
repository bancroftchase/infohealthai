const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());

const rareDiseasesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'rareDiseases.json')));

app.post('/api/search', (req, res) => {
  const userMessage = req.body.message?.toLowerCase()?.trim();
  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

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

  const response = searchData(rareDiseasesData, userMessage);

  if (!response) {
    return res.json({ message: 'Please consult your doctor or a medical professional for personalized advice.' });
  }

  res.json({ message: response });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});