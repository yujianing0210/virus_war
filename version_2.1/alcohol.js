class Alcohol {
    constructor(displaySize) {
        this.positions = [parseInt(displaySize / 2 - 2), parseInt(displaySize / 2 - 1), parseInt(displaySize / 2)];
        this.isVisible = true;
    }

    update() {
        if (frameCount % 60 === 0) { // Toggle visibility every second
            this.isVisible = !this.isVisible;
        }

        if (this.isVisible) {
            fill(0, 255, 0);
            for (let pos of this.positions) {
                rect(pos * 10, 0, 20, 20);
            }
        }
    }

    isHit(bacteriaPosition) {
        return this.isVisible && this.positions.includes(bacteriaPosition);
    }
}
