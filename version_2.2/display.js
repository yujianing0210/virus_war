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
        for (let i = 0; i < this.displaySize; i++) {
            fill(this.displayBuffer[i]);
            rect(this.xOffset + (i * this.pixelSize), this.yOffset, this.pixelSize, this.pixelSize);
            // rect((i * this.pixelSize), this.yOffset, this.pixelSize, this.pixelSize);
        }
    }

    clear() {
        this.displayBuffer.fill(this.initColor);
    }
}
