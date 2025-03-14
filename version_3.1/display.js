// display.js
// Replaces the old angle-based ring with a pixel-based ring using Midpoint Circle.
//
// Key new data:
//   this.ringCells = array of {x,y} for each pixel in the ring
//   this.ringSize  = number of pixel-cells in the ring
//   this.ringMap   = (x,y)->index and index->(x,y)
//   We'll keep the same "trailOwner" and "trailLevel" arrays sized ringSize.
//
// The show() function draws the entire ring in a pixel-grid style.

class Display {
    constructor() {
      // We no longer store _displaySize or _pixelSize at constructor time.
      // We'll do it after we generate the circle.
  
      this.ringCells = [];   // array of {x,y} from midpoint circle
      this.ringSize  = 0;    // how many ring pixels
      this.ringMap   = new Map(); // index-> cell, cell->index
      this.trailOwner= [];   // 'playerOne', 'playerTwo', or null
      this.trailLevel= [];   // integer 0..4
      this.initColor = color(0); // background color for ring
      this.tileSize  = 20;   // each ring cell displayed as 10×10 px
    }
  
    // Midpoint circle approach
    initMidCircleRing(N) {
      // 1) generate ring via midpoint circle
      let cx = (N-1)/2;
      let cy = (N-1)/2;
      let r  = floor((N-1)/2);
  
      let rawRing = midpointCircle(cx, cy, r);
      // remove duplicates, etc. Then sort by angle
      rawRing = uniquePoints(rawRing);
  
      rawRing.sort((a,b)=>{
        let angA = atan2(a.y - cy, a.x - cx);
        let angB = atan2(b.y - cy, b.x - cx);
        return angA - angB;
      });
      this.ringCells = rawRing;
      this.ringSize  = rawRing.length;
  
      // build ringMap and trail arrays
      this.ringMap.clear();
      for(let i=0; i<this.ringSize; i++){
        let c = this.ringCells[i];
        // index -> cell
        this.ringMap.set(i, c);
        // cell -> index
        this.ringMap.set(c.x+','+c.y, i);
      }
  
      // init trailOwner, trailLevel
      this.trailOwner = Array(this.ringSize).fill(null);
      this.trailLevel = Array(this.ringSize).fill(0);
    }
  
    // "setPixel" => color that ring index
    setPixel(index, c) {
      if(index<0||index>=this.ringSize)return;
      // direct color assignment
      // We'll store this in a separate array if needed
      // but for now, let's just do setAllPixels?
    }
  
    setAllPixels(col) {
      for(let i=0;i<this.ringSize;i++){
        this.trailOwner[i]= null;
        this.trailLevel[i]= 0;
      }
      for(let i=0;i<this.ringSize;i++){
        // we won't store actual color array,
        // let's just do it in show() or recordTrail?
      }
    }
  
    // same logic as before, but index is ring index
    recordTrail(ringIndex, owner) {
      if (alcohol.isHit(ringIndex)) return;
  
      let oldOwner = this.trailOwner[ringIndex];
      if (oldOwner===owner) {
        this.trailLevel[ringIndex] = min(this.trailLevel[ringIndex] + 1, 4);
      } else if (oldOwner===null) {
        this.trailOwner[ringIndex] = owner;
        this.trailLevel[ringIndex] = 1;
      } else {
        // competing infection
        this.trailLevel[ringIndex]--;
        if (this.trailLevel[ringIndex]<=0) {
          this.trailOwner[ringIndex] = owner;
          this.trailLevel[ringIndex] = 1;
        }
      }
    }
  
    updateTrailColor(index) {
      // no direct storage, we compute color on the fly in show()
    }
  
    getTrailOwner(index) {
      return this.trailOwner[index];
    }
    getTrailLevel(index) {
      return this.trailLevel[index];
    }
  
    clearTrail(owner) {
      for(let i=0; i<this.ringSize;i++){
        if(this.trailOwner[i]===owner){
          this.trailOwner[i] = null;
          this.trailLevel[i] = 0;
        }
      }
    }
  
    show() {
      push();
      // let xOffset = width / 4;
      // draw entire ring on a pixel grid
      // each ring cell => draw a small square
      noStroke();
      for(let i=0; i<this.ringSize;i++){
        let c = this.ringCells[i]; // {x,y} in NxN
        let baseCol = color(0);  // default
        let owner = this.trailOwner[i];
        let lvl   = this.trailLevel[i];
        if (owner==='playerOne') {
          let colA = color(255);
          let colB = color(197,171,255);
          baseCol = lerpColor(colA, colB, lvl/4.0);
        } else if(owner==='playerTwo') {
          let colA = color(255);
          let colB = color(0,250,154);
          baseCol = lerpColor(colA,colB,lvl/4.0);
        }
        fill(baseCol);
        rect(c.x*this.tileSize + xOffset, c.y*this.tileSize + yOffset, this.tileSize, this.tileSize);
      }
      pop();
    }
  }
  
  /************************************************
   * Midpoint Circle function
   ************************************************/
  function midpointCircle(cx, cy, r) {
    let pts=[];
    let x=0, y=r;
    let d=1-r;
    addAllOctants(cx,cy,x,y,pts);
    while(x<y){
      if(d<0){
        d += 2*x+3;
      } else {
        d += 2*(x-y)+5;
        y--;
      }
      x++;
      addAllOctants(cx,cy,x,y,pts);
    }
    return pts;
  }
  function addAllOctants(cx,cy,x,y,arr){
    arr.push({x:cx+x,y:cy+y});
    arr.push({x:cx-x,y:cy+y});
    arr.push({x:cx+x,y:cy-y});
    arr.push({x:cx-x,y:cy-y});
    arr.push({x:cx+y,y:cy+x});
    arr.push({x:cx-y,y:cy+x});
    arr.push({x:cx+y,y:cy-x});
    arr.push({x:cx-y,y:cy-x});
  }
  function uniquePoints(arr){
    let s=new Set();
    let out=[];
    for(let p of arr){
      let k=p.x+','+p.y;
      if(!s.has(k)){
        s.add(k);
        out.push(p);
      }
    }
    return out;
  }
  