// Alcohol NPC:
// A hazard that randomly appears in the middle and kills any bacteria that touch it.

class Alcohol {
    constructor() {
        let center = Math.floor(displaySize / 2);
        this.positions = [center - 1, center]; // Use grid indices instead of pixel values
        this.isVisible = true;
        this.yOffset = height / 2 - pixelSize / 2;
        this.randomizePositionAndLength();
    }

    randomizePositionAndLength() {
        let maxLength = 5; // Can adjust max length as needed 
        let length = Math.floor(random(1, maxLength + 1)); // Length between 1 and 5
        let startPosition = Math.floor(random(0, displaySize - length));

        this.positions = [];
        for (let i = 0; i < length; i++) {
            this.positions.push((startPosition + i) % displaySize); // Wrap if needed
        }

        console.log(`🍺 Alcohol NPC now spans ${this.positions.length} cells, starting at ${startPosition}`);
    }

    update(xOffset, yOffset, outerRadius) {
        if (frameCount % 120 === 0) {
            this.isVisible = !this.isVisible;

            if (this.isVisible) {
                this.randomizePositionAndLength(); // New position & length every time it appears
            }
        }
    
        if (this.isVisible) {
            let angleStep = TWO_PI / displaySize;
            let innerRadius = outerRadius / 1.09; // Match inner ring size
    
            fill(255, 248, 196); // Yellow for Alcohol NPC
            stroke(0);
    
            for (let i = 0; i < this.positions.length; i++) {
                let startAngle = this.positions[i] * angleStep;
                let endAngle = (this.positions[i] + 1) * angleStep;
    
                beginShape();
                vertex(innerRadius * cos(startAngle) + xOffset, innerRadius * sin(startAngle) + yOffset);
                vertex(outerRadius * cos(startAngle) + xOffset, outerRadius * sin(startAngle) + yOffset);
                vertex(outerRadius * cos(endAngle) + xOffset, outerRadius * sin(endAngle) + yOffset);
                vertex(innerRadius * cos(endAngle) + xOffset, innerRadius * sin(endAngle) + yOffset);
                endShape(CLOSE);
            }
        }
    }
    
    
    
    isHit(bacteriaPosition) {
        // console.log(`🔍 Checking collision: Bacteria at ${bacteriaPosition}, Alcohol at ${this.positions}`);
        return this.isVisible && this.positions.includes(bacteriaPosition);
    }
}
