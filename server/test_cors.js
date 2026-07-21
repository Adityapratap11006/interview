const http = require('http');

const options = {
  method: 'OPTIONS',
  host: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  headers: {
    Origin: 'http://localhost:5173',
    'Access-Control-Request-Method': 'POST'
  }
};

const req = http.request(options, (res) => {
  console.log('statusCode', res.statusCode);
  console.log('headers', res.headers);
  res.on('data', () => {});
});

req.on('error', (e) => {
  console.error('request error', e.message);
});

req.end();
