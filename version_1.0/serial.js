const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');

// Replace with your Arduino's serial port (Check in Arduino IDE: Tools > Port)
const port = new SerialPort({ path: '/dev/cu.usbmodem1101', baudRate: 9600 });

// Create WebSocket server to communicate with the game
const wss = new WebSocket.Server({ port: 8080 });

// Log when the WebSocket server starts
wss.on('listening', () => {
    console.log("✅ WebSocket Server running at ws://localhost:8080");
});

// Read Serial data
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
parser.on('data', (data) => {
    console.log("📡 Received from Arduino:", data);

    // Send "left1", "right1", "left2", "right2" to the game via WebSocket
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
});
