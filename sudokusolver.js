class SudokuSolver {

    constructor() {
        // the puzzle to solve stored as an array of length 9*9
        this.grid = [];
    }

    //  _____ _____ _____
    // |     |     |     |
    // |     |     |     |
    // |_____|_____|_____|
    // |x x x|x i x|x x x|
    // |     |     |     |
    // |_____|_____|_____|
    // |     |     |     |
    // |     |     |     |
    // |_____|_____|_____|
    getRow(grid,i) {
        var i0 = Math.floor(i/9)*9;
        return grid.slice(i0,i0+9);
    }

    //  _____ _____ _____
    // |     |  x  |     |
    // |     |  x  |     |
    // |_____|__x__|_____|
    // |     |  i  |     |
    // |     |  x  |     |
    // |_____|__x__|_____|
    // |     |  x  |     |
    // |     |  x  |     |
    // |_____|__x__|_____|
    getCol(grid,i) {
        var i0 = i%9;
        var row = [];
        for(var j=0; j<9; j++)
            row.push(grid[i0+9*j]);
        return row;
    }

    //  _____ _____ _____
    // |     |     |     |
    // |     |     |     |
    // |_____|_____|_____|
    // |     |x i x|     |
    // |     |x x x|     |
    // |_____|x_x_x|_____|
    // |     |     |     |
    // |     |     |     |
    // |_____|_____|_____|
    getBlock(grid,i) {
        var i0 = Math.floor((i%9)/3)*3;
        var j0 = Math.floor(Math.floor(i/9)/3)*3;
        var block = [];
        for(var l=0; l<3; l++) {
            for(var m=0; m<3; m++) {
                block.push(grid[i0+l+9*(j0+m)]);
            }
        }
        return block;
    }

    // The guess is valid if the number (n) cannot be found twice in the row, column or block.
    isValidGuess(i,n) {
        return !this.getCol(this.grid,i).includes(n) && !this.getRow(this.grid,i).includes(n) && !this.getBlock(this.grid,i).includes(n);
    }

    // the array grid is modified and the correct solution is stored in it in case the sudoku is solveable
    solveGrid(grid) {
        this.grid = grid;
        this.solveGridRecursion(0);
    }

    solveGridRecursion(i) {
        // return true in case all empty fields are filled and no conflict was detected
        if(i==this.grid.length) {
            return true;
        }
        // ignore the index if the field is not empty (!=0)
        if(this.grid[i]) {
            return this.solveGridRecursion(i+1);
        }
        // loop over all integers in 1,2,3,...,9
        var n = 1;
        while(n < 10) {
            // check if the guess does not cause a conflict in the grid
            if(this.isValidGuess(i,n)) {
                // if it does not cause a conflict, enter the guess and move on to the next index
                this.grid[i] = n;
                if(this.solveGridRecursion(i+1)) {
                    return true;
                }
            }
            n += 1;
        }
        // if this is reached at least one previous guess was wrong. This branch of the recursion is therefore abandoned and the guess is removed.
        this.grid[i] = 0;
        return false;
    }

    checkGrid(grid) {
        var correct = true;
        for (var j = 0; j < 9; j++) {
            var sum1 = 0;
            for (var i = 0; i < 9; i++) {
                sum1 += grid[i];
            }
            var sum2 = 0;
            for (var i = j; i <= j+8*9; i+=9) {
                sum2 += grid[i];
            }
            if(sum1 != 45 || sum2 != 45) {
                correct = false;
            }
        }
        return correct;
    }
}

