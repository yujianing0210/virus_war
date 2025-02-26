// Bacteria:
// The player's main attack unit that moves in 1D space.

class Bacteria {
    constructor(position, direction, color, speed = 10) { // Add speed control
        console.log(`🦠 New bacteria spawned at position ${position}, moving ${direction > 0 ? "right" : "left"}, speed: ${speed}`);
        this.position = position;
        this.direction = direction;
        this.color = color;
        this.isAlive = true;
        this.speed = speed; // How many frames before moving
        this.frameCounter = 0; // Track frames
    }

    update() {
        if (!this.isAlive) return;
    
        this.frameCounter++; 
        if (this.frameCounter < this.speed) return;
        this.frameCounter = 0;
    
        let nextPosition = (this.position + this.direction + displaySize) % displaySize; // 🚨 Wrap around
    
        // 🚨 Check if bacteria hit Alcohol NPC
        if (alcohol.isHit(nextPosition)) {
            console.log(`💀 Bacteria at ${nextPosition} was killed by Alcohol NPC!`);
            this.die();
            return;
        }
    
        // 🚨 Check if bacteria hit an opponent
        if (nextPosition === playerOne.position && this !== bacteriaOne) {
            console.log(`💥 Bacteria hit Player One at ${playerOne.position}!`);
            playerOne.takeDamage();
            this.die();
            return;
        } 
    
        if (nextPosition === playerTwo.position && this !== bacteriaTwo) {
            console.log(`💥 Bacteria hit Player Two at ${playerTwo.position}!`);
            playerTwo.takeDamage();
            this.die();
            return;
        }
    
        // Remove previous bacteria position
        display.setPixel(this.position, color(255, 255, 255));
    
        // Move bacteria (with wrap-around logic)
        this.position = nextPosition;
    
        // Draw new position
        display.setPixel(this.position, this.color);
    }
    

    changeDirection(newDir) {
        this.direction = newDir;
    }

    die() {
        console.log(`💀 Bacteria at position ${this.position} died.`);
    
        // 🚨 Clear bacteria from screen immediately
        display.setPixel(this.position, color(255, 255, 255));
    
        this.isAlive = false; // Stop bacteria updates
    
        // 🚨 Ensure bacteria reference is removed so players can fire again
        if (this === bacteriaOne) {
            bacteriaOne = null;
        } else if (this === bacteriaTwo) {
            bacteriaTwo = null;
        }
    
        new Animation(this.position); // Trigger death animation
    }

    infectOpponent() {
        console.log("🔥 Bacteria reached opponent's base!");
        this.isAlive = false;
    }
}
