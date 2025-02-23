// Alcohol NPC:
// A hazard that randomly appears in the middle and kills any bacteria that touch it.

class Alcohol {
    constructor() {
        this.positions = [width / 2 - pixelSize, width / 2, width / 2 + pixelSize];
        this.isVisible = true;
        this.yOffset = height / 2 - pixelSize / 2; // Align with the centered pixel line
    }

    update() {
        if (frameCount % 60 === 0) {
            this.isVisible = !this.isVisible;
        }

        if (this.isVisible) {
            fill(255, 255, 0);
            for (let pos of this.positions) {
                rect(pos, this.yOffset, pixelSize, pixelSize); // Draw at new Y position
            }
        }
    }

    isHit(bacteriaPosition) {
        return this.isVisible && this.positions.includes(bacteriaPosition);
    }
}
