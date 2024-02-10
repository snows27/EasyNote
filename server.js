// server.js
const express = require('express');
const app = express();

// Define your routes
app.post('/api/note-registration', (req, res) => {
    console.log('Received POST request:', req.body);
    // Process the request and send response
    res.json({ message: 'Note registered successfully' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
