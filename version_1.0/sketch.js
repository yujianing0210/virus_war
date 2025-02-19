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

// Setup the game canvas and objects
function setupCanvas() {
  createCanvas(displaySize * pixelSize, pixelSize);
  console.log("Canvas setup completed");

  display = new Display(displaySize, pixelSize);
  playerOne = new Player(color(255, 0, 0), parseInt(random(0, displaySize / 2)), displaySize);
  playerTwo = new Player(color(0, 0, 255), parseInt(random(displaySize / 2, displaySize)), displaySize);
  controller = new Controller();

  // Initialize infection grid
  for (let i = 0; i < displaySize; i++) {
      infectionGrid.push({ owner: null, level: 0 });
  }
}

// Setup WebSocket connection to receive data from Arduino
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
      }
  };

  socket.onerror = function(error) {
      console.error("❌ WebSocket error:", error);
  };

  socket.onclose = function() {
      console.warn("⚠️ WebSocket connection closed. Attempting to reconnect...");
      setTimeout(setupWebSocket, 3000); // Retry in 3 seconds
  };
}

function draw() {
    background(255); // White background
    controller.update();
    display.show();
}
