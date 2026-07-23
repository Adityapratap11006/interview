const fs = require('fs');
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  const parsedUrl = url.parse(req.url, true);
  
  if (parsedUrl.pathname === '/api/problems' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      count: 0,
      problems: []
    }));
  } else if (parsedUrl.pathname === '/api/problems' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Received POST body:', data);
        
        if (!data.title || !data.leetcodeLink || !data.difficulty || !data.topic) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: "Title, LeetCode link, difficulty, and topic are required"
          }));
          return;
        }
        
        console.log('Problem data would be saved:', {
          _id: new Date().getTime().toString(),
          ...data,
          user: 'currentUserId'
        });
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: "Problem created successfully",
          problem: {
            _id: new Date().getTime().toString(),
            ...data,
            user: 'currentUserId'
          }
        }));
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: "Invalid request body"
        }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      message: "Not Found"
    }));
  }
});

server.listen(3000, () => {
  console.log('Test server running on port 3000');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('Port 3000 is already in use');
  } else {
    console.error('Server error:', err);
  }
});