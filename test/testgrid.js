import {Grid, Model} from '../model.js';
import { strict as assert } from 'assert';

function verifyGrid(grid, expectedGrid, expectedLivingCells, expectedNeighboursCount) {
  //console.log("Hi there");
  for (var r=0; r<3; r++) {
    for (var c=0; c<3; c++) {
      assert.equal(grid.value(r,c), expectedGrid[r][c], "Wrong value at r="+r+" c="+ c);
    }
  }
  //console.log(grid.getLivingCells());
  //console.log(expectedLivingCells);
  assert.equal(JSON.stringify(grid.getLivingCells()), JSON.stringify(expectedLivingCells), "Living cells not as expected");

  var count = grid.livingNeighboursCount(0,0);
  assert.equal(count, expectedNeighboursCount[0], "Wrong number of living neighbours, 0,0");

  count = grid.livingNeighboursCount(0,1);
  assert.equal(count, expectedNeighboursCount[1], "Wrong number of living neighbours, 0,1");

  count = grid.livingNeighboursCount(0,2);
  assert.equal(count, expectedNeighboursCount[2], "Wrong number of living neighbours, 0,2");

  count = grid.livingNeighboursCount(1,0);
  assert.equal(count, expectedNeighboursCount[3], "Wrong number of living neighbours, 1,0");

  count = grid.livingNeighboursCount(1,1);
  assert.equal(count, expectedNeighboursCount[4], "Wrong number of living neighbours, 1,1");

  count = grid.livingNeighboursCount(1,2);
  assert.equal(count, expectedNeighboursCount[5], "Wrong number of living neighbours, 1,2");

  count = grid.livingNeighboursCount(2,0);
  assert.equal(count, expectedNeighboursCount[6], "Wrong number of living neighbours, 2,0");

  count = grid.livingNeighboursCount(2,1);
  assert.equal(count, expectedNeighboursCount[7], "Wrong number of living neighbours, 2,1");

  count = grid.livingNeighboursCount(2,2);
  assert.equal(count, expectedNeighboursCount[8], "Wrong number of living neighbours, 2,2");

}

describe('create grid with values', function () {
  it("empty grid", function () {
    var uut = new Grid(3,3);
    var expectedGrid = [[false, false, false],
                    [false, false, false],
                    [false, false, false]];

    var expectedLivingCells = [];

    var expectedNeighboursCount = [0,0,0,
                                   0,0,0,
                                   0,0,0];

    verifyGrid(uut, expectedGrid, expectedLivingCells, expectedNeighboursCount);

  });

  
  it("set grid states trivial", function () {
    var uut = new Grid(3,3);

    uut.setState(0,0,true);

    var expectedGrid = [[true, false, false],
                       [false, false, false],
                       [false, false, false]];

    var expectedLivingCells = [[0,0]];

    var expectedNeighboursCount = [0,1,1,
                                   1,1,1,
                                   1,1,1];

    verifyGrid(uut, expectedGrid, expectedLivingCells, expectedNeighboursCount);
  });

  
  it("set grid states row 1", function () {
    var uut = new Grid(3,3);

    uut.setState(1,2,true);

    var expectedGrid = [[false, false, false],
                       [false, false, true],
                       [false, false, false]];

    var expectedLivingCells = [[1,2]];

    var expectedNeighboursCount = [1,1,1,
                                   1,1,0,
                                   1,1,1];

    verifyGrid(uut, expectedGrid, expectedLivingCells, expectedNeighboursCount);
  });

  
  it("set grid multi states", function () {
      var uut = new Grid(3,3);
      
      uut.setState(2,2,true);
      uut.setState(0,1,true);
      uut.setState(1,2,true);
      uut.setState(0,0,true);

      var expectedGrid = [[true, true, false],
                         [false, false, true],
                         [false, false, true]];

      var expectedLivingCells = [[0,0],[0,1],[1,2],[2,2]];

      var expectedNeighboursCount = [3,3,4,
                                     4,4,3,
                                     4,4,3];

      verifyGrid(uut, expectedGrid, expectedLivingCells, expectedNeighboursCount);

      // change state
      uut.setState(2,2,false);
      uut.setState(0,2,true);

      expectedGrid =  [[true, true, true],
                      [false, false, true],
                      [false, false, false]];

      var expectedLivingCells = [[0,0],[0,1],[0,2],[1,2]];

      var expectedNeighboursCount = [3,3,3,
                                     4,4,3,
                                     4,4,4];

      verifyGrid(uut, expectedGrid, expectedLivingCells, expectedNeighboursCount);    

      var result = uut.killLivingCells();

      assert.equal(JSON.stringify(expectedLivingCells), JSON.stringify(result), "Killed should be all living ones");
      assert.equal(0, uut.getLivingCells().length, "Expected number of living cells is zero");
  });
  
});

