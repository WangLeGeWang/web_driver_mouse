# Razer Mouse WebHID Driver

A web-based driver for Razer mice using the WebHID API. Control your Razer mouse settings directly from your browser without installing Razer Synapse.

## Supported Device

- **Razer Viper V3 Pro** (Wired/Wireless)
  - Vendor ID: `0x1532`
  - Product ID: `0x00C1`

> Other Razer mice may work but have not been tested. The protocol commands are based on OpenRazer project analysis.

## Features

| Feature | Description | Command |
|---------|-------------|---------|
| Polling Rate | 125Hz / 250Hz / 500Hz / 1000Hz / 2000Hz / 4000Hz / 8000Hz | `0x00 0x40` |
| DPI Settings | 100 - 30000 DPI | `0x04 0x06` |
| Separate X/Y DPI | Independent X and Y axis DPI | `0x04 0x06` |
| Battery Level | Query battery percentage (0-100%) | `0x07 0x80` |
| Charging Status | Check if mouse is charging | `0x07 0x84` |
| Mouse Rotation | Angle adjustment (-44° to +44°) | `0x0B 0x14` |

## Requirements

- **Browser**: Chrome 89+ or Edge 89+ (WebHID API support required)
- **Node.js**: 18+ (for running the server)
- **Operating System**: Windows / macOS / Linux

## Quick Start

### Using npm

```bash
# Clone or download the project
cd web_razer

# Install dependencies
npm install

# Start the server
npm start
```

Open `http://localhost:3000` in Chrome or Edge.

### Using Docker

```bash
# Build and run with docker-compose
docker-compose up -d

# Or build manually
docker build -t razer-webhid .
docker run -p 3000:3000 razer-webhid
```

Open `http://localhost:3000` in Chrome or Edge.

## Usage

1. **Open the web interface** at `http://localhost:3000`
2. **Click "Scan Razer Devices"** to detect your mouse
3. **Select the correct device interface** (usually "Device 2" or the one with "Control" badge)
4. **Adjust settings** and click Apply buttons

### Important Notes

- **Close Razer Synapse** before using this driver to avoid conflicts
- **WebHID works on localhost** without HTTPS
- **Select the correct HID interface** - Razer mice expose multiple interfaces, only one accepts control commands

## Project Structure

```
web_razer/
├── package.json          # Node.js configuration
├── server.js             # Express server
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
├── CLAUDE.md             # Protocol documentation
├── README.md             # This file
├── public/
│   ├── index.html        # Main driver interface
│   └── scanner.html      # HID scanner/debugger tool
├── scripts/
│   └── gen-cert.js       # SSL certificate generator
└── certs/                # SSL certificates (optional)
```

## Protocol Documentation

See [CLAUDE.md](./CLAUDE.md) for detailed protocol documentation including:

- Command structure (90-byte Razer report format)
- CRC calculation
- All supported commands with examples
- Transaction ID mapping for different devices

## Troubleshooting

### "Failed to write the feature report"

- Make sure you selected the correct device interface (try Device 2)
- Close Razer Synapse completely
- Try unplugging and reconnecting the mouse

### Device not appearing

- Ensure you're using Chrome or Edge
- Check that WebHID is supported: `navigator.hid` should not be undefined
- Try running the browser as administrator (Windows)

### Battery query not working

- Battery commands require Transaction ID `0x1f` for Viper V3 Pro
- Some wired-only mice don't support battery queries

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main driver interface |
| `/scanner.html` | GET | HID scanner/debugger |
| `/api/status` | GET | Server status check |

## Development

```bash
# Install dependencies
npm install

# Generate SSL certificates (optional, for HTTPS)
npm run gen-cert

# Start development server
npm run dev
```

## License

MIT License

## Credits

- Protocol analysis based on [OpenRazer](https://github.com/openrazer/openrazer) project
- WebHID API documentation from [W3C WebHID Specification](https://wicg.github.io/webhid/)

## Disclaimer

This is an unofficial, community-developed driver. Use at your own risk. Not affiliated with Razer Inc.
