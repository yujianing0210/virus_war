// Alcohol NPC:
// A hazard that randomly appears in the middle and kills any bacteria that touch it.

class Alcohol {
    constructor() {
        this.positions = [width / 2 - 10, width / 2, width / 2 + 10];
        this.isVisible = true;
    }

    update() {
        if (frameCount % 60 === 0) { // blinks on and off every second
            this.isVisible = !this.isVisible;
        }

        if (this.isVisible) {
            fill(0, 255, 0);
            for (let pos of this.positions) {
                rect(pos, 0, 10, 10);
            }
        }
    }

    isHit(bacteriaPosition) {
        return this.isVisible && this.positions.includes(bacteriaPosition);
    }
}
