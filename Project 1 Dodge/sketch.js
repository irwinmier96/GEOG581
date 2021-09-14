// Dodgeball Snake Edition
// Avoid the moving circles in the game in a set time.
// If you survive within the time given, you win.
// If you collide with a circle before time is up, you lose the game.

// Setup variable to start the game
let mode;

// Empty lists to store variables for positions of line segment (snake)
let emptycoords_x = [];
let emptycoords_y = [];

// Call variables
let x = [],
  y = [],
  segNum = 12,
  segLength = 15; //make a snake

let snake;

for (let i = 0; i < segNum; i++) {
  x[i] = 0;
  y[i] = 0;
}

//First ball
let rad = 20; // Width of the shape
let xpos, ypos, xpos2, ypos2; // Starting position of shape

let xspeed = 3.8; // Speed of the shape
let yspeed = 2.2; // Speed of the shape

let xdirection = 1; // Left or Right
let ydirection = 1; // Top to Bottom

//Second ball
let rad2 = 10; // Width of the shape

let xspeed2 = 4.8; // Speed of the shape
let yspeed2 = 3.2; // Speed of the shape

let xdirection2 = 1.3; // Left or Right
let ydirection2 = 1.5; // Top to Bottom

// Initialize collision variables with a boolean
var hit = false;
var hit2 = false;

// Timer Variable
let timer = 10;


function setup() {
  mode = 0; // initalize the game
  createCanvas(510, 400);
  strokeWeight(9);
  stroke(255, 100);

  frameRate(60);
  ellipseMode(RADIUS);


  // Set the starting position of the first ball
  xpos = random(width/5, width/2);
  ypos = random(height/6, height/4);

  // Set the starting position of the second ball
  xpos2 = width / 3;
  ypos2 = height / 2.5;


}


function draw() {

  clear ();

  background(150);

  if (mode==0) {

    // textSize(14);
    // text("Snake Dodgeball. Avoid the balls for 10 seconds to win. ", 100, 150);
    // textSize(14);
    // text("Press ENTER to play", 100, 300);

    startScreen();

  }

  else if (mode==1) {

      background(120);

      //drag the snake variable around canvas by mouse positions

      var snake = dragSegment(0, mouseX, mouseY);
      for (let i = 0; i < x.length - 1; i++) {
        dragSegment(i + 1 , x[i], y[i]);
      }

      // Update the position of the shape
      xpos = xpos + xspeed * xdirection;
      ypos = ypos + yspeed * ydirection;

      // Update the position of the shape
      xpos2 = xpos2 + xspeed2 * xdirection2;
      ypos2 = ypos2 + yspeed2 * ydirection2;

      // Test to see if the shape exceeds the boundaries of the screen
      // If it does, reverse its direction by multiplying by -1
      if (xpos > width - rad || xpos < rad) {
        xdirection *= -1;
      }
      if (ypos > height - rad || ypos < rad) {
        ydirection *= -1;
      }

      //reverse the direction of the smaller ball
      if (xpos2 > width - rad2 || xpos2 < rad2) {
        xdirection2 *= -1;
      }
      if (ypos2 > height - rad2 || ypos2 < rad2) {
        ydirection2 *= -1;
      }

       // Timer
      textAlign(CENTER, CENTER);
      textSize(80);
      text(timer, width/2, height/7);


      // Draw the shape
      noStroke();
      var circle1 = ellipse(xpos, ypos, rad, rad);
      fill(105,220,100);
      noStroke();
      var circle2 = ellipse(xpos2, ypos2, rad2, rad2);


      //call the function with the line and circles in the game
      checkCollision(snake, circle1, circle2, emptycoords_x, emptycoords_y);


      WinLose(); //call the function for the timer countdown

  }


}


//Beginning screen of the game
function startScreen(){
		background(196, 107, 255)
		fill(255)
		textAlign(CENTER);
        textSize(20);
		text('SNAKE DODGEBALL: Avoid the balls to win!', width / 2, height / 2)
		text('click to start', width / 2, height / 2 + 20);

}


// Changes the mode of the game if you click on the screen
function mousePressed(){
	if(mode==0){
  	  mode=1;
    }
}


// Create circular movement using trig functions
function dragSegment(i, xin, yin) {
  const dx = xin - x[i];
  const dy = yin - y[i];
  const angle = atan2(dy, dx);
  x[i] = xin - cos(angle) * segLength;
  y[i] = yin - sin(angle) * segLength;
  segment(x[i], y[i], angle);
}


// Connects new line segments together
// need a push and pop function so the line segments only connect together
function segment(x, y, a) {
  push();
  translate(x, y);
  rotate(a);
  line(0, 0, segLength, 0);  // length of line segments
  emptycoords_x.push(x)
  emptycoords_y.push(y)
  pop();
}


// Check to see if line and circles collide using p5 libraries methods
function checkCollision(line1, cir1, cir2, xi, yi){

  for (var i = 0; i < emptycoords_x.length; i += 1) {
    for (var i = 0; i < emptycoords_y.length; i += 1) {
      hit = collideLineCircle(mouseX, mouseY, emptycoords_x[i], emptycoords_y[i], xpos, ypos, rad);
      hit2 = collideLineCircle(mouseX, mouseY, emptycoords_x[i], emptycoords_y[i], xpos2, ypos2, rad2);
    }
  }

  stroke(hit ? color('red') : 0);

  print('colliding?', hit, hit2); //console log returns boolean variable

  ifIntersects(); //calling a function to stop a loop if intersects

}


// The game stops if the line collides with any of the circles, and the hit and hit2 variables return true
function ifIntersects(){
  if ((hit==true) || (hit2==true)){
    noLoop();
  }
}


// Countdown the seconds, and add conditions for collisions and time within the scope of this game
function WinLose() {
  if (frameCount % 60 == 0 && timer >= 0) {
    // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timer --;
  }
  if ((timer == 0) && (hit == false) && (hit2 == false)){
    text("GAME OVER", width/2, height/3);
    text("YOU WON", width/2, height/2);
    noLoop();
    //print('X Points: ', emptycoords_x)
    //print('Y Points: ', emptycoords_y)
  }
  // If line segment hasnt collided with the circles once the timer reaches zero, the game ends and the player wins, the loop stops

  else if ((timer != 0) && (hit == true)) {
    text("GAME OVER", width/2, height/3);
    text("YOU LOST", width/2, height/2);
    //print('X Points: ', emptycoords_x)
    //print('Y Points: ', emptycoords_y)
  // If line segment collides with the big circle before time runs out, the loop stops and the player loses

  } else if ((timer != 0) && (hit2 == true)) {
    text("GAME OVER", width/2, height/3);
    text("YOU LOST", width/2, height/2);
    //print('X Points: ', emptycoords_x)
    //print('Y Points: ', emptycoords_y)
  }
  // If line segment collides with the smaller circle before time runs out, the loop stops and the player loses

}

// More Ideas:
// https://creative-coding.decontextualize.com/making-games-with-p5-play/
