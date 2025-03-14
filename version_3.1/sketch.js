// sketch.js

let useKeyboard = true;
let hardwarePlayerOne = false;
let hardwarePlayerTwo = false;

let playerOne, playerTwo;
let alcohol;
let bacteriaOne, bacteriaTwo;

let xOffset = 547; //560
let yOffset = 155; //90

let baseSpeed=10;

let N = 35;

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
  display.initMidCircleRing(N);  

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
    alcohol.update();  // This toggles isVisible, positions, etc.
    if(!alcohol.isVisible) return;
    fill(252,252,3);
    noStroke();
    for(let idx of alcohol.positions) {
      let c = display.ringMap.get(idx);
      rect(c.x*display.tileSize + xOffset, c.y*display.tileSize + yOffset, display.tileSize, display.tileSize);
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

function keyPressed(){
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

function spawnBacteriaOne() {
    // Only spawn if no existing living bacterium
    if (!bacteriaOne || !bacteriaOne.isAlive) {
      bacteriaOne = new Bacteria(
        playerOne.position, 
        1, 
        color(197, 171, 255), 
        15, 
        'playerOne'
      );
    }
  }
  
  function spawnBacteriaTwo() {
    if (!bacteriaTwo || !bacteriaTwo.isAlive) {
      bacteriaTwo = new Bacteria(
        playerTwo.position, 
        -1, 
        color(0, 250, 154), 
        15, 
        'playerTwo'
      );
    }
  }
  

  function endGame() {
    let winnerColor;
  
    if (playerOne.health <= 0) {
      winnerColor = playerTwo.baseColor;
    } else if (playerTwo.health <= 0) {
      winnerColor = playerOne.baseColor;
    } else {
      return; 
    }
  
    console.log("🏆 Game Over! Fill ring with color.");
  
    display.setAllPixels(winnerColor);
  
    // set last bacteria references to null
    bacteriaOne = null;
    bacteriaTwo = null;
  
    redraw();
    display.show();
  
    setTimeout(() => {
      noLoop();
    }, 100);
  }
  