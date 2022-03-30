import {Grid, Model} from '../model.js';
import { strict as assert } from 'assert';

function verifyGrid(grid, expected) {
  for (var r=0; r<3; r++) {
    for (var c=0; c<3; c++) {
      assert.equal(grid.value(r,c), expected[r][c], "Wrong value at r="+r+" c="+ c);
    }
  }
}

describe('create grid with values', function () {
  it("empty grid", function () {
    var uut = new Grid(3,3);
    var expected = [[false, false, false],
                    [false, false, false],
                    [false, false, false]];

    verifyGrid(uut, expected);

  });

  
  it("set grid states trivial", function () {
    var uut = new Grid(3,3);

    uut.setState(0,0,true);

    var expected = [[true, false, false],
                    [false, false, false],
                    [false, false, false]];

    verifyGrid(uut, expected);
  });

  
  it("set grid states row 1", function () {
    var uut = new Grid(3,3);

    uut.setState(1,2,true);

    var expected = [[false, false, false],
                    [false, false, true],
                    [false, false, false]];

    verifyGrid(uut, expected);
  });

  
  it("set grid multi states", function () {
      var uut = new Grid(3,3);
      
      uut.setState(2,2,true);
      uut.setState(0,1,true);
      uut.setState(1,2,true);
      uut.setState(0,0,true);

      var expected = [[true, true, false],
                      [false, false, true],
                      [false, false, true]];

      verifyGrid(uut, expected);

      // change state
      uut.setState(2,2,false);
      uut.setState(0,2,true);

      expected =      [[true, true, true],
                      [false, false, true],
                      [false, false, false]];

      verifyGrid(uut, expected);
    

  });
  
});

