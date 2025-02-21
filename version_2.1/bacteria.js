class Bacteria {
    constructor(position, direction, color) {
        this.position = position;
        this.direction = direction;
        this.color = [red(color), green(color), blue(color)];
        this.isAlive = true;
    }

    update() {
        if (!this.isAlive) return;

        // Remove previous position
        display.setPixel(this.position, [255, 255, 255]); 

        // Move bacteria
        this.position += this.direction;

        // Check if bacteria hit alcohol
        if (alcohol.isHit(this.position)) {
            this.isAlive = false;
            return;
        }

        // Check if bacteria reached opponent's end
        if (this.position <= 0 || this.position >= display.displaySize - 1) {
            endGame(this.position === 0 ? "Player 1" : "Player 2");
            return;
        }

        // Draw new position
        display.setPixel(this.position, this.color);
    }

    changeDirection(newDir) {
        this.direction = newDir;
    }
}
