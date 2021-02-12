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

var n = 0;

var data = [
    1, 0, 3, 6, 0, 4, 7, 0, 9, // 0x0
    0, 2, 0, 0, 9, 0, 0, 1, 0, // 0x1
    7, 0, 0, 0, 0, 0, 0, 0, 6, // 0x2
    2, 0, 4, 0, 3, 0, 9, 0, 8, // 1x0
    0, 0, 0, 0, 0, 0, 0, 0, 0, // 1x1
    5, 0, 0, 9, 0, 7, 0, 0, 1, // 1x2
    6, 0, 0, 0, 5, 0, 0, 0, 2, // 2x0
    0, 0, 0, 0, 7, 0, 0, 0, 0, // 2x1
    9, 0, 0, 8, 0, 2, 0, 0, 5  // 2x2
];

var data_work;

var curi = -1;
var curj = -1;

$(document).ready(function () {
    $('#center').append(generateSudokuGrid());
    data = [...quizzes[n]];
    data_work = [...data];
    redrawGrid();

    var sudoku = document.getElementById('sudoku');
    sudoku.onclick = function(evt){
    	var x = evt.pageX - $('#sudoku').offset().left;
    	var y = evt.pageY - $('#sudoku').offset().top;
    	var i = Math.floor( x/40 );
    	var j = Math.floor( y/40 );
    	if(!data[i+9*j]) {
    		curi = i;
    		curj = j;
    	} else {
    		curi = -1;
    		curj = -1;
    	}
    };

    var reset = document.getElementById('reset');
    reset.onclick = function(evt){
    	n += 1;
    	n %= quizzes.length;
    	data = [...quizzes[n]];
    	data_work = [...data];
    	document.getElementById('feedback').innerHTML = "";
    	redrawGrid();
    };

    var check = document.getElementById('check');
    check.onclick = function(evt){
    	checkGrid();
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

function redrawGrid() {
    $('table[class^="sudoku"]').each(function (index, grid) {
    	populateGrid($(grid), data);
    });
}

function populateGrid(grid, data) {
	grid.find('td').each(function (index, td) {
		$(td).text(data_work[index] || '');
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
	if(correct) {
		document.getElementById('feedback').innerHTML = "Your solution is correct!";
	} else {
		document.getElementById('feedback').innerHTML = "There is at least one error in the grid.";
	}
}