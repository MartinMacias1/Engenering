<script>
  var canvas, ctx, gameControl, gameActive;
  // render X times per second
  var x = 8;
 
  const CANVAS_BORDER_COLOUR = 'black';
  const CANVAS_BACKGROUND_COLOUR = "white";
  const SNAKE_COLOUR = 'lightgreen';
  const SNAKE_BORDER_COLOUR = 'darkgreen';


  window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    document.addEventListener("keydown", keyDownEvent);

    gameControl = startGame(x);
  };
 
  /* function to start the game */
  function startGame(x) {
      // setting gameActive flag to true
      gameActive = true;
      document.getElementById("game-status").innerHTML = "<small>Game Started</small>";
      document.getElementById("game-score").innerHTML = "";
      return setInterval(draw, 1000 / x);
  }
 
  function pauseGame() {
      // setting gameActive flag to false
      clearInterval(gameControl);
      gameActive = false;
      document.getElementById("game-status").innerHTML = "<small>Game Paused</small>";
  }
 
  function endGame(x) {
      // setting gameActive flag to false
      clearInterval(gameControl);
      gameActive = false;
      document.getElementById("game-status").innerHTML = "<small>Game Over</small>";
      document.getElementById("game-score").innerHTML = "<h1>Score: " + x + "</h1>";
  }

  // game world
  var gridSize = (tileSize = 20); // 20 x 20 = 400
  var nextX = (nextY = 0);

  // snake
  var defaultTailSize = 3;
  var tailSize = defaultTailSize;
  var snakeTrail = [];
  var snakeX = (snakeY = 10);

  // apple
  var appleX = (appleY = 15);

  // draw
  function draw() {
    // move snake in next pos
    snakeX += nextX;
    snakeY += nextY;

    // snake over game world?
    if (snakeX < 0) {
      snakeX = gridSize - 1;
    }
    if (snakeX > gridSize - 1) {
      snakeX = 0;
    }

    if (snakeY < 0) {
      snakeY = gridSize - 1;
    }
    if (snakeY > gridSize - 1) {
      snakeY = 0;
    }

    //snake bite apple?
    if (snakeX == appleX && snakeY == appleY) {
      tailSize++;

      appleX = Math.floor(Math.random() * gridSize);
      appleY = Math.floor(Math.random() * gridSize);
    }

    //  Select the colour to fill the canvas
  ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
  //  Select the colour for the border of the canvas
  ctx.strokestyle = CANVAS_BORDER_COLOUR;

  // Draw a "filled" rectangle to cover the entire canvas
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Draw a "border" around the entire canvas
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // paint snake
    ctx.fillStyle = SNAKE_COLOUR;
    ctx.strokestyle = SNAKE_BORDER_COLOUR;
    for (var i = 0; i < snakeTrail.length; i++) {
      ctx.fillRect(
        snakeTrail[i].x * tileSize,
        snakeTrail[i].y * tileSize,
        tileSize,
        tileSize
      );
     
      ctx.strokeRect(snakeTrail[i].x * tileSize , snakeTrail[i].y* tileSize, tileSize, tileSize);

      //snake bites it's tail?
      if (snakeTrail[i].x == snakeX && snakeTrail[i].y == snakeY) {
        if(tailSize > 3) {
            endGame(tailSize);
        }
        tailSize = defaultTailSize;
      }
    }

    // paint apple
    ctx.fillStyle = "red";
    ctx.fillRect(appleX * tileSize, appleY * tileSize, tileSize, tileSize);

    //set snake trail
    snakeTrail.push({ x: snakeX, y: snakeY });
    while (snakeTrail.length > tailSize) {
      snakeTrail.shift();
    }
  }

  // input
  function keyDownEvent(e) {
    switch (e.keyCode) {
      case 37:
        nextX = -1;
        nextY = 0;
        break;
      case 38:
        nextX = 0;
        nextY = -1;
        break;
      case 39:
        nextX = 1;
        nextY = 0;
        break;
      case 40:
        nextX = 0;
        nextY = 1;
        break;
      case 32:
        if(gameActive == true) {
            pauseGame();
        }
        else {
            gameControl = startGame(x);
        }
        break;
    }
  }
</script>
`
@RamiCarmy-eng
RamiCarmy-eng commented on Sep 23, 2020 • 
i add some features like pausing the game and using localStorage to save the score
and also slowing little bit the snake .

<!DOCTYPE html>
<html>
<head>
  <title>Snake Game</title>
  <script src="https://code.jquery.com/jquery-1.11.3.js"></script>
  <style>
  html, body {
    height: 100%;
    margin: 0;
  }
  body {
    background: black;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  canvas {
    border: 1px solid white; background-color:gold;
  }
  #p1
  {
    color:red;
	position:absolute;
	left:100px;
	top:10px;
  }
    #p2
  {
    color:red;
	position:absolute;
	left:100px;
	top:30px;
  }
  #score
  {
    color:yellow;
    position:absolute;
	left:155px;
	top:10px;
  }
  #high
  {
    color:yellow;
    position:absolute;
	  left:195px;
	  top:30px;
  }
  #btn_stop
  {
    color:brown;
    position:absolute;
	  left:100px;
	  top:80px;
  }
  #end_msg
  {
    color:brown;
    position:absolute;
	  left:100px;
	  top:100px;
  }
  </style>
</head>
<body>
<p id="p1">SCORE:</p>
<p id="p2">HIGHSCORE:</p>
<p id="score"></p>
<p id="high"></p>
<button id="btn_stop" >Stop Snake Game</button>
<p id="end_msg"></p>
<canvas width="400" height="400" id="game"></canvas>
<script>
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 16;
var count = 0;
var score=0;
//reading  last score value 
if(localStorage.score){
  document.getElementById('score').innerHTML=localStorage.score; 
}

var max=0;  

var snake = {
  x: 160,
  y: 160,
  
  // snake velocity. moves one grid length every frame in either the x or y direction
  dx: grid,
  dy: 0,
  
  // keep track of all grids the snake body occupies
  cells: [],
  
  // length of the snake. grows when eating an apple
  maxCells: 4
};
var apple = {
  x: 320,
  y: 320
};

// get random whole numbers in a specific range
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// game loop
function loop() {
  
  requestAnimationFrame(loop);
  // slow game loop to 15 fps instead of 60 (60/15 = 4)
  if (++count < 10) {
    return;
  }
  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);
  // move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;
  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  
  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});
  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  // draw apple
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);
  // draw snake one cell at a time
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    
    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid-1, grid-1);  
    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
	  score+=1;
    //saving score for next playing.
    localStorage.setItem('score',score);
	  //max=score;
	  document.getElementById('score').innerHTML=score;
	
      // canvas is 400x400 which is 25x25 grids 
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }
    // check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++)
	{
      
      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) 
	 { 
	 
	    if(score>max)
	    {
	     max=score;
	    }
    	snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
		//score=0;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
	    document.getElementById('high').innerHTML=max;
      }
    }
  }  
  );  
}
// listen to keyboard events to move the snake
document.addEventListener('keydown', function(e) {
  // prevent snake from backtracking on itself by checking that it's 
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)
  
  // left arrow key
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up arrow key
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});
// start the game
requestAnimationFrame(loop);




function myFunction() {
  document.getElementById('end_msg').innerHTML="";
  alert('Press confirm to continue');
}

//stop playing
$(document).ready(function(){
		$('#btn_stop').click(function(){
      document.getElementById('end_msg').innerHTML="Game stoped by player" ;
      setTimeout(myFunction, 1000);	
		});
	});

</script>
</body>
</html>