const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, set } = require('firebase/database');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON data
app.use(bodyParser.json());

app.use(express.json());


// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyALY_i4fAMJA3pNUXkJHOFfILbkTJiI8ZE",
  authDomain: "esp32sliitresearch.firebaseapp.com",
  databaseURL: "esp32sliitresearch-default-rtdb.firebaseio.com",
  projectId: "esp32sliitresearch",
  storageBucket: "esp32sliitresearch.appspot.com",
  messagingSenderId: "957117000572",
  appId: "1:957117000572:web:a5268b528db68a7e8692f9"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

// Firebase Authentication Credentials
const email = "it21192050@my.sliit.lk";
const password = "200007901313";

// Root Endpoint
app.get('/get', (req, res) => {
  res.send('Welcome to the ESP32 Data Forwarding Server!');
});

// Endpoint to handle data from ESP32
app.post('/', async (req, res) => {
  const data = req.body; // JSON data sent by ESP32
  console.log('Data received:', data);

  if (!data) {
    return res.status(400).json({ error: 'No data received' });
  }

  try {
    // Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Successfully authenticated:', userCredential.user.email);

    // Write data to Firebase Realtime Database
    const dbRef = ref(database, 'data');
    const newDataRef = push(dbRef); // Create a unique key for the data
    await set(newDataRef, data);

    res.status(200).json({ message: 'Data successfully sent to Firebase', dataKey: newDataRef.key });
  } catch (error) {
    console.error('Error sending data to Firebase:', error.message);
    res.status(500).json({ error: error.message });
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
