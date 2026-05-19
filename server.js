const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));   // serve index.html

const RECORDS_FILE = path.join(__dirname, 'records.json');

// Make sure records.json exists
if (!fs.existsSync(RECORDS_FILE)) {
  fs.writeFileSync(RECORDS_FILE, '[]');
}

// Get all records
app.get('/records', (req, res) => {
  const data = fs.readFileSync(RECORDS_FILE);
  res.json(JSON.parse(data));
});

// Submit a new record
app.post('/submit', (req, res) => {
  const newRecord = {
    timestamp: new Date().toISOString(),
    ...req.body
  };

  let records = [];
  try {
    records = JSON.parse(fs.readFileSync(RECORDS_FILE));
  } catch (e) {}

  records.push(newRecord);
  fs.writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2));

  res.json({ success: true, message: 'Score saved!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});