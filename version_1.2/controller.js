// Implement a one-minute timer.
// Track fully infected cells for each player.

class Controller {
    constructor() {
        this.gameState = "PLAY";
        this.startTime = millis();
    }

    update() {
        if (this.gameState !== "PLAY") return;
    
        updateAlcohol(); // Check if Alcohol expires
    
        display.clear();
    
        // Render Infection Grid
        for (let i = 0; i < displaySize; i++) {
            let cell = infectionGrid[i];
    
            if (cell.owner !== null) {
                let baseColor = cell.owner.playerColor;
                let infectionLevel = cell.level / 100;
                let blendedColor = lerpColor(color(255, 255, 255), baseColor, infectionLevel);
                display.setPixel(i, blendedColor);
            }
        }
    
        // Render Alcohol (Yellow Pixels)
        if (alcohol) {
            for (let i = 0; i < alcohol.length; i++) {
                display.setPixel(alcohol.position + i, color(255, 255, 0)); // Yellow
            }
        }
    
        // Render Players
        display.setPixel(playerOne.position, color(0,250,154)); // Red
        display.setPixel(playerTwo.position, color(255, 0, 203)); // Blue
    
        // Check if a player collides with Alcohol
        if (alcohol) {
            for (let i = 0; i < alcohol.length; i++) {
                let alcoholPixel = alcohol.position + i;
                if (playerOne.position === alcoholPixel) {
                    console.log("🚨 Player One hit Alcohol! GAME OVER!");
                    this.endGame(playerTwo); // Player Two wins
                } else if (playerTwo.position === alcoholPixel) {
                    console.log("🚨 Player Two hit Alcohol! GAME OVER!");
                    this.endGame(playerOne); // Player One wins
                }
            }
        }
    
        // Randomly spawn Alcohol every 10-20 sec
        if (!alcohol && random(1) < 0.005) {
            spawnAlcohol();
        }

        if (millis() - this.startTime >= 30000) { // 30 seconds limit
            console.log("⏳ Time is up! Determining winner...");
            this.determineWinnerByInfection();
        }

        
    }

    determineWinnerByInfection() {
        let p1Score = infectionGrid.filter(c => c.owner === playerOne && c.level === 100).length;
        let p2Score = infectionGrid.filter(c => c.owner === playerTwo && c.level === 100).length;
    
        console.log(`🔢 Final Scores -> Player One: ${p1Score}, Player Two: ${p2Score}`);
    
        if (p1Score > p2Score) {
            console.log("🏆 Player One wins by infection!");
            this.endGame(playerOne);
        } else if (p2Score > p1Score) {
            console.log("🏆 Player Two wins by infection!");
            this.endGame(playerTwo);
        } else {
            console.log("⚖️ It's a tie!");
            this.endGame(null);
        }
    }
    
    // Handle game over state
    endGame(winner) {
        console.log(`🏆 ${winner.playerColor} WINS!`);
        display.setAllPixels(winner != null ? winner.playerColor : color(0,0,0));
        this.gameState = "END";
    }
    
}





