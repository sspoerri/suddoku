// --- Global variables -------------------------------------------------------------------- //

var quizzes = [
	[
	    1, 0, 3, 6, 0, 4, 7, 0, 9, // 0x0
	    0, 2, 0, 0, 9, 0, 0, 1, 0, // 0x1
	    7, 0, 0, 0, 0, 0, 0, 0, 6, // 0x2
	    2, 0, 4, 0, 3, 0, 9, 0, 8, // 1x0
	    0, 0, 0, 0, 0, 0, 0, 0, 0, // 1x1
	    5, 0, 0, 9, 0, 7, 0, 0, 1, // 1x2
	    6, 0, 0, 0, 5, 0, 0, 0, 2, // 2x0
	    0, 0, 0, 0, 7, 0, 0, 0, 0, // 2x1
	    9, 0, 0, 8, 0, 2, 0, 0, 5  // 2x2
    ],
    [
	    2, 0, 0, 8, 0, 4, 0, 0, 6, // 0x0
	    0, 0, 6, 0, 0, 0, 5, 0, 0, // 0x1
	    0, 7, 4, 0, 0, 0, 9, 2, 0, // 0x2
	    3, 0, 0, 0, 4, 0, 0, 0, 7, // 1x0
	    0, 0, 0, 3, 0, 5, 0, 0, 0, // 1x1
	    4, 0, 0, 0, 6, 0, 0, 0, 9, // 1x2
	    0, 1, 9, 0, 0, 0, 7, 4, 0, // 2x0
	    0, 0, 8, 0, 0, 0, 2, 0, 0, // 2x1
	    5, 0, 0, 6, 0, 8, 0, 0, 1  // 2x2
	    ]
];

var colors = fillArray('',9*9);
var n = 0; // Quiz id
var data;
var data_work;
var curi = -1;
var curj = -1;

// --- Utility functions for display ------------------------------------------------------- //

function fillArray(value, len) {
	var arr = [];
	for (var i = 0; i < len; i++) {
		arr.push(value);
	}
	return arr;
}

function resetGrid() {
	curi = -1;
	curj = -1;
	colors = fillArray('',9*9);
	data = [...quizzes[n]];
	data_work = [...data];
	document.getElementById('feedback').innerHTML = "";
	redrawGrid();
}

function redrawGrid() {
	$('table[class^="sudoku"]').each(function (index, grid) {
		populateGrid($(grid), data_work);
	});
}

function populateGrid(grid, data) {
	grid.find('td').each(function (index, td) {
		$(td).removeClass();
		$(td).text(data_work[index] || '');
		$(td).addClass(colors[index] || '');
	});
}

function generateSudokuGrid(data) {
	return $('<table>').attr('id', 'sudoku').append(multiPush(3, function () {
		return $('<colgroup>').append(multiPush(3, function () {
			return $('<col>');
		}));
	})).append(multiPush(3, function () {
		return $('<tbody>').append(multiPush(3, function () {
			return $('<tr>').append(multiPush(9, function () {
				return $('<td>');
			}));
		}));
	})).addClass('sudoku');
}

function multiPush(count, func, scope) {
	var arr = [];
	for (var i = 0; i < count; i++) {
		arr.push(func.call(scope, i));
	}
	return arr;
}

// --- Utility functions for solver ------------------------------------------------------- //

function getRow(grid,i) {
	var i0 = Math.floor(i/9)*9;
	return grid.slice(i0,i0+9);
}

function getCol(grid,i) {
	var i0 = i%9;
	var row = [];
	for(var j=0; j<9; j++)
		row.push(grid[i0+9*j]);
	return row;
}

function getBlock(grid,i) {
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

function isValidGuess(grid,i,n) {
	return !getCol(grid,i).includes(n) && !getRow(grid,i).includes(n) && !getBlock(grid,i).includes(n);
}

function solveGridRecursion(i) {
	if(i==data_work.length) {
		return true;
	}
	if(data_work[i]) {
		return solveGridRecursion(i+1);
	}
	var n = 1;
	while(n < 10) {
		if(isValidGuess(data_work,i,n)) {
			//console.log('deeper');
			data_work[i] = n;
			if(solveGridRecursion(i+1)) {
				return true;
			}
		}
		n += 1;
	}
	data_work[i] = 0;
	return false;
}

function checkGrid() {
	var correct = true;
	for (var j = 0; j < 9; j++) {
		var sum1 = 0;
		for (var i = 0; i < 9; i++) {
			sum1 += data_work[i];
		}
		var sum2 = 0;
		for (var i = j; i <= j+8*9; i+=9) {
			sum2 += data_work[i];
		}
		if(sum1 != 45 || sum2 != 45) {
			correct = false;
		}
	}
	return correct;
}

// --- Setup ----------------------------------------------------------------------------- //

$(document).ready(function () {
	$('[data-toggle="popover"]').popover();   
	$('#center').append(generateSudokuGrid());
	data = [...quizzes[n]];
	data_work = [...data];
	redrawGrid();

    //Events
    var sudoku = document.getElementById('sudoku');
    sudoku.onclick = function(evt){
    	var x = evt.pageX - $('#sudoku').offset().left;
    	var y = evt.pageY - $('#sudoku').offset().top;
    	var i = Math.floor( x/40 );
    	var j = Math.floor( y/40 );
    	if(!data[i+9*j] && !(i==curi&&j==curj)) {
    		colors[curi+9*curj] = '';
    		curi = i;
    		curj = j;
    		colors[curi+9*curj] = 'td-selected';
    	} else {
    		colors[curi+9*curj] = '';
    		curi = -1;
    		curj = -1;
    	}
    	redrawGrid();
    };

    var reset = document.getElementById('reset');
    reset.onclick = function(evt){
    	resetGrid();
    };

    var check = document.getElementById('check');
    check.onclick = function(evt){
    	if(checkGrid()) {
    		document.getElementById('feedback').innerHTML = "Your solution is correct!";
    	} else {
    		document.getElementById('feedback').innerHTML = "There is at least one error in the grid.";
    	}
    };

    var solve = document.getElementById('solve');
    solve.onclick = function(evt){
    	solveGridRecursion(0);
    	redrawGrid();
    };

    var quiz1 = document.getElementById('quiz1');
    quiz1.onclick = function(evt){
    	n = 0;
    	resetGrid();
    };

    var quiz2 = document.getElementById('quiz2');
    quiz2.onclick = function(evt){
    	n = 1;
    	resetGrid();
    };

    document.addEventListener('keydown', function(event) {
    	if(event.keyCode >= 48 && event.keyCode <= 57) {
    		if(curi != -1 && curj != -1) {
    			data_work[curi + 9*curj] = event.keyCode - 48;
    			redrawGrid();
    		}
    	};
    });
});