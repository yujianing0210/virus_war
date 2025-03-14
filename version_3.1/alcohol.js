// alcohol.js
// Now we store ring indexes for the alcohol, not angles

class Alcohol {
    constructor() {
      this.isVisible = true;
      this.positions = [];  
      this.randomizePositionAndLength();
      this.blinkCooldown();    // set an initial random blink schedule
    }

    // picks random time (60..180 frames) => 1..3 seconds at 60fps
    blinkCooldown() {
      this.nextBlinkFrame = frameCount + floor(random(30, 240));
    }
  
    randomizePositionAndLength() {
      let length = floor(random(5,16)); 
      let startPos = floor(random(0, display.ringSize - length));
      this.positions = [];
      for(let i=0; i<length; i++){
        this.positions.push((startPos+i)%display.ringSize);
      }
      console.log(`🍺 Alcohol spans ${this.positions.length} ring spots`);
    }
  
    update() {
      // check if time to blink
      if (frameCount >= this.nextBlinkFrame) {
        this.isVisible = !this.isVisible; // toggle
        if (this.isVisible) {
          this.randomizePositionAndLength(); // move somewhere new
        }
        this.blinkCooldown(); // schedule next toggle
      }
    }
  
    isHit(bacteriaPos){
      return this.isVisible && this.positions.includes(bacteriaPos);
    }
  }
  