class Player {
    constructor(position, baseColor) {
        this.position = position;
        this.baseColor = baseColor;
        this.health = 100; // Full health (4 hits)
        this.color = baseColor;
    }

    takeDamage() {
        if (this.health > 0) {
            this.health -= 100; // Lose 25% health per hit
            this.darkenColor(); // Update color
            console.log(`⚠️ Player at position ${this.position} took damage! Health: ${this.health}%`);

            if (this.health <= 0) {
                console.log("💀 Player has been defeated! Opponent wins!");
                this.color = color(0, 0, 0); // Turn black
                endGame(); // Trigger game over logic
            }
        }
    }

    darkenColor() {
        let darkenFactor = (100 - this.health) / 100; // 0 at full health, 1 at 0 health
        this.color = lerpColor(this.baseColor, color(0, 0, 0), darkenFactor);
    }
}
