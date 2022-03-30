class Grid {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;

        console.log("create Grid " + rows + " " + cols);

        this.cells = new Array(rows*cols).fill(false);
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
        //console.log(this.cell);
    }

    // TODO skriv test
    getLivingCells() {
        var livingCells = new Array();
        this.grid.cells.forEach(function (value, indx) {
            if (value) {
                livingCells.push([Math.round(r/this.grid),c%this.grid]);
            }
        })
        return livingCells;
    }

}

function createModel(rows, cols) {
    return new Model(rows, cols);
}

// TODO move to own file
class Model {
    constructor(rows, cols) {
        this.grid = new Grid(rows, cols);
    }

    click(row, col) {
        this.grid.setState(row, col, true);
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
                r = this.grid.rows - 1;
            }
            if (r==this.grid.rows) {
                r = 0;
            }

            if (c==-1) {
                c = this.grid.cols - 1;
            }
            if (c==this.grid.cols) {
                c = 0;
            }

            if (this.grid.value(r, c)) {
                count++;
            }
        }

        //if (count>0) {
        //    console.log("count: " + count);
        //}

        return count;
    }

    // TODO need to handle thread safety with click-method???
    iterate() {
        var toLive = new Array();
        var toDie = new Array();

        for (var r=0; r<this.grid.rows; r++) {
            for (var c=0; c<this.grid.cols; c++) {
                var numberOfLivingNeighbours = this.livingNeighboursCount(r,c);
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

        toLive.forEach(p => this.grid.setState(p[0], p[1], true) );
        toDie.forEach(p => this.grid.setState(p[0], p[1], false) );

        return [toLive, toDie];
    }

    getLivingCells() {
        return this.grid.getLivingCells();
    }
}

export { Grid, Model };

