// sketch.js

let useKeyboard = true;
let hardwarePlayerOne = false;
let hardwarePlayerTwo = false;

let playerOne, playerTwo;
let alcohol;
let bacteriaOne, bacteriaTwo;

let xOffset = 560;
let yOffset = 90;

let baseSpeed=10;

// Instead of displaySize, we define ringSize via display.ringSize
// We'll keep the same variable for convenience:
let displaySize = 0;  

function preload() {
  bgImage = loadImage('assets/scene4.gif'); 
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style("pointer-events","none");
  clear();

  // 1) init the display with midpoint circle
  display = new Display();
  // Let's pick N=80 => an 80x80 circle
  display.initMidCircleRing(38);  

  // Now "displaySize" is display.ringSize
  displaySize = display.ringSize;

  setupGame();

  // WebSocket
  socket = new WebSocket('ws://localhost:8080');
  socket.onmessage = (e)=> handleHardwareInput(e.data);
}

function setupGame() {
  // We'll place playerOne at ring index 0, playerTwo at ringSize/2
  playerOne = new Player(0, color(129,78,237));
  let half = floor(displaySize/2);
  playerTwo = new Player(half, color(78,148,110));

  // init Alcohol 
  alcohol = new Alcohol();

  // init Bacteria 
  bacteriaOne = new Bacteria(playerOne.position, 1, color(197,171,255), baseSpeed, 'playerOne');
  bacteriaTwo = new Bacteria(playerTwo.position, -1,color(0,250,154), baseSpeed,'playerTwo');
}

function draw() {
  clear();
  display.show();

  // Now we must draw the players & alcohol & bacteria in the pixel ring coordinates
  drawAlcohol();
  drawPlayer(playerOne);
  drawPlayer(playerTwo);
  if(bacteriaOne && bacteriaOne.isAlive) bacteriaOne.update();
  if(bacteriaTwo && bacteriaTwo.isAlive) bacteriaTwo.update();
  if(bacteriaOne && bacteriaOne.isAlive) drawBacteria(bacteriaOne);
  if(bacteriaTwo && bacteriaTwo.isAlive) drawBacteria(bacteriaTwo);
}

function drawAlcohol() {
  // We store positions in ring indexes
  // So let's do the same strategy as "random(0, ringSize)"
  // If you want multi-spot alcohol, do that in the constructor
  // Then to draw it:

  if(!alcohol.isVisible)return;
  fill(255,245,0);
  noStroke();
  for(let idx of alcohol.positions) {
    let cell = display.ringMap.get(idx);
    rect(cell.x*display.tileSize + xOffset, cell.y*display.tileSize + yOffset, display.tileSize, display.tileSize);
  }
}

function drawPlayer(p) {
  fill(p.color);
  noStroke();
  let cell = display.ringMap.get(p.position);
  rect(cell.x*display.tileSize + xOffset, cell.y*display.tileSize + yOffset, display.tileSize, display.tileSize);
}

function drawBacteria(b) {
  fill(b.color);
  noStroke();
  let cell = display.ringMap.get(b.position);
  rect(cell.x*display.tileSize + xOffset, cell.y*display.tileSize + yOffset, display.tileSize, display.tileSize);
}

// handle hardware 
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

function executeCommand(command) {
    if (command === 'left1') bacteriaOne.changeDirection(-1);
    else if (command === 'right1') bacteriaOne.changeDirection(1);
    else if (command === 'shoot1') spawnBacteriaOne();

    if (command === 'left2') bacteriaTwo.changeDirection(-1);
    else if (command === 'right2') bacteriaTwo.changeDirection(1);
    else if (command === 'shoot2') spawnBacteriaTwo();
}

function keyPressed() {
  // same logic as your existing code
  if(!hardwarePlayerOne){
    if(key==='A') bacteriaOne.changeDirection(-1);
    else if(key==='D') bacteriaOne.changeDirection(1);
    else if(key==='S') spawnBacteriaOne();
  }
  if(!hardwarePlayerTwo){
    if(key==='J') bacteriaTwo.changeDirection(-1);
    else if(key==='L') bacteriaTwo.changeDirection(1);
    else if(key==='K') spawnBacteriaTwo();
  }
}

// create new Bacteria
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


