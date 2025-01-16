let robots = [];
let arrows = [];
let arrowImages = {};

function preload() {
  arrowImages['up'] = loadImage('images/arrow_up.png');
  arrowImages['down'] = loadImage('images/arrow_down.png');
  arrowImages['left'] = loadImage('images/arrow_left.png');
  arrowImages['right'] = loadImage('images/arrow_right.png');
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('game-container'); 

  let columns = 7;  
  let rows = 7;

  for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
          let xPosition = map(col, 0, columns - 1, 50, width - 50);
          let yPosition = map(row, 0, rows - 1, 50, height - 50);
          arrows.push(new Arrow(xPosition, yPosition));
      }
  }
}



function draw() {
    background(220);
  

    if (frameCount % 100 === 0) {
      robots.push(new Robot(0, random(height), 'right'));
    }
  

    for (let i = 0; i < arrows.length; i++) {
      arrows[i].display();
    }
  
    for (let i = robots.length - 1; i >= 0; i--) {
      let robot = robots[i];

      robot.move();
      robot.display();
  

      if (
        robot.x < -robot.bodySize || robot.x > width + robot.bodySize || robot.y < -robot.bodySize || robot.y > height + robot.bodySize 
      ) {
        robots.splice(i, 1);
      }
    }
  }
  

function mousePressed() {
  // console.log('Mouse pressed');
  for (let arrow of arrows) {
    arrow.checkClick();
  }
}