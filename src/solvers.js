// Write code here that will find the solution count for a board of any size.
// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)

window.findNRooksSolution = function(n){
  var solved = false;
  // Start with an empty board
  var boardLayout = [];
  var newRow = [];
  for (var i = 0; i < n; i++) {
    newRow.push(0);
  }
  for (var j = 0; j < n; j++) {
    boardLayout[j] = newRow.slice();
  }
  var board = new Board(boardLayout);
  var traverser = function(boardLayout, newRowNumber, rookColumns) {
    rookColumns = rookColumns || [];
    if (!solved) {
      // Unoptimized traverser
      var traverseBoard = new Board(boardLayout);
      // thisRow = array of 0s
      var thisRow = traverseBoard.get(newRowNumber);
      for (var i = 0; i < thisRow.length; i++) {
        if (!_(rookColumns).contains(i)) {
          thisRow[i] = 1;
          traverseBoard.set(newRowNumber,thisRow.slice());
          thisRow[i] = 0;
          if (newRowNumber === thisRow.length-1) {
            if (!traverseBoard.hasAnyRooksConflicts()) {
              board = new Board(traverseBoard.rows());
              solved = true;
            }
          } else {
            rookColumns.push(i);
            traverser(traverseBoard.rows(),newRowNumber+1,rookColumns);
          }
        }
      }
    }
  };
  traverser(board.rows(),0);
  console.log('Single solution for ' + n + ' rooks:', solved);
  console.log(board.rows());
  return board.rows();
};

window.countNRooksSolutions = function(n){
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

window.findNQueensSolution = function(n){
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', solution);
  return solution;
};

window.countNQueensSolutions = function(n){
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};


// This function uses a board visualizer lets you view an interactive version of any piece matrix.

window.displayBoard = function(matrix){
  $('body').html(
    new BoardView({
      model: new Board(matrix)
    }).render()
  );
};
