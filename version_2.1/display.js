class Display {
    constructor(displaySize, pixelSize) {
        this.displaySize = displaySize;
        this.pixelSize = pixelSize;
        this.displayBuffer = Array(this.displaySize).fill([255, 255, 255]); // White background
    }

    setPixel(index, colorValue) {
        if (index >= 0 && index < this.displaySize) {
            this.displayBuffer[index] = colorValue;
        }
    }

    show() {
        for (let i = 0; i < this.displaySize; i++) {
            fill(this.displayBuffer[i][0], this.displayBuffer[i][1], this.displayBuffer[i][2]);
            rect(i * this.pixelSize, 0, this.pixelSize, this.pixelSize);
        }
    }

    clear() {
        this.displayBuffer.fill([255, 255, 255]); // Reset all pixels to white
    }
}
