/**
 * Simple script to open the example in a browser
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
// Using child_process instead of the 'open' package
const { exec } = require('child_process');

// Port to run the server on
const PORT = 3006;

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.url}`);
  
  // Get the file path
  let url = req.url;
  
  // Remove leading slash if present
  if (url.startsWith('/')) {
    url = url.substring(1);
  }
  
  let filePath;
  
  // Handle special routes
  if (url === '' || url === '/') {
    filePath = path.join(__dirname, 'index.html');
  } else if (url === 'docs' || url === 'docs/') {
    // Redirect to documentation index
    filePath = path.join(__dirname, '..', 'documentation', 'index.html');
  } else {
    filePath = path.join(__dirname, url);
  }
  
  // Special cases for accessing files outside the example directory
  if (url.startsWith('dist/')) {
    filePath = path.join(__dirname, '..', url);
  } else if (url.startsWith('documentation/')) {
    filePath = path.join(__dirname, '..', url);
  }
  
  console.log('Resolved path:', filePath);
  
  // Get the file extension
  const extname = path.extname(filePath);
  
  // Set the content type
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Read the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end('File not found');
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Opening browser...');
  
  // Open the browser based on the platform
  const url = `http://localhost:${PORT}/`;
  const platform = process.platform;
  
  console.log(`Attempting to open ${url} on ${platform}`);
  
  // Platform-specific commands to open a URL
  switch (platform) {
    case 'win32':
      exec(`start ${url}`);
      break;
    case 'darwin': // macOS
      exec(`open ${url}`);
      break;
    case 'linux':
      exec(`xdg-open ${url}`);
      break;
    default:
      console.log(`Please open ${url} in your browser manually.`);
  }
});

// Handle server shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

console.log('Press Ctrl+C to stop the server');
