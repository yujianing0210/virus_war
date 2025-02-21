const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');

const port = new SerialPort({ path: '/dev/cu.usbmodem101', baudRate: 9600 });
const wss = new WebSocket.Server({ port: 8080 });

wss.on('listening', () => console.log("✅ WebSocket Server running at ws://localhost:8080"));

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
parser.on('data', (data) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) client.send(data);
    });
});
