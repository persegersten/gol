import {Grid, Model} from '../model.js';
import { strict as assert } from 'assert';

function verifyModel(result, expectedToLive, expectedToDie) {
  assert.equal(result[0].length, expectedToLive.length, "Length toLive not correct " + result[0].length + " != " + expectedToLive.length);
  assert.equal(result[1].length, expectedToLive.length, "Length toDie not correct " + result[1].length + " != " + expectedToDie.length);
}


describe('create empty model', function () {
    it("empty model", function () {
        var uut = new Model(3,3);
        
        var res = uut.iterate();
        verifyModel(res, new Array(), new Array());
    });

    it("full model all will die", function () {
      var uut = new Model(3,3);
      uut.click(0,0);
      uut.click(0,1);
      uut.click(0,2);
      uut.click(1,0);
      uut.click(1,2);
      uut.click(2,0);
      uut.click(2,1);
      uut.click(2,2);
      
      var res = uut.iterate();

      assert.equal(res[0].length, 8, "Wrong number of toLive");
      assert.equal(res[1].length, 0, "Wrong number of toDie");

      res = uut.iterate();
      //console.log(JSON.stringify(res));

      assert.equal(res[0].length, 0, "Wrong number of toLive");
      assert.equal(res[1].length, 8, "Wrong number of toDie");
      assert.equal(JSON.stringify(res[1]), JSON.stringify([[0,0], [0,1], [0,2], [1,0], [1,2], [2,0], [2,1], [2,2]]), "Wrong content in list");
  });

  it("full model som will live", function () {
    var uut = new Model(3,3);
    uut.click(1,0);
    uut.click(1,1);
    uut.click(1,2);

 
    var res = uut.iterate();

    assert.equal(res[0].length, 3, "Wrong number of toLive");
    assert.equal(res[1].length, 0, "Wrong number of toDie");

     res = uut.iterate();
    //console.log(JSON.stringify(res));

    assert.equal(res[0].length, 6, "Wrong number of toLive");
    assert.equal(res[1].length, 0, "Wrong number of toDie");
    assert.equal(JSON.stringify(res[0]), JSON.stringify([[0,0], [0,1], [0,2], [2,0], [2,1], [2,2]]), "Wrong content in list");
    
    // Ok, lets finish them all
    res = uut.iterate();
    //console.log(JSON.stringify(res));

    assert.equal(res[0].length, 0, "Wrong number of toLive");
    assert.equal(res[1].length, 9, "Wrong number of toDie");
});

it("wrap clicks outside border", function () {
  var uut = new Model(3,3);
 
  uut.clicks(
    [
     [-10, -10],
     [10, 10],
     [-1, -1],
     [3, 3]
    ]);
  
  var res = uut.iterate();

  console.log(JSON.stringify(res[0]));
  assert.equal(res[0].length, 4, "Wrong number of toLive");
  assert.equal(JSON.stringify(res[0]), JSON.stringify([[2,2], [1,1], [2,2], [0,0]]), "Wrong content in list");
});
    
});




