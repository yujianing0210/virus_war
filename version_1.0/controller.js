// Implement a one-minute timer.
// Track fully infected cells for each player.

class Controller {
    constructor() {
        this.gameState = "PLAY";
        this.startTime = millis();
    }

    update() {
        // Check if 1 minute has passed
        if (millis() - this.startTime >= 60000) {
            this.gameState = "SCORE";
        }

        switch (this.gameState) {
            case "PLAY":
                display.clear();

                // Show infection grid
                for (let i = 0; i < displaySize; i++) {
                    let cell = infectionGrid[i];

                    if (cell.owner !== null) {
                        let baseColor = cell.owner.playerColor;
                        let infectionLevel = cell.level / 100;

                        // Blend color with white for gradient effect
                        let blendedColor = lerpColor(color(255, 255, 255), baseColor, infectionLevel);
                        display.setPixel(i, blendedColor);
                    }
                }

                // Show Players (draw after infection grid so they remain visible)
                display.setPixel(playerOne.position, color(255, 0, 0)); // Solid Red
                display.setPixel(playerTwo.position, color(0, 0, 255)); // Solid Blue

                break;

            case "SCORE":
                // Count fully occupied cells for each player
                let p1Score = infectionGrid.filter(c => c.owner === playerOne && c.level === 100).length;
                let p2Score = infectionGrid.filter(c => c.owner === playerTwo && c.level === 100).length;

                // Determine the winner
                if (p1Score > p2Score) {
                    score.winner = playerOne.playerColor;
                } else if (p2Score > p1Score) {
                    score.winner = playerTwo.playerColor;
                } else {
                    score.winner = color(100, 100, 100); // Tie (gray)
                }

                // Display the winner color across the whole screen
                display.setAllPixels(score.winner);
                break;
        }
    }
}




// This function gets called when a key on the keyboard is pressed
function keyPressed() {
    if (key == 'A' || key == 'a') playerOne.move(-1);
    if (key == 'D' || key == 'd') playerOne.move(1);
    if (key == 'J' || key == 'j') playerTwo.move(-1);
    if (key == 'L' || key == 'l') playerTwo.move(1);
    if (key == 'R' || key == 'r') {
        restartGame();
    }
}

