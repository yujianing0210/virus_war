// Game Logic

let useKeyboard = true; // Use keyboard to control
let hardwarePlayerOne = false;
let hardwarePlayerTwo = false;

let displaySize = 79;  // Number of pixels across the screen
let pixelSize = 10;    // Size of each pixel
let playerOne, playerTwo;
let alcohol;
let bacteriaOne, bacteriaTwo;
let baseSpeed =30

let socket;

function preload() {
    // 📥 Load the background image before setup
    bgImage = loadImage('assets/Test3.gif'); 
}

function setup() {
    setupCanvas();
    setupGame();
    socket = new WebSocket('ws://localhost:8080');
    socket.onmessage = (event) => {
        handleHardwareInput(event.data);
    };
}

function setupCanvas() {
    // 设定画布的大小尺寸和比例
    canvasWidth = displaySize * pixelSize * 1.5; // 1200 pixels
    canvasHeight = canvasWidth * 0.6; // 720 pixels
    createCanvas(canvasWidth, canvasHeight);
    display = new Display(displaySize, pixelSize);
}

function setupGame() {
    
    // Player One: Leftmost side (0 degrees) with slight random offset
    // let offsetOne = Math.floor(random(-4, 5)); // -2 to +2
    let midPosition = Math.floor(displaySize / 2); 
    let playerOnePos = (midPosition + displaySize) % displaySize;
    playerOne = new Player(playerOnePos, color(129, 78, 237)); // Purple
    console.log(`🔴 Player One starts at position ${playerOnePos}`);

    // Player Two: Rightmost side (180 degrees) with slight random offset
    // let offsetTwo = Math.floor(random(-4, 5)); // -2 to +2
    let playerTwoPos = (displaySize) % displaySize;
    playerTwo = new Player(playerTwoPos, color(78, 148, 110)); // Green
    console.log(`🔵 Player Two starts at position ${playerTwoPos}`);

    // NPC setup
    alcohol = new Alcohol(); // Initialize Alcohol NPC

    // Bacteria setup: 游戏开始双方自动发射出一个细菌。细菌颜色和移动速度可调。
    bacteriaOne = new Bacteria(playerOne.position, 1, color(197, 171, 255), baseSpeed, 'playerOne');
    bacteriaTwo = new Bacteria(playerTwo.position, -1, color(0, 250, 154), baseSpeed, 'playerTwo');

}

function handleHardwareInput(command) {
    if (command === 'noHardware1') {
        hardwarePlayerOne = false;
        console.log('Player One uses keyboard');
    } else if (command === 'noHardware2') {
        hardwarePlayerTwo = false;
        console.log('Player Two uses keyboard');
    } else {
        if (command.startsWith('left') || command.startsWith('right') || command.startsWith('shoot')) {
            hardwarePlayerOne = command.includes('1');
            hardwarePlayerTwo = command.includes('2');
            executeCommand(command);
        }
    }
}

function draw() {

    background(bgImage);
    display.show();

    let xOffset = width / 2;
    let yOffset = height / 2;
    let outerRadius = min(width, height) / 2.1; // Outer boundary
    let innerRadius = outerRadius / 1.09; // Inner boundary to create the ring
    let angleStep = TWO_PI / displaySize; // Divide ring into equal segments

    // 🚨 Ensure Players Are Rendered as Grid Cells Instead of Ellipses
    for (let i = 0; i < displaySize; i++) {
        let startAngle = i * angleStep;
        let endAngle = (i + 1) * angleStep;

        if (i === playerOne.position) {
            fill(playerOne.color);
        } else if (i === playerTwo.position) {
            fill(playerTwo.color);
        } else {
            continue; // Skip other cells, as they are drawn in `display.show()`
        }

        strokeWeight(2);
        stroke(255);
        beginShape();
        vertex(innerRadius * cos(startAngle) + xOffset, innerRadius * sin(startAngle) + yOffset);
        vertex(outerRadius * cos(startAngle) + xOffset, outerRadius * sin(startAngle) + yOffset);
        vertex(outerRadius * cos(endAngle) + xOffset, outerRadius * sin(endAngle) + yOffset);
        vertex(innerRadius * cos(endAngle) + xOffset, innerRadius * sin(endAngle) + yOffset);
        endShape(CLOSE);
    }

    // 🚨 Ensure Alcohol NPC is Displayed at the Correct Position
    alcohol.update(xOffset, yOffset, outerRadius);

    // 画细菌本体（单独画，不放到displayBuffer里）
    if (bacteriaOne && bacteriaOne.isAlive) {
        bacteriaOne.update();
        drawBacteria(bacteriaOne.position, color(197, 171, 255));  // 实色紫色
    }
    if (bacteriaTwo && bacteriaTwo.isAlive) {
        bacteriaTwo.update();
        drawBacteria(bacteriaTwo.position, color(0, 250, 154));  // 实色绿色
    }


    // Render bacteria if they exist
    if (bacteriaOne && bacteriaOne.isAlive) {
        bacteriaOne.update();
    }
    if (bacteriaTwo && bacteriaTwo.isAlive) {
        bacteriaTwo.update();
    }
    
}

