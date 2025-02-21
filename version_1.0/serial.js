const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');

// 替换为你的 Arduino 端口号（可以在 Arduino IDE 中查看）
const port = new SerialPort({ path: '/dev/cu.usbmodem1101', baudRate: 9600 });

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ port: 8080 });

// 监听 WebSocket 服务器是否启动成功
wss.on('listening', () => {
    console.log("✅ WebSocket Server running at ws://localhost:8080");
});

// 读取 Serial 数据
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
parser.on('data', (data) => {
    console.log("📡 Received from Arduino:", data);

    // 发送数据到 WebSocket
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
});
