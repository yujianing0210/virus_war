// Players increase infection level when moving over a cell.
// Cannot move past each other or enter fully infected opponent cells.

class Player {
    constructor(_color, _position, _displaySize) {
        this.playerColor = _color;
        this.position = _position;
        this.score = 0;
        this.displaySize = _displaySize;
    }

    move(_direction) {
        let newPosition = this.position + _direction;
    
        // Wrap around behavior
        if (newPosition < 0) {
            newPosition = this.displaySize - 1; // Move to the last cell if going left past 0
        } else if (newPosition >= this.displaySize) {
            newPosition = 0; // Move to the first cell if going right past the last cell
        }
    
        // Prevent entering 100% locked cells of the opponent
        if (infectionGrid[newPosition].level === 100 && infectionGrid[newPosition].owner !== this) {
            return;
        }
    
        // Infect or compete for the new cell
        this.infect(newPosition);
    
        // Move to new position
        this.position = newPosition;
    }
    

    infect(index) {
        let cell = infectionGrid[index];

        if (cell.owner === this) {
            // Already owned by the player, increase infection
            if (cell.level < 100) {
                cell.level += 25;
                if (cell.level > 100) cell.level = 100; // Cap at 100%
            }
        } else if (cell.owner === null) {
            // Unclaimed cell, start infecting
            cell.owner = this;
            cell.level = 25;
        } else {
            // Opponent's cell - compete for infection
            cell.level -= 25;

            if (cell.level <= 0) {
                // If the opponent's infection is removed, claim the cell
                cell.owner = this;
                cell.level = 25; // Start fresh infection
            }
        }
    }
}
