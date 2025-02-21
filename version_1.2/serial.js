const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');

// 指定两个 Arduino 的端口号（在 Arduino IDE: Tools > Port 确认）
const port1 = new SerialPort({ path: '/dev/cu.usbmodem1101', baudRate: 9600 }); // Player One
const port2 = new SerialPort({ path: '/dev/cu.usbmodem101', baudRate: 9600 }); // Player Two

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ port: 8080 });

wss.on('listening', () => {
    console.log("✅ WebSocket Server running at ws://localhost:8080");
});

// 读取 Arduino 1 (Player One) 数据
const parser1 = port1.pipe(new ReadlineParser({ delimiter: '\r\n' }));
parser1.on('data', (data) => {
    console.log("📡 Player One:", data);
    sendToClients(data);
});

// 读取 Arduino 2 (Player Two) 数据
const parser2 = port2.pipe(new ReadlineParser({ delimiter: '\r\n' }));
parser2.on('data', (data) => {
    console.log("📡 Player Two:", data);
    sendToClients(data);
});

// 发送数据到 WebSocket
function sendToClients(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}
