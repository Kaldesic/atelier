const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve the current directory as static files
app.use(express.static(__dirname));

// Fallback to index.html for unknown routes if needed (useful for SPAs, though this is a multi-page app)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
