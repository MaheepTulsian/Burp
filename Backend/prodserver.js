// Production HTTPS server for BURP backend
// This file boots your existing express `app` (from server.js) over HTTPS using provided certs.

require('dotenv').config();
const fs = require('fs');
const https = require('https');
const path = require('path');

// Reuse the configured express app from server.js
const app = require('./server');

const PORT = process.env.PORT || 5001;
const HOST = process.env.PROD_HOST || 'YOUR_SERVER_IP';

// Allow overriding ssl paths via env, otherwise use default locations
const KEY_PATH = process.env.SSL_KEY_PATH || '/opt/Burp/ssl/backend.key';
const CERT_PATH = process.env.SSL_CERT_PATH || '/opt/Burp/ssl/backend.crt';

const readFileSafe = (p) => {
  try {
    return fs.readFileSync(p);
  } catch (err) {
    console.error(`❌ Unable to read file at ${p}:`, err.message);
    throw err;
  }
};

try {
  const httpsOptions = {
    key: readFileSafe(KEY_PATH),
    cert: readFileSafe(CERT_PATH),
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`🚀 BURP HTTPS server running at https://${HOST}:${PORT}`);
  });
} catch (err) {
  console.error('❌ Failed to start HTTPS server:', err.message);
  console.error('Make sure SSL files exist and Node has permission to read them.');
  process.exit(1);
}
