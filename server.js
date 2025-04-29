app.post('/sms', (req, res) => {
  const userMessage = req.body.Body?.toLowerCase()?.trim();
  console.log('Received message:', userMessage);
  let response = '';

  function searchData(data, query) {
    let result = '';
    Object.keys(data).forEach(key => {
      console.log('Searching key:', key);
      if (key.toLowerCase().includes(query)) {
        result += `${key}: ${JSON.stringify(data[key])}\n`;
      } else if (typeof data[key] === 'object') {
        const nestedResult = searchData(data[key], query);
        if (nestedResult) {
          result += nestedResult;
        }
      }
    });
    console.log('Search result:', result);
    return result;
  }

  response = searchData(rareDiseasesData, userMessage);

  if (!response) {
    console.log('No result found, sending default response');
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