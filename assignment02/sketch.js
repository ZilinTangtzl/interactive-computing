// paddle
let paddleXPosition = 250; 
let paddleYPosition = 480; 

// ball
let ballXPosition = 250; 
let ballYPosition = 250; 
let ballSpeedX = 0;
let ballSpeedY = 0;

let ballDiameter = 50;
let ballRadius = ballDiameter / 2;

// ball color
let colorGradient = 0;
let colorDirection = 1;

let gameStarted = false;

// treasure
let treasureImg;
let treasure1Position;
let treasure2Position;

// sound
let soundBounce;
let soundCollect;
let soundLoss;

// background and foreground
let backgroundImg;
let foregroundImg;
let backgroundYPosition = 0; 
let foregroundYPosition = 0;  
let score = 0;

function preload() {
    treasureImg = loadImage('images/treasure.png');
    soundBounce = loadSound('sounds/boing.mp3');
    soundCollect = loadSound('sounds/collect.mp3');
    soundLoss = loadSound('sounds/loss.mp3');
    backgroundImg = loadImage('images/background.png');
    foregroundImg = loadImage('images/foreground.png');
}

function setup() {
    createCanvas(500, 500);
    background(0);
    resetTreasure1();
    resetTreasure2();
}

function draw() {
    background(0);

    drawBackground();

    drawBorders();

    drawTreasure();

    drawScore();

    drawForeground();

    // paddle
    fill(128);
    rect(paddleXPosition, paddleYPosition, 100, 20);

    if (keyIsDown(65)) { 
        paddleXPosition -= 8;
    }
    if (keyIsDown(68)) { 
        paddleXPosition += 8;
    }

    paddleXPosition = constrain(paddleXPosition, 0, 400); 

    // ball movement
    ballXPosition += ballSpeedX;
    ballYPosition += ballSpeedY;


    // ball color changes
    colorGradient += colorDirection * 0.003;
    if (colorGradient >= 1) {
        colorGradient = 1;
        colorDirection = -1;
    } else if (colorGradient <= 0) {
        colorGradient = 0;
        colorDirection = 1;
    }

    let ballColor = lerpColor(color(255, 0, 0), color(0, 255, 255), colorGradient);
    fill(ballColor);
    ellipse(ballXPosition, ballYPosition, ballDiameter, ballDiameter);

    // check border
    if (ballXPosition + ballRadius > width - 10 || ballXPosition - ballRadius < 10) {
        ballSpeedX *= -1;
        ballSpeedX *= 1.05;
        soundBounce.play();
    }
    if (ballYPosition - ballRadius < 10) {
        ballSpeedY *= -1;
        ballSpeedX *= 1.05;
        soundBounce.play();
    }
    if (ballYPosition > height) {
        restartGame();
        soundLoss.play();
    }

    // check paddle
    // if (ballYPosition > paddleYPosition - ballRadius && ballXPosition > paddleXPosition && ballXPosition < paddleXPosition + 100) {
    //     let hitPlace = ballXPosition - (paddleXPosition + 50);
    //     ballSpeedX += hitPlace * 0.05;
    //     ballSpeedY *= -1;
    //     ballSpeedX *= 1.05;
    //     soundBounce.play();
    // }

    if (ballYPosition > paddleYPosition - ballRadius && ballXPosition > paddleXPosition && ballXPosition < paddleXPosition + 100) {
        let hitPlace = ballXPosition - (paddleXPosition + 50);
        
        ballSpeedX = map(hitPlace, -50, 50, -3, 3);  
        ballSpeedY *= -1; 
        ballSpeedX *= 1.05; 
        soundBounce.play();
    }

}

function drawBackground() {
    image(backgroundImg, 0, backgroundYPosition, width, height);
    image(backgroundImg, 0, backgroundYPosition - height, width, height);

    backgroundYPosition += 1;
    if (backgroundYPosition >= height) {
        backgroundYPosition = 0;
    }
}

function drawForeground() {
    image(foregroundImg, 0, foregroundYPosition, width, height);
    image(foregroundImg, 0, foregroundYPosition - height, width, height);

    foregroundYPosition += 2;
    if (foregroundYPosition >= height) {
        foregroundYPosition = 0;
    }
}

function drawBorders() {
    fill(225);
    rect(0, 0, width, 10);
    rect(0, 0, 10, height);
    rect(width - 10, 0, 10, height);
}

function drawTreasure() {
    treasure1Position.x += 1;
    if (treasure1Position.x > width) {
        resetTreasure1();
    }
    image(treasureImg, treasure1Position.x, treasure1Position.y);

    if (checkCollision(ballXPosition, ballYPosition, treasure1Position.x, treasure1Position.y)) {
        score += 1;
        resetTreasure1();
        soundCollect.play();
    }

    treasure2Position.x -= 1;
    if (treasure2Position.x < -50) {
        resetTreasure2();
    }
    image(treasureImg, treasure2Position.x, treasure2Position.y);

    if (checkCollision(ballXPosition, ballYPosition, treasure2Position.x, treasure2Position.y)) {
        score += 1;
        resetTreasure2();
        soundCollect.play();
    }
}

function drawScore() {
    fill(255);
    textSize(18);
    text("Score: " + score, 35, 50);
}

function restartGame() {
    ballXPosition = width / 2;
    ballYPosition = height / 2;
    ballSpeedX = 0;
    ballSpeedY = 0;
    score = 0; 
    resetTreasure1();
    resetTreasure2();
    gameStarted = false;
}

function resetTreasure1() {
    treasure1Position = { x: -50, y: random(50, 450) };
}

function resetTreasure2() {
    treasure2Position = { x: width + 50, y: random(50, 450) };
}

function checkCollision(ballX, ballY, treasureX, treasureY) {
    let distance = dist(ballX, ballY, treasureX + 25, treasureY + 25);
    if (distance < ballRadius + 25) {
        return true;
    }
    return false;
}

function mousePressed() {
    if (!gameStarted) {
        let ballDirect = random([-1, 1]);
        ballSpeedX = random(1, 2) * ballDirect;
        ballSpeedY = random(1, 2);
        gameStarted = true;

        if (abs(ballSpeedY) < 0.5) {
            if (ballSpeedY > 0) {
                ballSpeedY = random(1, 2);
            } else {
                ballSpeedY = random(1, 2) * -1; 
            }
        }
    }
}
