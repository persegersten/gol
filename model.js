class Grid {
    constructor(prows, pcols) {
        this.rows = prows;
        this.cols = pcols;

       // console.log("create Grid nrows=" + this.rows + " ncols=" + this.cols);
        //console.log("create Grid typeof " + (typeof this.rows) + " " + (typeof this.cols));

        this.cells = new Array(this.rows*this.cols).fill(false);
        //console.log("length " + this.cells.length + " " + rows*cols);
    }

    getIndex(row, column) {
        var index = row*this.cols + column;
        if (index>=this.cells.length) {
            console.log("Context  rows: " + this.rows + " cols: " + this.cols + " Really:" + row*this.cols + column);
            console.log("Index row*this.cols + column " + row*this.cols + " + " + column);
            console.log("Out of bound - length: " + this.cells.length + " row: " + row + " column: " + column + " index: " + index);
            throw new Error("out of bound");
        }
        return index;

    }

    value(row, column) {
        return this.cells[this.getIndex(row, column)];
    }

    setState(row, column, state) {
        this.cells[this.getIndex(row, column)] = state;
    }

    getLivingCells() {
        //console.log('this.cols : ' + this.cols);
        //console.log('this.cols typeof : ' + (typeof this.cols));
        var livingCells = new Array();
        var nofCols = this.cols;
        this.cells.forEach(function (value, index) {
            if (value) {
                //console.log("index/noCols " + index + "/" + nofCols + "=" + Math.floor(index/nofCols));
                //console.log("index%noCols " + index + "/" + nofCols + "=" + index%nofCols);
                livingCells.push([Math.floor(index/nofCols),index%nofCols]);
            }
        })
        return livingCells;
    }

    adjacentCells = [[-1, -1], [-1, 0], [-1, 1],
                    [0, -1],            [0, 1],
                    [1, -1],  [1, 0],   [1, 1]];

    livingNeighboursCount(row, column) {
        var count = 0;

        for (const point of this.adjacentCells) {
            var r = point[0] + row;
            var c = point[1] + column;

            if (r==-1) {
                r = this.rows - 1;
            }
            if (r==this.rows) {
                r = 0;
            }

            if (c==-1) {
                c = this.cols - 1;
            }
            if (c==this.cols) {
                c = 0;
            }

            if (this.value(r, c)) {
                count++;
            }
        }

        //if (count>0) {
        //    console.log("count: " + count);
        //}

        return count;
    }

}

function createModel(rows, cols) {
    return new GridController(rows, cols);
}

// TODO move to own file
class GridController {
    clickedEvents = new Array();
    restoredEvents = new Array();

    constructor(rows, cols) {
        this.grid = new Grid(rows, cols);
    }

    clicks(cordinates) {
        cordinates.forEach(entry => this.click(entry[0], entry[1]));
        //cordinates.forEach(entry => 
        //    console.log("this.click(%s, %s)", entry[0], entry[1])
        //    );
        //this.clickedEvents.push(cordinates);
        //console.log(JSON.stringify(this.clickedEvents));
    }

    click(row, col) {
        this.clickedEvents.push([row, col]);
    }

    adjustCoords(row, col) {
        while (row<0) {
            row+=this.grid.rows;
        }
        while (row>=this.grid.rows) {
            row-=this.grid.rows;
        }
        while (col<0) {
            col+=this.grid.cols;
        }
        while (col>=this.grid.cols) {
            col-=this.grid.cols;
        }
        return [row, col];
    }

    iterateImpl(onlyEvents) {
        //const toLive = Array.from(this.clickedEvents);
        const toLive = this.clickedEvents.map(e => this.adjustCoords(e[0], e[1]));
        const toDie = new Array();
        this.clickedEvents = new Array();

        if (!onlyEvents) {
            // TODO move iteration to model, pass lambda instead
            for (var r=0; r<this.grid.rows; r++) {
                for (var c=0; c<this.grid.cols; c++) {
                    var numberOfLivingNeighbours = this.grid.livingNeighboursCount(r,c);
                    if (this.grid.value(r,c) == true) {
                        if (numberOfLivingNeighbours<2 || numberOfLivingNeighbours>3) {
                            toDie.push([r,c]);
                        }
                    } else {
                        if (numberOfLivingNeighbours == 3) {
                            toLive.push([r,c]);
                        }
                    }
                }
            }

            toDie.forEach(p => this.grid.setState(p[0], p[1], false) );
        }

        toLive.forEach(p => this.grid.setState(p[0], p[1], true) );
        

        return [toLive, toDie];
    }

    iterate() {
        return this.iterateImpl(false);
    }

    iterateEvents() {
        return this.iterateImpl(true);
    }

    getLivingCells() {
        return this.grid.getLivingCells();
    }
}

export { Grid, GridController as Model };

