function TicTacToe() {
  this.board = [[null,null,null],
                [null,null,null],
                [null,null,null]];
  this.initBoard = function() {
    this.drawBoard();
    this.handleClicks();
  };
  this.drawSquare = function(x, y, symbol) {
    if(symbol === null) symbol = "blank";
    var squareSelector = "[data-index-x='"+ x + "'][data-index-y='"+ y + "']";
    var square = $(squareSelector);
    square.removeClass("blank");
    square.removeClass("x");
    square.removeClass("o");
    square.addClass(symbol);
  };
  this.drawBoard = function() {
    var boardUI = $(".board");
    var ttt = this;
    $.each(this.board, function(x, row) {
      $.each(row, function(y, square) {
        ttt.drawSquare(x,y,square);
      });
    });
  };
  this.handleClicks = function() {
    var ttt = this;
    $('.square').each(function() {
      $(this).click(function() {
        var x = $(this).data("index-x");
        var y = $(this).data("index-y");
        if(ttt.canMove(x,y)) {
          ttt.makeMove(x,y,"x");
        }
        ttt.computerMove();
      });
    });
  };
  this.makeMove = function(x,y,symbol) {
    this.board[x][y] = symbol;
    this.drawBoard();
  };
  this.canMove = function(x,y) {
    if(this.board[x] && this.board[x][y] === null) {
      return true;
    }
    return false;
  };
  this.computerMove = function() {
    var ttt = this;
    var moves = ["win", "block", "middle", "corner", "random"]
    $.each(moves, function(index, move) {
      var coords = ttt[move + "Move"]();
      if(coords) {
        ttt.makeMove(coords[0], coords[1], "o");
        return;
      }
    });
  };
  this.winMove = function() {
    // Iterate over all squares, check if we can win on next move
    return null;
  };
  this.blockMove = function() {
    // Iterate over all squares, check if we can block on next move
    return null;
  };
  this.middleMove = function() {
    return null;
  };
  this.cornerMove = function() {
    return null;
  };
  this.randomMove = function() {
    var counter = 0;
    while(true) {
      counter += 1;
      x = Math.floor(Math.random() * 3);
      y = Math.floor(Math.random() * 3);
      if(this.canMove(x,y)) return [x,y];
      if(counter === 10000) return null;
    }
  };
  this.checkWin = function() {
    var ttt = this;
    var done = false;
    while(!done) {
      next = ttt.winGenerator.next();
      done = next.done;
      if(allSame(next)) {
        return allSame(next);
      }
    }
    return false;
  };
  this.allSame(arr) {
    var first = arr[0];
    $.each(arr, function(i, el) {
      if(el !== first) {
        return false;
      }
    });
    return first;
  };
  this.winGenerator = function*() {
    // Rows
    yield this.board[0];
    yield this.board[1];
    yield this.board[2];
    // Columns
    yield [this.board[0][0], this.board[1][0], this.board[2][0]];
    yield [this.board[0][1], this.board[1][1], this.board[2][1]];
    yield [this.board[0][2], this.board[1][2], this.board[2][2]];
    // Diagonals
    yield [this.board[0][0], this.board[1][1], this.board[2][2]];
    yield [this.board[0][2], this.board[1][1], this.board[2][0]];
  };
};

$(document).ready(function() {
  var ttt = new TicTacToe();
  ttt.initBoard();
});
