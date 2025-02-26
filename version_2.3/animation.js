// Visual Effects:
// Provides animations when bacteria die.

class Animation {
    constructor(position) {
        this.position = position;
        this.frames = 20;
        this.currentFrame = 0;
        this.active = true;
    }

    update() {
        if (!this.active) return;
        
        // 颜色闪烁
        let flickerColor = (this.currentFrame % 2 === 0) ? color(255, 255, 255) : color(255, 100, 100);
        fill(flickerColor);
        rect(this.position, 0, 10, 10);

        this.currentFrame++;
        if (this.currentFrame > this.frames) this.active = false;
    }
}
