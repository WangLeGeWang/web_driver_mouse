const fs = require('fs');
const path = require('path');

// Try to use selfsigned, fallback to instructions if not available
try {
    const selfsigned = require('selfsigned');

    const attrs = [{ name: 'commonName', value: 'localhost' }];
    const pems = selfsigned.generate(attrs, {
        algorithm: 'sha256',
        days: 365,
        keySize: 2048,
        extensions: [
            {
                name: 'subjectAltName',
                altNames: [
                    { type: 2, value: 'localhost' },
                    { type: 7, ip: '127.0.0.1' }
                ]
            }
        ]
    });

    const certDir = path.join(__dirname, '..', 'certs');

    if (!fs.existsSync(certDir)) {
        fs.mkdirSync(certDir, { recursive: true });
    }

    fs.writeFileSync(path.join(certDir, 'cert.pem'), pems.cert);
    fs.writeFileSync(path.join(certDir, 'key.pem'), pems.private);

    console.log('SSL certificates generated successfully!');
    console.log(`Location: ${certDir}`);

} catch (error) {
    console.log('selfsigned package not found.');
    console.log('Run: npm install');
    console.log('Then: npm run gen-cert');
}
