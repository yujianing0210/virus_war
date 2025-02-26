// Display System:
// Controls the rendering of the 1D pixel grid.

class Display {
    constructor(_displaySize, _pixelSize) {
        this.displaySize = _displaySize;
        this.pixelSize = _pixelSize;
        this.initColor = color(255, 255, 255);  // Set background to white
        this.displayBuffer = Array(this.displaySize).fill(this.initColor);
        
        // Calculate offsets for centering
        this.xOffset = (width - (this.displaySize * this.pixelSize)) / 2; // Center horizontally
        this.yOffset = height / 2 - this.pixelSize / 2; // Move to center
    }

    setPixel(_index, _color) {
        this.displayBuffer[_index] = _color;
    }

    setAllPixels(_color) {
        for (let i = 0; i < this.displaySize; i++) {
          this.displayBuffer[i] = _color;
        }
    }
  
    show() {
        translate(width / 2, height / 2); // Move origin to center
        let outerRadius = min(width, height) / 2.1; // Outer boundary
        let innerRadius = outerRadius / 1.09; // Inner boundary to create the ring
        let angleStep = TWO_PI / this.displaySize; // Divide ring into equal segments
    
        for (let i = 0; i < this.displaySize; i++) {
            let startAngle = i * angleStep;
            let endAngle = (i + 1) * angleStep;
    
            fill(this.displayBuffer[i]); // Use stored color for each segment
            stroke(0); // Black outline for sector boundaries
    
            beginShape();
            vertex(innerRadius * cos(startAngle), innerRadius * sin(startAngle)); // Inner ring point 1
            vertex(outerRadius * cos(startAngle), outerRadius * sin(startAngle)); // Outer ring point 1
            vertex(outerRadius * cos(endAngle), outerRadius * sin(endAngle)); // Outer ring point 2
            vertex(innerRadius * cos(endAngle), innerRadius * sin(endAngle)); // Inner ring point 2
            endShape(CLOSE);
        }
    }
    
    
    
    

    clear() {
        this.displayBuffer.fill(this.initColor);
    }
}
