
$(document).ready(function() {
  $('.gameover').hide();

  //List of Variables
  var timer;              //Timer variable
  var pause = false;      //Set pause to false = unpaused
  var restart = false;    //set restart to false = not restart
  var score = 0;          //set starting score to 0
  var foodScore = 1;      //start score at 1
  var speed = 150;        //speed of snake starts at 250 millisconds
  var side = 40;          //The grid is 40x40 squares

  var snake = createSnake();  //create snakes position and coordinates
  var food = generateFood();  //create food position and coordinates
  btnDirection();             // listens for keydown input from user
  settings();                 //settings for restart and pause button
  var grid = createGrid();        //Show the grid
  render();                       //populates index.html with elements
  startGame();                    //used for the click play button

  // Start Game
  function startGame() {
    $('.play').on("click", function() {
      $(".play").fadeOut(600);          //play button will fade out to nothing
      takeTurn();                       //makes snake start moving continuously
    });
  };

  // Initialize/reset parameters
  function initialize() {
    pause = false;            //resets pause parameter
    restart = false;          //resets restart
    score = 0;                //resets score
    foodScore = 1;            //resets food value
    speed = 150;              //reset score
    snake = createSnake();    //reset snake position
    food = generateFood();    //reset food placement
  };

  //Create Grid
  function createGrid() {
    grid = [];                        //empty array
    for (var i = 0; i < side; i++) {  //making i rows
      grid.push([]);                  //append empty array
      for (var j = 0; j < side; j++) { //for each array, append a space
        grid[i].push(" ");             //grid[i] = [ [" ", " ", ...], [" ", " ", ...], ... ]
      }
    }
    grid[food.position[0]][food.position[1]] = "food";  //take food position x,y and update the empty values to "food"
    grid[snake.position[0]][snake.position[1]] = "head";//do same with head
    for (var i = 1; i < snake.coordinates.length; i++) { //start at 1 for body, since 0 is head
      grid[snake.coordinates[i][0]][snake.coordinates[i][1]] = "body"; //for each of set of coordinates up date to "body"
    }
    return grid;  //show grid
  };

  //Create food
  function generateFood() {
    var x = randomNumber();  //generate a random number for x coordinate
    var y = randomNumber();  //generate a random number for y coordinate
    while (foodSnakeClash(x,y)) {  //check if the #s generated clash with the snake
      x = randomNumber();  //if it does, then generate a new one again
      y = randomNumber();  //same
    }
    var food = {
      position: [x,y]  //once good, set the food to the new position
    };
    return food;  //show food
  };

  //Random Number generator
  function randomNumber() {
    number = Math.floor(Math.random() * side);  //returns a value from 0 to length of grid
    return number;
  };

  //Check if food and snake coincide
  function foodSnakeClash(x,y) {
    for (i = 0; i < snake.coordinates.length; i++) {
      if (snake.coordinates[i][0] == x || snake.coordinates[i][1] == y) { //check if any of the coordinates of snake matches food
        return true;
      }
    }
    return false;
  };

  // Create snake
  function createSnake() {
    var center = Math.floor(0.5*side);  //set snake at the center
    var snake = {
      position: [center, center],
      direction: 'r',  //start off snake moving right
      coordinates: [[center,center]] //coordinate is an array of arrays
    }
    return snake;  //show snake
  };

  // Render HTML
  function render() {
    var renderGrid = ""; //empty
    for (var i = 0; i < grid.length; i++) {
      renderGrid += "<ul>";  //create an unordered list (row)
      for (var j = 0; j < grid.length; j++) {  //fill this list with list items (columns)
        if (grid[i][j] == "body") {
          renderGrid += "<li class='square snake-body'></li>";//if body is there, then insert class that represents body
        }
        else if (grid[i][j] == "head") {  //if head is there, then insert class for head (like image of snake)
          renderGrid += "<li class='square snake-body snake-head'><img src='images/snake.jpg'></li>";
        }
        else if (grid[i][j] == "food") {  //same with food
          renderGrid += "<li class='square food'><img src='images/food-rat.svg'></li>";
        }
        else {  //if nothing is there then put its value which is empty from earlier " "
          renderGrid += "<li class='square'>" + grid[i][j] + "</li>";
        }
      }
      renderGrid += "</ul>";  //close ul and move to next row and repeat
    }
    $('.grid').html(renderGrid); //put the rendered grid in class grid
    $('.score').html("Score: " + score);  //show and update score
  };

  render();

  // Player Directional buttons
  function btnDirection() {
    $(document).keydown(function(event) { //event is listening for keydown userinput
      if (!pause) {
        var startDirection = snake.direction;  //set start direction to current snake direction
        var snakeLength = snake.coordinates.length; //grab length of snake (# of coordinates)
        switch(event.which) {  //its typical to use event.which for key down events
          case 37: //left
            if (snakeLength == 1 || startDirection != "r") {  //this all checks to make sure you can move left or right only if snake is 1 cause having a head + body you can no longer move collinear.
              snake.direction = "l";
            }
            break;
          case 38: //up
            if (snakeLength == 1 || startDirection != "d") {
              snake.direction = "u";
            }
            break;
          case 39: //right
            if (snakeLength == 1 || startDirection != "l") {
              snake.direction = "r";
            }
            break;
          case 40: //down
            if (snakeLength == 1 || startDirection != "u") {
              snake.direction = "d";
            }
            break;
          default:
            return;
        }
        event.preventDefault(); //prevents default action from happening
      }
    });
  };

  // Move snake by 1
  function moveSnake(position) {
    snake.position = position; //set new value of position
    snake.coordinates.unshift([snake.position[0], snake.position[1]]); //prepend this to behind snake
    snake.coordinates.pop();  //pop off the new position cause you want it prepended.
  }

  //New head position based on snake Direction
  function newMove() {  //adjust position as snake moves by 1 depending on direction
    switch(snake.direction) {
      case "l":
        return [snake.position[0], snake.position[1] - 1];
        break;
      case "u":
        return [snake.position[0] - 1, snake.position[1]];
        break;
      case "r":
        return [snake.position[0], snake.position[1] + 1];
        break;
      case "d":
        return [snake.position[0] + 1, snake.position[1]];
        break;
      default:
        return [];
    }
  };



  // Check if snake eats food
  function eatFood() { //boolean to check if food and snake coordinate are equal = true
    return (snake.position[0] === food.position[0] &&
            snake.position[1] === food.position[1])
  }

  // Result of eating food
  function eatFoodSettings() {
    score += foodScore;  //continously add score up
    foodScore += 1;   //continously increase score value for each new food
    food = generateFood(); //generate new food location
    growSnake();  //increase snake size
    if (speed > 5) {
      speed -= 8; //keep making speed faster as you eat more
    }
  };

  // Increase snake size
  function growSnake() {
    switch(snake.direction) {
      case "l":
        snake.position[1] -= 1;
        break;
      case "u":
        snake.position[0] -= 1;
        break;
      case "r":
        snake.position[1] += 1;
        break;
      case "d":
        snake.position[0] += 1;
        break;
      default:
        return;
    }
    snake.coordinates.unshift([snake.position[0], snake.position[1]]); //prepend addtional body
  };


  // Check for game over
  function gameOver(position) {  //if snake position is equal to wall or itself, return true for gaemover
    return snakeWall(position) || snakeSelf(position);
  };

  // Check for snake hitting wall
  function snakeWall(position) {
    if (position[0] < 0 || position[0] >= side ||
        position[1] < 0 || position[1] >= side) {
          return true;
        } //return true if snake position meets wall
  };

  //Check if the snake runs into itself
  function snakeSelf(position) {
    for (var i = 1; i < snake.coordinates.length; i++) {
      if (position[0] === snake.coordinates[i][0] &&
          position[1] === snake.coordinates[i][1]) {
            return true;  //return true if snake position same as a position of body
          }
    }
    return false;
  };

  // Turns
  function takeTurn() {
    timer = setTimeout(function() { //evaluate expression based on time
      if (restart) {
        initialize();  //if restart is true, then call initialize to reset all parameters
      }
      else if (!restart && !pause) { //if neither button is pressed then continue
        if (eatFood()) {  //if you eat food, then update food setting parameters
          eatFoodSettings();
        }
        var newPosition = newMove();  //grave a new position as snake moves
        if (gameOver(newPosition)) { //check is it game over from the new position
          gameOverMessage();  //if true then show gameover message
          retry();  //show retry button
          return;
        }
        moveSnake(newPosition);  //move snake to the new position
        grid = createGrid(); //update grid
        render();//show new grid
      }
      takeTurn(); //repeat over and over again until gameover
    }, speed); //speed of how fast this function runs (snake moves)
  };

  // Show game over screen
  function gameOverMessage() {
    $('.final').html(score); //target class final and show score
    $('.gameover').fadeIn(600);  //when its gameover show the gameover message slowly faded in
  };

  // Pause reset Variables
  function settings() {
    $(document).keydown(function(event) {
      switch(event.which) {
        case 80:  //letter P code key
          pause = !pause;
          break;
        case 82:  //letter R code key
          restart = true;
          break;
        default:
          return;
      }
      event.preventDefault();
    })
  };

  // Play again function
  function retry() {
    $('.retry').on("click", function() { //retry button
      $('.gameover').fadeOut(600);  ///when you click it, the gameover class fades way
      restart = true;  //restart is set to true
      clearTimeout(timer); //stops the timer from running
      takeTurn(); //starts the timer to run again.
    })
  };
});
