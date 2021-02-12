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

var data_work = [
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

var curi = -1;
var curj = -1;

$(document).ready(function () {
    // Build page content.
    $('body').append($('<div>').addClass('wrapper')
    	.append($('<center>')
    	.append(generateSudokuGrid())));

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
    	}
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

