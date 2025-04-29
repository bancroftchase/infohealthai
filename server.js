const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rareDiseasesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'rareDiseases.json')));

app.post('/sms', (req, res) => {
  const userMessage = req.body.Body?.toLowerCase()?.trim();
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

  res.set("Content-Type", "text/xml");
  res.send(`
    <?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Message>${response}</Message>
    </Response>
  `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});