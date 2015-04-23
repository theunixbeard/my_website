function TicTacToe() {
  this.setup = function() {
    this.board = [[null,null,null],
                  [null,null,null],
                  [null,null,null]];
    this.gameOver = false;
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
    var ttt = this;
    var boardUI = $(".board");
    $.each(this.board, function(x, row) {
      $.each(row, function(y, square) {
        ttt.drawSquare(x,y,square);
      });
    });
  };
  this.handleClicks = function() {
    var ttt = this;
    $('.square').each(function() {
      $(this).off('click').click(function() {
        var x = $(this).data("index-x");
        var y = $(this).data("index-y");
        ttt.gameLoop(x,y);
      });
    });
  };
  this.playerMove = function(x,y) {
    var ttt = this;
    if(ttt.canMove(x,y)) {
      ttt.makeMove(x,y,"x");
    } else {
      return;
    }
  }
  this.gameLoop = function(x,y) {
    var ttt = this;
    if(!ttt.gameOver) {
      ttt.playerMove(x,y);
      ttt.checkWin();
      if(ttt.gameOver) return;
      ttt.computerMove();
      ttt.checkWin();
      if(ttt.gameOver) return;
    }
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
    var possibilities = ttt.rowGenerator();
    while(!done) {
      var next = possibilities.next();
      if(done = next.done) break;
      var squares = next.value
      var result = ttt.allSame(squares);
      if(result) {
        alert(result + " WINS !!!");
        ttt.gameOver = true;
        return result;
      }
    }
    return false;
  };
  this.allSame = function(arr) {
    var first = arr[0];
    var same = first;
    $.each(arr, function(i, el) {
      if(!el || el !== first) {
        same = false;
      }
    });
    return same;
  };
  this.rowGenerator = function*() {
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
  ttt.setup();
  $('.restart').click(function() {
    ttt.setup();
  });
});
