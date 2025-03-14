/**************************************
 * A Minimal "Pixel Circle" 1D Game Demo
 * 
 *  - We create an N×N "pixel grid"
 *  - We find ring cells
 *  - We group them into M spots
 *  - We place a "player" on one of these spots
 *  - We draw the ring on screen
 **************************************/

let N = 40;   // N×N grid
let M = 12;   // number of ring spots
let ringCellsAll = [];    // raw ring cells
let mainRing = [];        // largest connected ring (8-connected)
let spots = [];           // M segments
let tileSize = 20;        // each grid cell is 14×14 px
let centerX, centerY, r;  // circle center and radius

// 1D ring logic
let playerSpot = 0; // player index on the ring
let otherSpot  =  Math.floor(M/2); // a second “player”

function setup() {
  createCanvas(N * tileSize, N * tileSize);
  centerX = (N - 1)/2;
  centerY = (N - 1)/2;
  r = (N - 1)/2;

  // 1) Identify ring-ish cells
  ringCellsAll = findRingCells(N, centerX, centerY, r);

  // 2) BFS 8-connected → get components
  let components = getConnectedComponents(ringCellsAll, N);

  // 3) Sort components by size, pick largest
  components.sort((a,b) => b.length - a.length);
  mainRing = components[0] || [];

  // 4) Sort mainRing by angle
  mainRing.sort((a, b) => {
    let angA = atan2(a.y - centerY, a.x - centerX);
    let angB = atan2(b.y - centerY, b.x - centerX);
    return angA - angB;
  });

  // 5) Group mainRing into M spots
  spots = sliceIntoSpots(mainRing, M);

  noSmooth(); // keep pixel edges crisp
}

function draw() {
  background(220);

  // 6) Draw main ring
  drawRing(spots);

  // 7) Color players
  drawSpot(spots[playerSpot], color(255, 0, 0));    // Player 1 in red
  drawSpot(spots[otherSpot],  color(0, 0, 255));   // Player 2 in blue
}

// Example: press D moves playerSpot +1, press A moves -1
// Press L moves otherSpot +1, press J moves -1
function keyPressed() {
  if (key === 'D') {
    playerSpot = (playerSpot + 1) % M;
  } else if (key === 'A') {
    playerSpot = (playerSpot - 1 + M) % M;
  }

  if (key === 'L') {
    otherSpot = (otherSpot + 1) % M;
  } else if (key === 'J') {
    otherSpot = (otherSpot - 1 + M) % M;
  }
}

/***********************************************
 * findRingCells(N, cx, cy, r):
 * Collect all (x,y) whose distance^2 ~ r^2
 ***********************************************/
function findRingCells(N, cx, cy, r) {
  let ringCells = [];
  for (let x=0; x<N; x++) {
    for (let y=0; y<N; y++) {
      let dist2 = (x-cx)*(x-cx) + (y-cy)*(y-cy);
      let r2 = r*r;
      // Tolerance: if |dist2 - r^2| < r => near ring
      if (abs(dist2 - r2) < r/2) {
        ringCells.push({x, y});
      }
    }
  }
  return ringCells;
}

/***************************************************************
 * 8-DIRECTION BFS to group ring cells into connected components
 ***************************************************************/
function getConnectedComponents(ringCells, N) {
  // Put ringCells in a Set for O(1) membership
  let cellSet = new Set();
  for (let c of ringCells) {
    cellSet.add(c.x + ',' + c.y);
  }

  let visited = new Set();
  let components = [];

  for (let c of ringCells) {
    let key = c.x + ',' + c.y;
    if (!visited.has(key)) {
      // BFS from c
      let comp = [];
      let queue = [c];
      visited.add(key);

      while (queue.length > 0) {
        let node = queue.shift();
        comp.push(node);

        for (let nb of get8Neighbors(node.x, node.y, N)) {
          let nbKey = nb.x + ',' + nb.y;
          if (!visited.has(nbKey) && cellSet.has(nbKey)) {
            visited.add(nbKey);
            queue.push(nb);
            queue.push(nb);
            queue[queue.length-1] = nb;
          }
        }
      }
      components.push(comp);
    }
  }
  return components;
}

function get8Neighbors(x, y, N) {
  let res = [];
  for (let dx=-1; dx<=1; dx++) {
    for (let dy=-1; dy<=1; dy++) {
      if (dx===0 && dy===0) continue;
      let nx = x + dx;
      let ny = y + dy;
      if (nx>=0 && nx<N && ny>=0 && ny<N) {
        res.push({x:nx, y:ny});
      }
    }
  }
  return res;
}

/****************************************
 * sliceIntoSpots(ring, M):
 * divides ring array into M segments
 ****************************************/
function sliceIntoSpots(ring, M) {
  let total = ring.length;
  let chunkSize = floor(total/M);
  let result = [];
  let start = 0;
  for (let i=0; i<M; i++){
    let end = (i < M-1) ? start+chunkSize : total;
    result.push(ring.slice(start, end));
    start = end;
  }
  return result;
}

/****************************************
 * drawRing(spots):
 * draws the entire ring in gray
 ****************************************/
function drawRing(spots) {
  fill(120);
  noStroke();
  for (let spot of spots) {
    for (let c of spot) {
      rect(c.x*tileSize, c.y*tileSize, tileSize, tileSize);
    }
  }
}

/****************************************
 * drawSpot(spot, col):
 * draws a single spot with color col
 ****************************************/
function drawSpot(spot, col) {
  fill(col);
  noStroke();
  for (let c of spot) {
    rect(c.x*tileSize, c.y*tileSize, tileSize, tileSize);
  }
}