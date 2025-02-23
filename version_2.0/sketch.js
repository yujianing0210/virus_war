// Game Logic:
// Handles players, bacteria movement, and WebSocket communication.

let socket;
let displaySize = 30;  // Number of pixels across the screen
let pixelSize = 20;    // Size of each pixel
let infectionGrid = [];
let playerOne, playerTwo;
let alcohol;
let bacteriaOne, bacteriaTwo;

function setup() {
    //createCanvas(600, 20); // 1D 画布
    //display = new Display(60, 10);
    setupGame();
    setupWebSocket();
}

function setupGame() {
    createCanvas(displaySize * pixelSize, pixelSize);
    display = new Display(displaySize, pixelSize);

    // Player One's bacteria launch point (leftmost cell)
    playerOne = { position: 0, color: color(255, 0, 0) };  // Red for Player One
    // Player Two's bacteria launch point (rightmost cell)
    playerTwo = { position: displaySize - 1, color: color(0, 0, 255) }; // Blue for Player Two

    alcohol = new Alcohol(); // Initialize Alcohol NPC
    bacteriaOne = null;
    bacteriaTwo = null;
}

function setupWebSocket() {
    socket = new WebSocket('ws://localhost:8080');

    socket.onmessage = function(event) {
        let command = event.data.trim();
        console.log("📡 Received from Arduino:", command);

        // Player One controls
        if (command === "shoot1") {
            bacteriaOne = new Bacteria(playerOne.position, 1, playerOne.color);
        } else if (command === "left1") {
            if (bacteriaOne) bacteriaOne.changeDirection(-1);
        } else if (command === "right1") {
            if (bacteriaOne) bacteriaOne.changeDirection(1);
        }

        // Player Two controls
        if (command === "shoot2") {
            bacteriaTwo = new Bacteria(playerTwo.position, -1, playerTwo.color);
        } else if (command === "left2") {
            if (bacteriaTwo) bacteriaTwo.changeDirection(-1);
        } else if (command === "right2") {
            if (bacteriaTwo) bacteriaTwo.changeDirection(1);
        }
    };

    socket.onerror = function(error) {
        console.error("❌ WebSocket error:", error);
    };

    socket.onclose = function() {
        console.warn("⚠️ WebSocket connection closed. Reconnecting...");
        setTimeout(setupWebSocket, 3000);
    };
}


function draw() {
    background(255);  // White background
    alcohol.update(); // Update Alcohol NPC
    display.show();   // Refresh screen

    // Render player cells
    display.setPixel(playerOne.position, playerOne.color);
    display.setPixel(playerTwo.position, playerTwo.color);

    // Render bacteria if they exist
    if (bacteriaOne) bacteriaOne.update();
    if (bacteriaTwo) bacteriaTwo.update();

    // 更新 UI 状态
    // document.getElementById("game-status").innerText = `Level: ${level}`;
}

// 处理游戏结束逻辑
function endGame(winner) {
    document.getElementById("winner-status").innerText = `Winner: ${winner}`;
}