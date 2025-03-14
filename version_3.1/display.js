// display.js

class Display {
    constructor() {
      this.ringCells = [];  
      this.ringSize  = 0;    
      this.ringMap   = new Map();
      this.trailOwner= [];   
      this.trailLevel= [];   
      this.initColor = color(0);
      this.tileSize  = 20;
  
      // We'll store a special "winnerColor" used when the entire ring is "WINNER".
      this.winnerColor = null; 
    }
  
    initMidCircleRing(N) {
      let cx = (N-1)/2;
      let cy = (N-1)/2;
      let r  = floor((N-1)/2);
  
      let rawRing = midpointCircle(cx, cy, r);
      rawRing = uniquePoints(rawRing);
  
      rawRing.sort((a,b)=>{
        let angA = atan2(a.y - cy, a.x - cx);
        let angB = atan2(b.y - cy, b.x - cx);
        return angA - angB;
      });
      this.ringCells = rawRing;
      this.ringSize  = rawRing.length;
  
      this.ringMap.clear();
      for(let i=0; i<this.ringSize; i++){
        let c = this.ringCells[i];
        this.ringMap.set(i, c);
        this.ringMap.set(c.x+','+c.y, i);
      }
  
      this.trailOwner = Array(this.ringSize).fill(null);
      this.trailLevel = Array(this.ringSize).fill(0);
      this.winnerColor = null; // no winner yet
    }
  
    setPixel(index, c) {
      if(index<0||index>=this.ringSize)return;
      // not used in the new approach
    }
  
    // 🚨 Instead of clearing everything to black, let's forcibly mark ring as "WINNER"
    setAllPixels(col) {
      this.winnerColor = col;        // store the color
      for(let i=0;i<this.ringSize;i++){
        this.trailOwner[i] = 'WINNER'; // special label
        this.trailLevel[i] = 4;        // max infection
      }
    }
  
    recordTrail(ringIndex, owner) {
      if (alcohol.isHit(ringIndex)) return;
      
      // If the ring is forcibly "WINNER," do we still let infection happen?
      // Usually no, so skip if it's "WINNER"
      if (this.trailOwner[ringIndex]==='WINNER') {
        return;
      }
  
      let oldOwner = this.trailOwner[ringIndex];
      if (oldOwner===owner) {
        this.trailLevel[ringIndex] = min(this.trailLevel[ringIndex] + 1, 4);
      } else if (oldOwner===null) {
        this.trailOwner[ringIndex] = owner;
        this.trailLevel[ringIndex] = 1;
      } else {
        this.trailLevel[ringIndex]--;
        if (this.trailLevel[ringIndex]<=0) {
          this.trailOwner[ringIndex] = owner;
          this.trailLevel[ringIndex] = 1;
        }
      }
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
      noStroke();
  
      for(let i=0; i<this.ringSize;i++){
        let c = this.ringCells[i];
        let owner = this.trailOwner[i];
        let lvl   = this.trailLevel[i];
        
        let baseCol = color(0);
  
        if (owner==='WINNER') {
          // 🚨 entire ring pixel is forcibly the winner color
          baseCol = this.winnerColor || color(255,0,0); 
        } else if (owner==='playerOne') {
          let colA = color(255);
          let colB = color(197,171,255);
          baseCol = lerpColor(colA, colB, lvl/4.0);
        } else if(owner==='playerTwo') {
          let colA = color(255);
          let colB = color(0,250,154);
          baseCol = lerpColor(colA, colB, lvl/4.0);
        }
        fill(baseCol);
  
        // optional offsets if needed
        rect(c.x*this.tileSize + xOffset, c.y*this.tileSize + yOffset, this.tileSize, this.tileSize);
      }
      pop();
    }
  }
  
  // Midpoint circle + helpers
  
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
  