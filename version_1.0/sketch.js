/* /////////////////////////////////////

  4.043 / 4.044 Design Studio: Interaction Intelligence
  February 9, 2024
  Marcelo Coelho

*/ /////////////////////////////////////

//The infection grid stores ownership and infection level for each pixel.

let displaySize = 30;
let pixelSize = 20;
let playerOne, playerTwo;
let display, controller, score;
let infectionGrid = [];

function setup() {
    createCanvas(displaySize * pixelSize, pixelSize);
    display = new Display(displaySize, pixelSize);

    playerOne = new Player(color(255, 0, 0), parseInt(random(0, displaySize / 2)), displaySize);
    playerTwo = new Player(color(0, 0, 255), parseInt(random(displaySize / 2, displaySize)), displaySize);

    controller = new Controller();

    // Initialize infection grid (all uninfected)
    for (let i = 0; i < displaySize; i++) {
        infectionGrid.push({ owner: null, level: 0 });
    }

    score = { winner: color(0, 0, 0) };
}

function draw() {
    background(255); // White background
    controller.update();
    display.show();
}

function restartGame() {
  // Reset game state
  controller.gameState = "PLAY";
  controller.startTime = millis();

  // Reset player positions randomly
  playerOne.position = parseInt(random(0, displaySize / 2));
  playerTwo.position = parseInt(random(displaySize / 2, displaySize));

  // Reset infection grid
  for (let i = 0; i < displaySize; i++) {
      infectionGrid[i] = { owner: null, level: 0 };
  }

  // Reset score
  score.winner = color(0, 0, 0);
}

