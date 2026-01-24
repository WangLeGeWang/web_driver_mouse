const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for device info (future use)
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Razer WebHID Driver Server',
        version: '1.0.0'
    });
});

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Check if SSL certificates exist
const certPath = path.join(__dirname, 'certs', 'cert.pem');
const keyPath = path.join(__dirname, 'certs', 'key.pem');

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    // Start HTTPS server
    const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
    };

    https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
        console.log('');
        console.log('='.repeat(50));
        console.log('  Razer WebHID Driver Server');
        console.log('='.repeat(50));
        console.log(`  HTTPS server running at:`);
        console.log(`  https://localhost:${HTTPS_PORT}`);
        console.log('');
        console.log('  WebHID requires HTTPS or localhost');
        console.log('='.repeat(50));
        console.log('');
    });
} else {
    console.log('');
    console.log('='.repeat(50));
    console.log('  SSL certificates not found!');
    console.log('  Run: npm run gen-cert');
    console.log('  Or use HTTP (localhost only for WebHID)');
    console.log('='.repeat(50));
    console.log('');
}

// Always start HTTP server (works for localhost)
http.createServer(app).listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('  Razer WebHID Driver Server');
    console.log('='.repeat(50));
    console.log(`  HTTP server running at:`);
    console.log(`  http://localhost:${PORT}`);
    console.log('');
    console.log('  Open in Chrome/Edge to use WebHID');
    console.log('='.repeat(50));
    console.log('');
});
