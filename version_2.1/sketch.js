let display, alcohol;
let bacteriaOne = null;
let bacteriaTwo = null;
let socket;

function setup() {
    createCanvas(600, 20);
    display = new Display(60, 20);
    alcohol = new Alcohol(60);
    setupWebSocket();
}

function setupWebSocket() {
    socket = new WebSocket('ws://localhost:8080');

    socket.onmessage = function(event) {
        let command = event.data.trim();
        if (command === "left1" && bacteriaOne) bacteriaOne.changeDirection(-1);
        if (command === "right1" && bacteriaOne) bacteriaOne.changeDirection(1);
        if (command === "shoot1") bacteriaOne = new Bacteria(0, 1, [255, 0, 0]);
    };
}

function keyPressed() {
    if (key === 'A' || key === 'a' && bacteriaTwo) bacteriaTwo.changeDirection(-1);
    if (key === 'D' || key === 'd' && bacteriaTwo) bacteriaTwo.changeDirection(1);
    if (key === 'S' || key === 's') bacteriaTwo = new Bacteria(59, -1, [0, 0, 255]);
}

function draw() {
    background(255);
    display.show();
    alcohol.update();
    if (bacteriaOne) bacteriaOne.update();
    if (bacteriaTwo) bacteriaTwo.update();
}

function endGame(winner) {
    document.getElementById("winner-status").innerText = `🏆 Winner: ${winner}`;
}
