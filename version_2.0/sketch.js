// Game Logic:
// Handles players, bacteria movement, and WebSocket communication.

let socket;
let useKeyboard = false; // Fallback flag

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

    // Manually add key event listener
    document.addEventListener("keydown", (event) => {
        keyPressed(event);
    });
}

function setupWebSocket() {
    socket = new WebSocket('ws://localhost:8080');

    socket.onopen = function() {
        console.log("✅ WebSocket connected successfully");
        useKeyboard = false; // Disable keyboard fallback
    };

    socket.onmessage = function(event) {
        useKeyboard = false; // Ensure keyboard is disabled when WebSocket is active

        let command = event.data.trim();
        console.log("📡 Received from Arduino:", command);

        // Player One controls
        if (command === "shoot1") {
            let bacteriaColor = color(255, 150, 150); // Light Red for Player One's bacteria
            bacteriaOne = new Bacteria(playerOne.position, 1, bacteriaColor);
        } else if (command === "left1") {
            if (bacteriaOne) bacteriaOne.changeDirection(-1);
        } else if (command === "right1") {
            if (bacteriaOne) bacteriaOne.changeDirection(1);
        }

        // Player Two controls
        if (command === "shoot2") {
            let bacteriaColor = color(150, 150, 255); // Light Blue for Player Two's bacteria
            bacteriaTwo = new Bacteria(playerTwo.position, -1, bacteriaColor);
        } else if (command === "left2") {
            if (bacteriaTwo) bacteriaTwo.changeDirection(-1);
        } else if (command === "right2") {
            if (bacteriaTwo) bacteriaTwo.changeDirection(1);
        }
    };

    socket.onerror = function(error) {
        console.error("❌ WebSocket error:", error);
        useKeyboard = true; // Enable keyboard fallback
    };

    socket.onclose = function() {
        console.warn("⚠️ WebSocket disconnected. Enabling keyboard controls...");
        useKeyboard = true; // Enable keyboard fallback
        setTimeout(setupWebSocket, 3000); // Try reconnecting every 3 seconds
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
}

// 处理游戏结束逻辑
function endGame(winner) {
    document.getElementById("winner-status").innerText = `Winner: ${winner}`;
}

function keyPressed() {
    if (!useKeyboard) {
        console.log("❌ Keyboard disabled (WebSocket is connected).");
        return; // Only allow keyboard if WebSocket is disconnected
    }

    console.log(`🎮 Key Pressed: ${key}`);

    if (key === 'A' || key === 'a') {
        console.log("⬅️ Player One moving left");
        if (bacteriaOne) bacteriaOne.changeDirection(-1);
    } else if (key === 'D' || key === 'd') {
        console.log("➡️ Player One moving right");
        if (bacteriaOne) bacteriaOne.changeDirection(1);
    } else if (key === 'S' || key === 's') {
        console.log("🎯 Player One shooting bacteria!");
        let bacteriaColor = color(255, 150, 150);
        bacteriaOne = new Bacteria(playerOne.position, 1, bacteriaColor);
    }

    if (key === 'J' || key === 'j') {
        console.log("⬅️ Player Two moving left");
        if (bacteriaTwo) bacteriaTwo.changeDirection(-1);
    } else if (key === 'L' || key === 'l') {
        console.log("➡️ Player Two moving right");
        if (bacteriaTwo) bacteriaTwo.changeDirection(1);
    } else if (key === 'K' || key === 'k') {
        console.log("🎯 Player Two shooting bacteria!");
        let bacteriaColor = color(150, 150, 255);
        bacteriaTwo = new Bacteria(playerTwo.position, -1, bacteriaColor);
    }
}
