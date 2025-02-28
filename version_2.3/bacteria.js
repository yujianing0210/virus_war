// Bacteria:
// The player's main attack unit that moves in 1D space.

class Bacteria {
    constructor(position, direction, color, baseSpeed, owner) {
        this.position = position;              // 当前细菌位置
        this.direction = direction;            // 移动方向（1=顺时针，-1=逆时针）
        this.color = color;                     // 细菌颜色（可用于特殊效果）
        this.baseSpeed = baseSpeed;             // 细菌基础速度
        this.owner = owner;                     // 归属玩家 ('playerOne' or 'playerTwo')
        this.isAlive = true;                    // 细菌是否存活
        this.frameCounter = 0;                   // 控制速度的计数器
        this.speed = baseSpeed;                  // 当前速度
    }

    update() {
        if (!this.isAlive) return;

        this.frameCounter++;
        if (this.frameCounter < this.speed) return;  // 根据动态速度控制移动节奏
        this.frameCounter = 0;

        let nextPosition = (this.position + this.direction + displaySize) % displaySize;

        // 🧴 碰撞检测：如果细菌撞上酒精，直接死亡并清除轨迹
        if (alcohol.isHit(nextPosition)) {
            console.log(`💀 Bacteria ${this.owner} hit alcohol at ${nextPosition}`);
            this.die();
            return;
        }

        // 💥 碰撞检测：如果细菌撞到对方玩家，触发伤害并死亡
        let opponent = (this.owner === 'playerOne') ? playerTwo : playerOne;
        if (nextPosition === opponent.position) {
            console.log(`💥 Bacteria ${this.owner} hit ${this.owner === 'playerOne' ? 'Player Two' : 'Player One'}`);
            opponent.takeDamage();
            this.die();
            return;
        }

        // 🎨 记录当前格子被细菌经过（染色逻辑）
        display.recordTrail(nextPosition, this.owner);

        // 🟣 主动设置当前格子的颜色（细菌颜色），否则不会显示
        // display.setPixel(nextPosition, this.color);

        // 🚀 更新细菌位置
        this.position = nextPosition;

        // ⏩ 重新计算细菌的移动速度（基于当前位置的颜色归属）
        this.speed = this.getDynamicSpeed(nextPosition);
    }

    getDynamicSpeed(index) {
        let trailOwner = display.getTrailOwner(index);
        let trailLevel = display.getTrailLevel(index);  // 记得在display.js加这个接口
    
        if (trailOwner === this.owner) {
            // 🟣 自己的格子，加速
            let speedFactor = 1 - this.getSpeedBoost(trailLevel);  // 越高越快
            return Math.max(5, Math.floor(this.baseSpeed * speedFactor));  // 最快5帧/格
        } else if (trailOwner === null) {
            // ⚪ 白色格子，正常速度
            return this.baseSpeed;
        } else {
            // 🟢 敌方的格子，减速
            let speedFactor = 1 + this.getSpeedPenalty(trailLevel);  // 越高越慢
            return Math.min(30, Math.floor(this.baseSpeed * speedFactor));  // 最慢30帧/格
        }
    }
    
    // 辅助函数：加速倍率
    getSpeedBoost(level) {
        switch(level) {
            case 1: return 0.5;  // +25%
            case 2: return 0.6;  // +50%
            case 3: return 0.8;  // +75%
            case 4: return 0.9;  // +90%
            default: return 0;
        }
    }
    
    // 辅助函数：减速倍率
    getSpeedPenalty(level) {
        switch(level) {
            case 1: return 0.5;  // -25%
            case 2: return 0.6;  // -50%
            case 3: return 0.8;  // -75%
            case 4: return 0.9;  // -90%
            default: return 0;
        }
    }

    changeDirection(newDirection) {
        this.direction = newDirection;
        console.log(`${this.owner}'s bacteria changed direction to ${newDirection > 0 ? 1 : -1}`);
    }

    die() {
        console.log(`💀 Bacteria ${this.owner} died, clearing trail.`);
        display.clearTrail(this.owner);  // 清空该玩家的所有细菌轨迹
        // display.setPixel(this.position, color(255));  // 细菌所在格子变白
        this.isAlive = false;
    }
}
