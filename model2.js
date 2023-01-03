var CELL_SIZE = -1; // 10 size of each cell in pixels
var GRID_WIDTH = -1; // 60 number of cells wide
var GRID_HEIGHT = -1; // 60 number of cells tall

export function setGridContext(cellSize, gridWidth, gridHeight) {
  CELL_SIZE = cellSize;
  GRID_WIDTH = gridWidth;
  GRID_HEIGHT = gridHeight;
  console.log("size, with, height - " + CELL_SIZE + ", " + GRID_WIDTH + ", " + GRID_HEIGHT);
}

// create an empty grid of cells
export function createGrid() {
  let grid = new Array(GRID_WIDTH);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(GRID_HEIGHT);
  }

  // initialize the grid with random values
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      grid[x][y] = Math.random() < 0.5 ? 1 : 0;
    }
  }

  return grid;
}

// function to draw the grid on the canvas
export function draw(ctx, grid) {
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      let cell = grid[x][y];
      let color = cell == 1 ? "black" : "lightgray";
      ctx.fillStyle = color;
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

// function to update the grid for the next generation
export function update(grid) {
  let newGrid = new Array(GRID_WIDTH);
  for (let i = 0; i < newGrid.length; i++) {
    newGrid[i] = new Array(GRID_HEIGHT);
  }

  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      let neighbors = countLiveNeighbors(grid, x, y);
      if (grid[x][y] == 1) {
        if (neighbors < 2 || neighbors > 3) {
          newGrid[x][y] = 0;
        } else {
          newGrid[x][y] = 1;
        }
      } else {
        if (neighbors == 3) {
          newGrid[x][y] = 1;
        } else {
          newGrid[x][y] = 0;
        }
      }
    }
  }

  return newGrid;
}

// function to count the number of live neighbors a cell has
export function countLiveNeighbors(grid, x, y) {
  let count = 0;
  const rows = grid.length;
  const cols = grid[0].length;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue;
      }
      const row = (x + i + rows) % rows;
      const col = (y + j + cols) % cols;
      if (grid[row][col] === 1) {
        count++;
      }
    }
  }
  return count;
}

export class SparseArray {
  constructor() {
    this.elements = {};
  }

  set(i, j, value) {
    if (value === 0) {
      delete this.elements[i][j];
    } else {
      this.elements[i] = this.elements[i] || {};
      this.elements[i][j] = value;
    }
  }

  get(i, j) {
    if (this.elements[i] && this.elements[i][j]) {
      return this.elements[i][j];
    }
    return 0;
  }
}




