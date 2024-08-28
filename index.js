const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize the Express app
const app = express();

// Set up the storage engine using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Unique file name
  },
});

// Initialize the multer upload middleware
const upload = multer({ storage: storage });

// Ensure the uploads directory exists
const dir = './uploads';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

// Add a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome! You can upload a file by sending a POST request to /upload.');
});

// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully! Path: ' + req.file.path);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
