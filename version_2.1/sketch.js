// Game Logic:
// Compared to version_2.0, we omit websocket and arduino, simply using keyboard to control the game (for easier debugging).

let useKeyboard = true; // Use keyboard to control
let displaySize = 30;  // Number of pixels across the screen
let pixelSize = 20;    // Size of each pixel
let playerOne, playerTwo;
let alcohol;
let bacteriaOne, bacteriaTwo;

function setup() {
    setupCanvas();
    setupGame();
}

function setupCanvas() {
    // 设定画布的大小尺寸和比例
    canvasWidth = displaySize * pixelSize * 1.5; 
    canvasHeight = canvasWidth * 0.6;
    createCanvas(canvasWidth, canvasHeight);
    display = new Display(displaySize, pixelSize);
}

function setupGame() {
    // Player setup
    // Player One's bacteria launch point (leftmost cell)
    playerOne = new Player(0, color(255, 0, 0));  // 1 - Red 
    console.log("Player1");
    // Player Two's bacteria launch point (rightmost cell)
    playerTwo = new Player(displaySize - 1, color(0, 0, 255)); // 2 - Blue

    // NPC setup
    alcohol = new Alcohol(); // Initialize Alcohol NPC

    // Bacteria setup: 游戏开始双方自动发射出一个细菌。细菌颜色和移动速度可调。
    bacteriaOne = new Bacteria(playerOne.position, 1, color(255, 150, 150), 10);  // 1 - Light Red，speed = 15
    bacteriaTwo = new Bacteria(playerTwo.position, -1, color(150, 150, 255), 10); // 2 - Light Blue, speed = 10

}

function draw() {
    background(color(235,160,175));  // canvas background color
    display.show();   // 显示pixel line

    let xOffset = (width - (displaySize * pixelSize)) / 2; 
    let yOffset = height / 2 - pixelSize / 2;

    alcohol.update(xOffset); // Update Alcohol NPC

    // 🚨 Render player cells with updated color
    fill(playerOne.color);
    rect(xOffset + (playerOne.position * pixelSize), yOffset, pixelSize, pixelSize);

    fill(playerTwo.color);
    rect(xOffset + (playerTwo.position * pixelSize), yOffset, pixelSize, pixelSize);

    // Render bacteria if they exist
    if (bacteriaOne && bacteriaOne.isAlive) bacteriaOne.update();
    if (bacteriaTwo && bacteriaTwo.isAlive) bacteriaTwo.update();
}

function keyPressed() {
    if (!useKeyboard) {
        console.log("❌ Keyboard disabled (WebSocket is connected).");
        return; // Only allow keyboard if WebSocket is disconnected
    }

    console.log(`🎮 Key Pressed: ${key}`);

    if (key === 'A' || key === 'a') {
        console.log("⬅️ Player1 moving left");
        if (bacteriaOne) bacteriaOne.changeDirection(-1);
    } else if (key === 'D' || key === 'd') {
        console.log("➡️ Player1 moving right");
        if (bacteriaOne) bacteriaOne.changeDirection(1);
    } else if (key === 'S' || key === 's') {
        console.log("🎯 Player1 shooting bacteria!");
        let bacteriaColor = color(255, 150, 150);
        if (!bacteriaOne || !bacteriaOne.isAlive) {  // 🚨 Only create new bacteria if none exist
            bacteriaOne = new Bacteria(playerOne.position, 1, bacteriaColor, 15);
        }
    }

    if (key === 'J' || key === 'j') {
        console.log("⬅️ Player2 moving left");
        if (bacteriaTwo) bacteriaTwo.changeDirection(-1);
    } else if (key === 'L' || key === 'l') {
        console.log("➡️ Player2 moving right");
        if (bacteriaTwo) bacteriaTwo.changeDirection(1);
    } else if (key === 'K' || key === 'k') {
        console.log("🎯 Player2 shooting bacteria!");
        let bacteriaColor = color(150, 150, 255);
        if (!bacteriaTwo || !bacteriaTwo.isAlive) {  // 🚨 Only create new bacteria if none exist
            bacteriaTwo = new Bacteria(playerTwo.position, -1, bacteriaColor, 10);
        }
    }
}

// 处理游戏结束逻辑
function endGame() {
    let winnerColor;
    
    if (playerOne.health <= 0) {
        winnerColor = playerTwo.baseColor; // Player Two wins, fill with blue
        // winnerColor = color(0, 0, 255);
    } else if (playerTwo.health <= 0) {
        winnerColor = playerOne.baseColor; // Player One wins, fill with red
        // winnerColor = color(255, 0, 0);
    } else {
        return; // If no one has lost, do nothing
    }

    console.log(`🏆 Game Over! Winner's color fills the grid.`);

    // 🚨 Explicitly clear the last bacteria and losing player position
    display.setPixel(playerOne.position, winnerColor);
    display.setPixel(playerTwo.position, winnerColor);

    // 🚨 Explicitly remove any bacteria from memory
    bacteriaOne = null;
    bacteriaTwo = null;

    // 🚨 Fill the entire pixel line with the winner's original color
    display.setAllPixels(winnerColor);

    // 🚨 Ensure the display updates by calling display.show() before stopping the loop
    redraw();
    display.show();

    // 🚨 Delay stopping the loop slightly to allow final rendering
    setTimeout(() => {
        noLoop(); // Stop the game loop AFTER colors have updated
    }, 100); // Small delay (100ms) to allow rendering
}


