let capture;
let compareFrame;
let mergedFrame;
let playerX;
let playerY;
let score;
let obstacles = [];


let particles = [];
const PARTICLE_COUNT = 50;
let gameBackground;

const cooldownTime = 10000;
let lastSkillTime = 0;
const motionThreshold = 300;
const obstacleSpeed = 2;

let showVideo = false;

function setup() {
    pixelDensity(1);
    createCanvas(640, 480);

    capture = createCapture({
        video: {
            mandatory: {
                minWidth: 640,
                minHeight: 480,
                maxWidth: 640,
                maxHeight: 480
            }
        },
        audio: false
    });
    capture.hide();

    compareFrame = createGraphics(640, 480);
    compareFrame.pixelDensity(1);
    mergedFrame = createGraphics(640, 480);
    mergedFrame.pixelDensity(1);

    playerX = width / 2;
    playerY = height - 50;
    score = 0;
    cooldown = false;

    // gradient bg set
    gameBackground = createGraphics(width, height);
    let c1 = color(255, 158, 158); // guava
    let c2 = color(158, 214, 169); // avocado
    setGradient(gameBackground, 0, 0, width, height, c1, c2);


    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    setInterval(spawnObstacle, 2000);


    let toggleBtn = document.getElementById('toggleVideo');
    toggleBtn.addEventListener('click', function () {
        showVideo = !showVideo;
    });
}




function setGradient(graphics, x, y, w, h, c1, c2) {
    graphics.noFill();

    for (let i = 0; i < h + 5; i += 10) {
        let mix = i / h;
        let currentColor = lerpColor(c1, c2, mix);

        graphics.stroke(currentColor);
        graphics.strokeWeight(12);
        graphics.line(x, y + i, x + w, y + i);
    }
    graphics.strokeWeight(1);
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = random(width);
        this.y = random(height);
        this.size = random(2, 5);
        this.speed = random(0.5, 2);
        this.alpha = random(100, 200);
    }

    update() {
        this.y += this.speed;
        if (this.y > height) {
            this.reset();
            this.y = 0;
        }
    }

    display() {
        noStroke();
        fill(255, this.alpha);
        circle(this.x, this.y, this.size);
    }
}

function draw() {

    image(gameBackground, 0, 0);


    for (let particle of particles) {
        particle.update();
        particle.display();
    }

    capture.loadPixels();
    compareFrame.loadPixels();

    const gestures = detectGestures();


    if (showVideo) {
        push();
        translate(width, 0);
        scale(-1, 1);
        image(capture, 0, 0, width, height);
        pop();
    }

    if (gestures.left) playerX -= 5;
    if (gestures.right) playerX += 5;
    playerX = constrain(playerX, 0, width - 30);

    if (gestures.double && !cooldown) {
        clearObstacles();
        cooldown = true;
        lastSkillTime = millis();
    }

    if (cooldown && millis() - lastSkillTime > cooldownTime) {
        cooldown = false;
    }


    drawPlayer();

    updateObstacles();

    // check game status
    if (checkCollision()) {
        noLoop();
        drawGameOver();
    }

    drawGameUI();

    compareFrame.image(capture, 0, 0, 640, 480);
}


// modified player
function drawPlayer() {
    push();
    translate(playerX + 15, playerY + 15);

    for (let i = 4; i > 0; i--) {
        fill(158, 214, 169, 50 / i);
        circle(0, 0, 40 + i * 5);
    }

    fill(158, 214, 169);
    circle(0, 0, 30);

    fill(255);
    circle(0, 0, 20);
    fill(158, 214, 169);
    circle(0, 0, 10);
    pop();
}


function updateObstacles() {
    for (let obstacle of obstacles) {
        obstacle.y += obstacleSpeed;

        push();

        for (let i = 3; i > 0; i--) {
            fill(255, 158, 158, 30 / i);
            rect(obstacle.x - i * 2, obstacle.y - i * 2,
                obstacle.width + i * 4, obstacle.height + i * 4, 8);
        }


        fill(255, 158, 158);
        rect(obstacle.x, obstacle.y, obstacle.width, obstacle.height, 5);

        fill(255, 100);
        rect(obstacle.x + 5, obstacle.y + 5,
            obstacle.width - 10, obstacle.height - 10, 3);
        pop();
    }

    obstacles = obstacles.filter((obstacle) => {
        if (obstacle.y > height) {
            score++;
            return false;
        }
        return true;
    });
}

function drawGameUI() {
    push();
    textSize(24);
    textAlign(LEFT, TOP);
    fill(255);
    text(`Score: ${score}`, 20, 20);

    if (cooldown) {
        let cooldownRemaining = (cooldownTime - (millis() - lastSkillTime)) / 1000;
        let barWidth = map(cooldownRemaining, 0, cooldownTime / 1000, 0, 100);

        fill(255, 150);
        rect(20, 50, 100, 10, 5);
        fill(158, 214, 169); // avocado
        rect(20, 50, barWidth, 10, 5);

        textSize(16);
        text(`Cooldown: ${cooldownRemaining.toFixed(1)}s`, 20, 70);
    } else {
        fill(158, 214, 169);
        textSize(16);
        text("Skill Ready!", 20, 60);
    }
    pop();
}

function drawGameOver() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255, 158, 158); // guava
    text(`Game Over! Score: ${score}`, width / 2, height / 2);
    pop();
}

function detectGestures() {
    let leftMotion = 0, rightMotion = 0;

    for (let x = 0; x < 640; x++) {
        for (let y = 0; y < 480; y++) {
            let index = (x + y * 640) * 4; 

            let r1 = capture.pixels[index];
            let g1 = capture.pixels[index + 1];
            let b1 = capture.pixels[index + 2];
            let r2 = compareFrame.pixels[index];
            let g2 = compareFrame.pixels[index + 1];
            let b2 = compareFrame.pixels[index + 2];

            let diff = dist(r1, g1, b1, r2, g2, b2);


            if (diff > 30) {
                if (x < 320){
                    rightMotion++;
                }
                else{
                    leftMotion++;
                }

            }
        }
    }

    return {
        left: leftMotion > motionThreshold && rightMotion <= motionThreshold,
        right: rightMotion > motionThreshold && leftMotion <= motionThreshold,
        double: leftMotion > motionThreshold && rightMotion > motionThreshold,
    
    };
}

function spawnObstacle() {
    obstacles.push({
        x: random(0, width - 50), 
        y: 0, 
        width: random(20, 50), 
        height: 20, 
    });
   
}

function clearObstacles() {
    obstacles = []; 
}

function checkCollision() {
    for (let obstacle of obstacles) {
      
        if (
            playerX < obstacle.x + obstacle.width && playerX + 30 > obstacle.x && playerY < obstacle.y + obstacle.height && playerY + 30 > obstacle.y
        ) {
            return true; 
        }
    }
    return false; 
}
