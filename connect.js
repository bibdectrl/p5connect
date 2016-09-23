const EMPTY = 0;
const RED = 1;
const BLACK = 2;

var board;
var canvas;
var turn;
var mouseDown;
var resetButton;
var gameOver;
var tieGame;
var winner; 
var player;
var ai;

function Board(){
  this.grid = [];
  for (var x = 0; x < 7; x++){
    this.grid[x] = [];
    for (var y = 0; y < 6; y++){
      this.grid[x][y] = EMPTY;
    }
  }
  this.drop = function(colour, column){
    if (column < 0 || column > 6) return false;	  
    if (this.grid[column][0] != EMPTY) return false;
    this.grid[column][0] = colour;
    return true;
  };
  this.checkTie = function(){
    for (var x = 0; x < 7; x++){
      if (this.grid[x][0] == EMPTY){
        return false;
      }
    }
    gameOver = true;
    tieGame = true;
    return true;
  }
  this.applyGravity = function(){
    for (var x = 0; x < 7; x++){
      for (var y = 0; y < 5; y++){
        if (this.grid[x][y] != EMPTY && this.grid[x][y+1] == EMPTY){
          var t = this.grid[x][y];
	  this.grid[x][y] = EMPTY;
	  this.grid[x][y+1] = t;
	  return true;
	}
      }
    }
    return false;
  };
  this.checkWin = function(){
    for (var x = 0; x < 7; x++){
      for (var y = 0; y < 6; y++){
        if (this.grid[x][y] != EMPTY){
          if (x < 4){
            if (this.grid[x][y] == this.grid[x+1][y] && this.grid[x+1][y] == this.grid[x+2][y] && this.grid[x+2][y] == this.grid[x+3][y]) {
		    gameOver = true;
                    winner = this.grid[x][y];
		    return;
	    }
	  }
	  if (y < 3){
            if (this.grid[x][y] == this.grid[x][y+1] && this.grid[x][y+1] == this.grid[x][y+2] && this.grid[x][y+2] == this.grid[x][y+3]) {
		    gameOver = true; 
                    winner = this.grid[x][y];
		    return;
	    }
	  }
	  if (y < 3 && x < 4){
            if (this.grid[x][y] == this.grid[x+1][y+1] && this.grid[x+1][y+1] == this.grid[x+2][y+2] && this.grid[x+2][y+2] == this.grid[x+3][y+3]) {
                    gameOver = true;
		    winner = this.grid[x][y];
		    return;

	    }
	  }

	  if (x < 4 && y > 2){ // this one is off?
            if (this.grid[x][y] == this.grid[x+1][y-1] && this.grid[x+1][y-1] == this.grid[x+2][y-2] && this.grid[x+2][y-2] == this.grid[x+3][y-3]){
                    gameOver = true;
		    winner = this.grid[x][y];
		    return;
            }
	  } 
	}
      }
    }

  };
  this.draw = function(){
    noStroke();	  
    ellipseMode(CENTER);	  
    fill(0, 0, 255);	  
    rect(50, 100, 700, 600);
    for (var x = 0; x < 7; x++){
      for (var y = 0; y < 6; y++){
        switch(this.grid[x][y]){
          case EMPTY:
		fill(255);
	        break;	
          case RED:
                fill(250, 0, 0);
                break;
          case BLACK:
                fill(0);
                break;		
	}		
	ellipse(100 + x*100, 150 + y*100, 90, 90);
      }
    }
  }
}
function Player(){
  this.move = function(){
    if (mouseIsPressed && mouseX > 0 && mouseX < 750 && mouseY < 700 && mouseY > 100 && ! mouseDown){
        mouseDown = true;
        var column = Math.floor((mouseX - 50) / 100);
        if (board.drop(turn, column)){
          while(board.applyGravity());		
          turn = BLACK;
        }
    }
      else if (! mouseIsPressed){
        mouseDown = false;
      }
      if (mouseX > 100 && mouseX < 750){
        var column = Math.floor((mouseX - 50) / 100); 
        if (turn == RED){
          fill(255, 0, 0);
        } else {
          fill(0);   
        }
        ellipse(100 + column*100, 50, 90, 90);
      }
    };
}

function Ai(board){
  this.board = board;
  this.score = function(grid){
    for (var x = 0; x < 7; x++){
      for (var y = 0; y < 6; y++){
        if (grid[x][y] != EMPTY){
          if (x < 4){
            if (grid[x][y] == grid[x+1][y] && grid[x+1][y] == grid[x+2][y] && grid[x+2][y] == grid[x+3][y]) {
               return (grid[x][y] == RED) ? -1000 : 1000;
	    }
	  }
	  if (y < 3){
            if (grid[x][y] == grid[x][y+1] && grid[x][y+1] == grid[x][y+2] && grid[x][y+2] == grid[x][y+3]) {
                return (grid[x][y] == RED) ? -1000 : 1000;
	    }
	  }
	  if (y < 3 && x < 4){
            if (grid[x][y] == grid[x+1][y+1] && grid[x+1][y+1] == grid[x+2][y+2] && grid[x+2][y+2] == grid[x+3][y+3]) {
                return (grid[x][y] == RED) ? -1000 : 1000;
	    }
	  }

	  if (x < 4 && y > 2){
            if (grid[x][y] == grid[x+1][y-1] && grid[x+1][y-1] == grid[x+2][y-2] && grid[x+2][y-2] == grid[x+3][y-3]){
                return (grid[x][y] == RED) ? -1000 : 1000;
	    }
	  } 
	}
      }
    }
    return 0;
  };
  this.findBottom = function(grid, col){
    for (var y = 5; y >= 0; y--){
	if (grid[y][col] == EMPTY){
          return y;
	}
				}
    return undefined;
  };
  this.move = function(){
    var scores = {0 : undefined, 1 : undefined, 2 : undefined, 3 : undefined, 4 : undefined, 5 : undefined, 6 : undefined};	  
    for (var col = 0; col < 7; col++){
     var bot = this.findBottom(this.board.grid, col);	    
     if (bot != undefined){	    
      console.log(bot);
     }
    }
   var maxScoreCol = 0;  
   board.drop(BLACK, maxScoreCol);
   while (board.applyGravity());
   turn = RED;
  }; 
}

function reset(){
  board = new Board();
  ai = new Ai(board);
  gameOver = false;
  tieGame = false;
  winner = undefined;
}

function setup(){
  //turn = Math.random() < 0.5 ? RED : BLACK;
  turn = RED;
  mouseDown = false;
  canvas = createCanvas(800, 800).parent("canvasHere");
  board = new Board();
  player = new Player();
  ai = new Ai(board);
  resetButton = createButton("reset").parent("reset").mousePressed(reset);
  gameOver = false;
  tieGame = false;
  winner = undefined;
}

function draw(){
  clear();	
  board.draw();
  if (! gameOver){
    if (turn == RED){  
         player.move();
	 while(board.applyGravity());
    }
    else {	 
      ai.move();       
      while(board.applyGravity());
      turn = RED;
    }  
    board.checkWin();
    board.checkTie();
  } else {
   if (tieGame){
      fill(0);
      textSize(20);
      text("Tie game", 100, 50);
    } else {
      fill(0);
      textSize(20);
      text(`Winner is ${winner == RED ? "RED" : "BLACK" }`, 100, 50);
    }
  } 
}

