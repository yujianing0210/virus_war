// Alcohol NPC:
// A hazard that randomly appears in the middle and kills any bacteria that touch it.

class Alcohol {
    constructor() {
        let center = Math.floor(displaySize / 2);
        this.positions = [center - 1, center]; // Use grid indices instead of pixel values
        this.isVisible = true;
        this.yOffset = height / 2 - pixelSize / 2;
    }

    update(xOffset) { // Pass xOffset from draw()
        if (frameCount % 120 === 0) {
            this.isVisible = !this.isVisible;
            // console.log(`🚨 Alcohol NPC is now ${this.isVisible ? "VISIBLE" : "INVISIBLE"}`);
        }
    
        if (this.isVisible) {
            fill(255, 248, 196); // Color for alcohol NPC
            for (let pos of this.positions) {
                let pixelX = xOffset + (pos * pixelSize); // 🚨 Fix: Add xOffset to align correctly
                rect(pixelX, this.yOffset, pixelSize, pixelSize);
            }
        }
    }
    
    isHit(bacteriaPosition) {
        // console.log(`🔍 Checking collision: Bacteria at ${bacteriaPosition}, Alcohol at ${this.positions}`);
        return this.isVisible && this.positions.includes(bacteriaPosition);
    }
}
