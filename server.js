const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());

const rareDiseasesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'rareDiseases.json')));

app.post('/api/search', (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  let response = '';

  function searchData(data, query) {
    let result = '';
    Object.keys(data).forEach(key => {
      if (key.toLowerCase().includes(query)) {
        result += `${key}: ${JSON.stringify(data[key])}\n`;
      } else if (typeof data[key] === 'object') {
        result += searchData(data[key], query);
      }
    });
    return result;
  }

  response = searchData(rareDiseasesData, userMessage);

  if (!response) {
    response = 'Please consult your doctor or a medical professional for personalized advice.';
  }

  res.json({ message: response });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});