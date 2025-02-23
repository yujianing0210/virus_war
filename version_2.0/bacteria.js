// Bacteria:
// The player's main attack unit that moves in 1D space.

class Bacteria {
    constructor(position, direction, color) {
        this.position = position;
        this.direction = direction;
        this.color = color;
        this.isAlive = true;
    }

    update() {
        if (!this.isAlive) return;

        // Remove previous position
        display.setPixel(this.position, color(255, 255, 255));

        // If bacteria reaches the opponent's base, infect the cell
        if (nextPosition < 0 || nextPosition >= displaySize) {
            this.infectOpponent();
            return;
        }

        // Move bacteria
        this.position += this.direction;

        // Draw new position
        display.setPixel(this.position, this.color);
    }

    changeDirection(newDir) {
        this.direction = newDir;
    }

    die() {
        this.isAlive = false;
        new Animation(this.position); // 触发动画
    }

    infectOpponent() {
        console.log("🔥 细菌成功感染对方端点！");
    }
}
