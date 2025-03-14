// bacteria.js
class Bacteria {
    constructor(position,direction,col, baseSpeed, owner){
      this.position= position;  // [0..ringSize-1]
      this.direction=direction; 
      this.color= col;
      this.baseSpeed= baseSpeed;
      this.owner= owner;
      this.isAlive=true;
      this.frameCounter=0;
      this.speed= baseSpeed;
    }
    update(){
      if(!this.isAlive)return;
      this.frameCounter++;
      if(this.frameCounter< this.speed)return;
      this.frameCounter=0;
  
      let nextPos= (this.position + this.direction + display.ringSize)%display.ringSize;
  
      // check alcohol
      if(alcohol.isHit(nextPos)){
        console.log(`💀 Bacteria ${this.owner} hit alcohol at ${nextPos}`);
        this.die();
        return;
      }
      // check if hits opponent
      let opponent= (this.owner==='playerOne')? playerTwo: playerOne;
      if(nextPos===opponent.position){
        console.log(`💥 Bacteria ${this.owner} hit opponent`);
        opponent.takeDamage();
        this.die();
        return;
      }
      // record trail
      display.recordTrail(nextPos, this.owner);
      this.position= nextPos;
      this.speed=this.getDynamicSpeed(nextPos);
    }
    getDynamicSpeed(idx){
      let to= display.getTrailOwner(idx);
      let lvl= display.getTrailLevel(idx);
      if(to===this.owner){
        let spFactor=1 - this.getSpeedBoost(lvl);
        return max(5,floor(this.baseSpeed*spFactor));
      } else if(to===null){
        return this.baseSpeed;
      } else {
        let spFactor=1 + this.getSpeedPenalty(lvl);
        return min(30,floor(this.baseSpeed*spFactor));
      }
    }
    getSpeedBoost(lvl){
      switch(lvl){
        case 1:return 0.5;case 2:return 0.6;case 3:return 0.8;case 4:return 0.9;
        default:return 0;
      }
    }
    getSpeedPenalty(lvl){
      switch(lvl){
        case 1:return 0.5;case 2:return 0.6;case 3:return 0.8;case 4:return 0.9;
        default:return 0;
      }
    }
    changeDirection(d){
      this.direction=d;
      console.log(`${this.owner} bacteria dir=${d}`);
    }
    die() {
      console.log(`💀 Bacteria ${this.owner} died.`);
      
      // Clear its trail
      display.clearTrail(this.owner);
      
      // Mark this bacterium as dead
      this.isAlive = false;
      
      // Also reset the global reference so the game logic can spawn another
      if (this.owner === 'playerOne') {
        bacteriaOne = null;
      } else {
        bacteriaTwo = null;
      }
    }
    
  }
  
