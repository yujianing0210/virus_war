class Display {
    constructor(_displaySize, _pixelSize) {
      this.displaySize = _displaySize;  // Number of 'cells' along the circle perimeter
      this.pixelSize = _pixelSize;      // Size of each block
      this.initColor = color(0);        // Default color
      this.displayBuffer = Array(this.displaySize).fill(this.initColor);
  
      this.trailOwner = Array(this.displaySize).fill(null);
      this.trailLevel = Array(this.displaySize).fill(0);
  
      // Precompute integer coordinates for each cell along a circle boundary
      this.circlePoints = [];
      this.computeCirclePoints();
    }
  
    // 🔧 Precompute circle boundary coordinates:
    // We use an angle-based approach, snapping to integer pixels for that blocky look.
    computeCirclePoints() {
      this.circlePoints = [];
      let radius = min(windowWidth, windowHeight) / 2.2;  // slightly smaller than half screen
      for (let i = 0; i < this.displaySize; i++) {
        let angle = map(i, 0, this.displaySize, 0, TWO_PI);
  
        // Parametric circle coords, then round to integer grid
        let x = round(radius * cos(angle));
        let y = round(radius * sin(angle));
  
        // Store final coordinate
        this.circlePoints.push({ x, y });
      }
    }
  
    // 🔧 Called from your game logic: update color of cell i
    setPixel(_index, _color) {
      this.displayBuffer[_index] = _color;
    }
  
    // 🔧 Fill entire ring with a single color (endGame usage)
    setAllPixels(_color) {
      for (let i = 0; i < this.displaySize; i++) {
        this.displayBuffer[i] = _color;
      }
    }
  
    // 🔧 Called every frame from draw():
    show() {
      push();
      translate(width / 2, height / 2);    // Move origin to center
  
      noSmooth();  // Ensure pixel edges are crisp
      for (let i = 0; i < this.displaySize; i++) {
        let p = this.circlePoints[i];      // integer coords for cell i
        fill(this.displayBuffer[i]);
        stroke(50);                        // slight border color
        rect(p.x, p.y, this.pixelSize, this.pixelSize);
      }
  
      pop();
    }
  
    // 🔧 Mark a cell as infected by a given owner
    recordTrail(index, owner) {
      if (alcohol.isHit(index)) return;
  
      if (this.trailOwner[index] === owner) {
        this.trailLevel[index] = min(this.trailLevel[index] + 1, 4);
      } else if (this.trailOwner[index] === null) {
        this.trailOwner[index] = owner;
        this.trailLevel[index] = 1;
      } else {
        this.trailLevel[index]--;
        if (this.trailLevel[index] <= 0) {
          this.trailOwner[index] = owner;
          this.trailLevel[index] = 1;
        }
      }
      this.updateTrailColor(index);
    }
  
    // 🔧 Infected color depends on trailLevel & owner
    updateTrailColor(index) {
      let tLevel = this.trailLevel[index];
      if (this.trailOwner[index] === 'playerOne') {
        let c = lerpColor(color(255), color(197, 171, 255), tLevel / 4);
        this.displayBuffer[index] = c;
      } else if (this.trailOwner[index] === 'playerTwo') {
        let c = lerpColor(color(255), color(0, 250, 154), tLevel / 4);
        this.displayBuffer[index] = c;
      } else {
        this.displayBuffer[index] = color(255);
      }
    }
  
    // 🔧 Clear entire ring for a given owner's trail (on bacteria die)
    clearTrail(owner) {
      for (let i = 0; i < this.displaySize; i++) {
        if (this.trailOwner[i] === owner) {
          this.trailOwner[i] = null;
          this.trailLevel[i] = 0;
          this.displayBuffer[i] = color(0);
        }
      }
    }
  }
  