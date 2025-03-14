// alcohol.js
// Now we store ring indexes for the alcohol, not angles

class Alcohol {
    constructor() {
      this.isVisible = true;
      this.positions = [];  
      this.randomizePositionAndLength();
    }
  
    randomizePositionAndLength() {
      let length = floor(random(1,5)); 
      let startPos = floor(random(0, display.ringSize - length));
      this.positions = [];
      for(let i=0; i<length; i++){
        this.positions.push((startPos+i)%display.ringSize);
      }
      console.log(`🍺 Alcohol spans ${this.positions.length} ring spots`);
    }
  
    update() {
      // We won't actually draw here. We'll do it in drawAlcohol() in sketch.js
      if(frameCount%120===0){
        this.isVisible=!this.isVisible;
        if(this.isVisible) this.randomizePositionAndLength();
      }
    }
  
    isHit(bacteriaPos){
      return this.isVisible && this.positions.includes(bacteriaPos);
    }
  }
  