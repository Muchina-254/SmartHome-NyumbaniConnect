const http = require('http');

console.log('Testing basic server connectivity...');

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET'
}, (res) => {
  console.log('✅ Server responding with status:', res.statusCode);
  res.on('data', (chunk) => {
    console.log('Response:', chunk.toString());
  });
});

req.on('error', (error) => {
  console.error('❌ Connection error:', error.message);
});

req.end();
