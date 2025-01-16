class Robot {
    constructor(x, y, direction) {
      this.x = x;
      this.y = y;
      this.direction = direction;

      this.headSize = random(25, 50);
      this.bodySize = this.headSize + random(10, 20);

      this.headColor = color(random(255), random(255), random(255));
      this.bodyColor = color(random(255), random(255), random(255));

      while (this.headColor.toString() === this.bodyColor.toString()) {
        this.bodyColor = color(random(255), random(255), random(255));
      }

      this.eyeType = random(['visor', 'eyes']);

      this.thrusterAlpha = 255;
      this.alphaDecrease = true;
    }
    move() {
      if (this.direction === 'up') {
        this.y -= 1;
      } 
      else if (this.direction === 'down') {
        this.y += 1;
      }
      else if (this.direction === 'left') {
        this.x -= 1;
      }
      else if (this.direction === 'right') {
        this.x += 1;
      }

      if (this.alphaDecrease) {
        this.thrusterAlpha -= 5; 
        if (this.thrusterAlpha <= 100) { 
          this.alphaDecrease = false; 
        }
      } 
      else {
        this.thrusterAlpha += 5; 
        if (this.thrusterAlpha >= 255) { 
          this.alphaDecrease = true; 
        }
      }

      for (let i = 0; i < arrows.length; i++) {
        let d = dist(this.x, this.y, arrows[i].x, arrows[i].y);
        if (d < (this.bodySize + arrows[i].size) / 2) {
          this.direction = arrows[i].currentDirection;
        }
      }
    }
  
    display() {
      push();
      translate(this.x, this.y);
      noStroke();
  
      fill(this.bodyColor);
      rectMode(CENTER);
      rect(0, 0, this.bodySize, this.bodySize);
  
      fill(this.headColor);
      rect(0, -this.bodySize / 2 - this.headSize / 2, this.headSize, this.headSize);
  
      fill(255);
      if (this.eyeType === 'visor') {
        rect(0, -this.bodySize / 2 - this.headSize / 2, this.headSize * 0.8, this.headSize * 0.2);
      } else {
        let eyeOffset = this.headSize * 0.2;
        rect(-eyeOffset, -this.bodySize / 2 - this.headSize / 2, this.headSize * 0.15, this.headSize * 0.25);
        rect(eyeOffset, -this.bodySize / 2 - this.headSize / 2, this.headSize * 0.15, this.headSize * 0.25);
      }
  
      fill(255, 255, 0, this.thrusterAlpha); 
      
      let offset = this.bodySize / 2 + 5; 
      if (this.direction === 'up') {
        ellipse(0, offset, 10, 10);
      } else if (this.direction === 'down') {
        ellipse(0, -(offset+this.headSize), 10, 10);
      } else if (this.direction === 'left') {
        ellipse(offset, 0, 10, 10);
      } else if (this.direction === 'right') {
        ellipse(-offset, 0, 10, 10);
      }
  
      pop();
    }
  }
  