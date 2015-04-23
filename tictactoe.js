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
        return false;
      }
    });
  };
  this.winMove = function() {
    var ttt = this;
    var done = false;
    var possibilities = ttt.indexGenerator();
    while(!done) {
      var next = possibilities.next();
      if(done = next.done) break;
      var indices = next.value;
      var squares = ttt.comboForIndex(indices);
      var result = ttt.twoCombo(squares, "o");
      if(result) return indices[result];
    }
    return null;
  };
  this.blockMove = function() {
    var ttt = this;
    var done = false;
    var possibilities = ttt.indexGenerator();
    while(!done) {
      var next = possibilities.next();
      if(done = next.done) break;
      var indices = next.value;
      var squares = ttt.comboForIndex(indices);
      var result = ttt.twoCombo(squares, "x");
      if(result) return indices[result];
    }
    return null;
  };
  this.middleMove = function() {
    var ttt = this;
    if(ttt.board[1][1] === null) {
      return [1,1];
    }
    return null;
  };
  this.cornerMove = function() {
    var ttt = this;
    var done = false;
    var possibilities = ttt.cornerGenerator();
    while(!done) {
      var next = possibilities.next();
      if(done = next.done) break;
      var index = next.value;
      var square = ttt.board[index[0]][index[1]];
      if(square === null) return index;
    }

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
    var possibilities = ttt.comboGenerator();
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
  this.twoCombo = function(arr, symbol) {
    var count = 0;
    var different = false;
    $.each(arr, function(i, el) {
      if(el == symbol) {
        count += 1;
      } else {
        different = i;
      }
    });
    if(count == 2) {
      return different;
    }
    return false;
  };
  this.comboGenerator = function*() {
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
  this.indexGenerator = function*() {
    // Rows
    yield [[0,0],[0,1],[0,2]];
    yield [[1,0],[1,1],[1,2]];
    yield [[2,0],[2,1],[2,2]];
    // Columns
    yield [[0,0], [1,0], [2,0]];
    yield [[0,1], [1,1], [2,1]];
    yield [[0,2], [1,2], [2,2]];
    // Diagonals
    yield [[0,0], [1,1], [2,2]];
    yield [[0,2], [1,1], [2,0]];
  };
  this.cornerGenerator = function*() {
    yield [0,0];
    yield [2,0];
    yield [0,2];
    yield [2,2];
  };
  this.comboForIndex = function(arr) {
    return [this.board[arr[0][0]][arr[0][1]], this.board[arr[1][0]][arr[1][1]], this.board[arr[2][0]][arr[2][1]]];
  }

};

$(document).ready(function() {
  var ttt = new TicTacToe();
  ttt.setup();
  $('.restart').click(function() {
    ttt.setup();
  });
});
