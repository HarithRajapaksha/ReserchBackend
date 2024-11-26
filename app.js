const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT||5000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// GET Endpoint for root URL
app.get('/', (req, res) => {
  res.send('Welcome to the ESP32 Data Forwarding Server!');
});

// Endpoint to receive data from ESP32
app.post('/', async (req, res) => {
  const data = req.body; // JSON data sent by ESP32

  if (!data) {
    return res.status(400).json({ error: 'No data received' });
  }

  // Firebase Realtime Database URL
  const firebaseUrl = 'https://esp32sliitresearch-default-rtdb.firebaseio.com/';

  try {
    // Forward the data to Firebase
    const response = await axios.post(firebaseUrl, data, {
      headers: { 'Content-Type': 'application/json' },
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error forwarding data to Firebase:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  const msg = 'Hello Node!\n'; 
  res.end(msg);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