function drawBacteria(position, col) {
    // let angleStep = TWO_PI / displaySize;
    let offsetAngle = 0; // 让0号格子从正上方开始

    let startAngle = map(position, 0, displaySize, offsetAngle, offsetAngle + TWO_PI);
    let endAngle = map(position + 1, 0, displaySize, offsetAngle, offsetAngle + TWO_PI);

    let xOffset = width / 2;
    let yOffset = height / 2;
    let outerRadius = min(width, height) / 2.1;
    let innerRadius = outerRadius / 1.09;

    fill(col);  // 细菌本体颜色，和轨迹区分
    stroke(0);  // 可以加边线增强对比
    beginShape();
    vertex(innerRadius * cos(startAngle) + xOffset, innerRadius * sin(startAngle) + yOffset);
    vertex(outerRadius * cos(startAngle) + xOffset, outerRadius * sin(startAngle) + yOffset);
    vertex(outerRadius * cos(endAngle) + xOffset, outerRadius * sin(endAngle) + yOffset);
    vertex(innerRadius * cos(endAngle) + xOffset, innerRadius * sin(endAngle) + yOffset);
    endShape(CLOSE);
}



function keyPressed() {
    if (!hardwarePlayerOne) {
        if (key === 'A') bacteriaOne.changeDirection(-1);
        else if (key === 'D') bacteriaOne.changeDirection(1);
        else if (key === 'S') spawnBacteriaOne();
    }
    if (!hardwarePlayerTwo) {
        if (key === 'J') bacteriaTwo.changeDirection(-1);
        else if (key === 'L') bacteriaTwo.changeDirection(1);
        else if (key === 'K') spawnBacteriaTwo();
    }
}

function executeCommand(command) {
    if (command === 'left1') bacteriaOne.changeDirection(-1);
    else if (command === 'right1') bacteriaOne.changeDirection(1);
    else if (command === 'shoot1') spawnBacteriaOne();

    if (command === 'left2') bacteriaTwo.changeDirection(-1);
    else if (command === 'right2') bacteriaTwo.changeDirection(1);
    else if (command === 'shoot2') spawnBacteriaTwo();
}

function spawnBacteriaOne() {
    if (!bacteriaOne || !bacteriaOne.isAlive) {
        bacteriaOne = new Bacteria(playerOne.position, 1, color(197, 171, 255), 15, 'playerOne');
    }
}

function spawnBacteriaTwo() {
    if (!bacteriaTwo || !bacteriaTwo.isAlive) {
        bacteriaTwo = new Bacteria(playerTwo.position, -1, color(0, 250, 154), 15, 'playerTwo');
    }
}

// 处理游戏结束逻辑
function endGame() {
    let winnerColor;
    
    if (playerOne.health <= 0) {
        winnerColor = playerTwo.baseColor; // Player Two wins, fill with blue
        // winnerColor = color(129, 78, 237);
    } else if (playerTwo.health <= 0) {
        winnerColor = playerOne.baseColor; // Player One wins, fill with red
        // winnerColor = color(78, 148, 110);
    } else {
        return; // If no one has lost, do nothing
    }

    console.log(`🏆 Game Over! Winner's color fills the grid.`);

    // 🚨 Fill the entire pixel line with the winner's original color
    display.setAllPixels(winnerColor);

    // 🚨 Explicitly clear the last bacteria and losing player position
    display.setPixel(playerOne.position, winnerColor);
    display.setPixel(playerTwo.position, winnerColor);

    // 🚨 Explicitly remove any bacteria from memory
    bacteriaOne = null;
    bacteriaTwo = null;

    // 🚨 Ensure the display updates by calling display.show() before stopping the loop
    redraw();
    display.show();

    // 🚨 Delay stopping the loop slightly to allow final rendering
    setTimeout(() => {
        noLoop(); // Stop the game loop AFTER colors have updated
    }, 100); // Small delay (100ms) to allow rendering
}


