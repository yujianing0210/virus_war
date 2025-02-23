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

        this.frameCounter++; // Count frames

        if (this.frameCounter < this.speed) return; // Skip movement until enough frames pass
        this.frameCounter = 0; // Reset frame counter after moving

        let nextPosition = this.position + this.direction;

        // Remove previous bacteria position (only if it's not occupied by a player)
        if (this.position !== playerOne.position && this.position !== playerTwo.position) {
            display.setPixel(this.position, color(255, 255, 255));
        }

        // If bacteria reaches the opponent's base, infect the cell
        if (nextPosition < 0 || nextPosition >= displaySize) {
            this.infectOpponent();
            return;
        }

        // Move bacteria
        this.position = nextPosition;

        // Draw bacteria in new position
        if (this.position !== playerOne.position && this.position !== playerTwo.position) {
            display.setPixel(this.position, this.color);
        }
    }

    changeDirection(newDir) {
        this.direction = newDir;
    }

    die() {
        console.log(`💀 Bacteria at position ${this.position} died.`);
        this.isAlive = false;
        new Animation(this.position);
    }

    infectOpponent() {
        console.log("🔥 Bacteria reached opponent's base!");
        this.isAlive = false;
    }
}
