//The color transparency represents infection level.
// hihihihi

class Display {
  constructor(_displaySize, _pixelSize) {
      this.displaySize = _displaySize;
      this.pixelSize = _pixelSize;
      this.initColor = color(255, 255, 255);  // Set background to white
      this.displayBuffer = Array(this.displaySize).fill(this.initColor);
  }

  setPixel(_index, _color) {
      this.displayBuffer[_index] = _color;
  }

  show() {
      for (let i = 0; i < this.displaySize; i++) {
          fill(this.displayBuffer[i]);
          rect(i * this.pixelSize, 0, this.pixelSize, this.pixelSize);
      }
  }

  clear() {
      this.displayBuffer.fill(this.initColor);
  }
}
