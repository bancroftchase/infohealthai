const express = require('express');
const bodyParser = require('body-parser');
const smsRoute = require('./routes/sms');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/sms', smsRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
