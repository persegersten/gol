import  { countLiveNeighbors } from '../model2.js';
import { strict as assert } from 'assert';

// Unit tests

const grid = [[0, 1, 0], 
              [1, 1, 1], 
              [0, 1, 0]];
assert.strictEqual(countLiveNeighbors(grid, 1, 1), 4);

const grid2 = [[1, 0, 1],
               [0, 1, 0], 
               [1, 0, 1]];
assert.strictEqual(countLiveNeighbors(grid2, 1, 1), 4);

const grid3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
assert.strictEqual(countLiveNeighbors(grid3, 1, 1), 0);

const grid4 = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
assert.strictEqual(countLiveNeighbors(grid4, 0, 0), 8);

const grid5 = [[1, 0, 1], 
               [0, 1, 0], 
               [1, 0, 1]];
assert.strictEqual(countLiveNeighbors(grid5, 0, 0), 4);

console.log('All tests passed');



