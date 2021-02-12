$(document).ready(function () {
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

    // Build page content.
    $('body').append($('<div>').addClass('wrapper')
    	.append($('<center>')
    	.append(generateSudokuGrid())));

    // Populate grids with data.
    $('table[class^="sudoku"]').each(function (index, grid) {
    	populateGrid($(grid), data);
    });
});

	function populateGrid(grid, data) {
		grid.find('td').each(function (index, td) {
			$(td).text(data[index] || '');
		});
	}

	/* First Method */
	function generateSudokuGrid(data) {
		return $('<table>').append(multiPush(3, function () {
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

	/* Second Method */
	function generateSudokuGrid2(data) {
		return $('<table>').append(multiPush(9, function () {
			return $('<tr>').append(multiPush(9, function () {
				return $('<td>');
			}));
		})).addClass('sudoku2');
	}

	function multiPush(count, func, scope) {
		var arr = [];
		for (var i = 0; i < count; i++) {
			arr.push(func.call(scope, i));
		}
		return arr;
	}