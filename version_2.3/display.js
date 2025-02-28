// Display System:
// Controls the rendering of the 1D pixel grid.

class Display {
    constructor(_displaySize, _pixelSize) {
        this.displaySize = _displaySize;
        this.pixelSize = _pixelSize;
        this.initColor = color(255, 255, 255);  // Set background to white
        this.displayBuffer = Array(this.displaySize).fill(this.initColor);
        this.trailOwner = Array(this.displaySize).fill(null); // 记录每个格子属于谁 ('playerOne' or 'playerTwo')
        this.trailLevel = Array(this.displaySize).fill(0); // 记录细菌经过次数（0-4）


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

    recordTrail(index, owner) {
        if (alcohol.isHit(index)) return;
    
        if (this.trailOwner[index] === owner) {
            this.trailLevel[index] = Math.min(this.trailLevel[index] + 1, 4);
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
    
    updateTrailColor(index) {
        // let alpha = 180;  // 轨迹透明度
        if (this.trailOwner[index] === 'playerOne') {
            let trailColor = lerpColor(color(255), color(197, 171, 255), this.trailLevel[index] / 4 );
            this.displayBuffer[index] = color(
                red(trailColor),
                green(trailColor),
                blue(trailColor),
                // alpha
            );
        } else if (this.trailOwner[index] === 'playerTwo') {
            let trailColor = lerpColor(color(255), color(0, 250, 154), this.trailLevel[index] / 4 );
            this.displayBuffer[index] = color(
                red(trailColor),
                green(trailColor),
                blue(trailColor),
                // alpha
            );
        } else {
            this.displayBuffer[index] = color(255);
        }
    }    
    

    getTrailOwner(index) {
        return this.trailOwner ? this.trailOwner[index] : null;
    }    

    getTrailLevel(index) {
        return this.trailLevel ? this.trailLevel[index] : 0;
    }

    clearTrail(owner) { //清空轨迹（细菌死掉时调用）
        for (let i = 0; i < this.displaySize; i++) {
            if (this.trailOwner[i] === owner) {
                this.trailOwner[i] = null;
                this.trailLevel[i] = 0;
                this.displayBuffer[i] = color(255);
            }
        }
    }
    
  
    show() {
        push();

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

        pop();
    }

    clear() {
        this.displayBuffer.fill(this.initColor);
    }
}
