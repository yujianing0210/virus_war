/* /////////////////////////////////////

  4.043 / 4.044 Design Studio: Interaction Intelligence
  February 9, 2024
  Marcelo Coelho

*/ /////////////////////////////////////

//The infection grid stores ownership and infection level for each pixel.

let socket;
let displaySize = 30;  // Number of pixels across the screen
let pixelSize = 20;    // Size of each pixel
let infectionGrid = [];

function setup() {
    setupCanvas();
    setupWebSocket();
}

// 🎨 初始化游戏画布
function setupCanvas() {
    createCanvas(displaySize * pixelSize, pixelSize);
    console.log("✅ Canvas setup completed");

    display = new Display(displaySize, pixelSize);
    playerOne = new Player(color(50,205,50), parseInt(random(0, displaySize / 2)), displaySize);
    playerTwo = new Player(color(153,15,125), parseInt(random(displaySize / 2, displaySize)), displaySize);
    controller = new Controller();

    // Initialize infection grid
    for (let i = 0; i < displaySize; i++) {
        infectionGrid.push({ owner: null, level: 0 });
    }
}

// 🌐 设置 WebSocket 连接
function setupWebSocket() {
    socket = new WebSocket('ws://localhost:8080');

    socket.onopen = function() {
        console.log("✅ WebSocket connected successfully");
    };

    socket.onmessage = function(event) {
        let command = event.data.trim();
        console.log("📡 Received from Arduino:", command);

        if (command === "left1") {
            playerOne.move(-1);
        } else if (command === "right1") {
            playerOne.move(1);
        } else if (command === "left2") {
            playerTwo.move(-1);
        } else if (command === "right2") {
            playerTwo.move(1);
        } else if (command === "reset1" || command === "reset2") {
            restartGame();
        }
    };

    socket.onerror = function(error) {
        console.error("❌ WebSocket error:", error);
    };

    socket.onclose = function() {
        console.warn("⚠️ WebSocket connection closed. Attempting to reconnect...");
        setTimeout(setupWebSocket, 3000);
    };
}

function draw() {
    background(255);
    controller.update();
    display.show();
}
