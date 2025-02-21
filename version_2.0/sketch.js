// 主控制逻辑


// let display;
let socket;
let displaySize = 30;  // Number of pixels across the screen
let pixelSize = 20;    // Size of each pixel

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

    playerOne = new Player(color(255, 0, 0), 0);
    playerTwo = new Player(color(0, 0, 255), width - 1);
    alcohol = new Alcohol();
    bacteriaOne = null;
    bacteriaTwo = null;
}

function setupWebSocket() {
    socket = new WebSocket('ws://localhost:8080');

    socket.onmessage = function(event) {
        let command = event.data.trim();
        console.log("📡 Received from Arduino:", command);

        if (command === "left1" && bacteriaOne) {
            bacteriaOne.changeDirection(-1); // 细菌向左
        } else if (command === "right1" && bacteriaOne) {
            bacteriaOne.changeDirection(1); // 细菌向右
        } else if (command === "shoot1") {
            bacteriaOne = new Bacteria(playerOne.position, 1, color(255, 100, 100)); // 发射细菌
        }
    };
}


function draw() {
    background(255);
    alcohol.update();
    display.show(); 
    if (bacteriaOne) bacteriaOne.update();
    if (bacteriaTwo) bacteriaTwo.update();

    // 更新 UI 状态
    document.getElementById("game-status").innerText = `Level: ${level}`;
}

// 处理游戏结束逻辑
function endGame(winner) {
    document.getElementById("winner-status").innerText = `Winner: ${winner}`;
}