class Arrow {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.directions = ['up', 'right', 'down', 'left'];
    this.currentDirection = random(this.directions);

    this.size = 50;
  }

  display() {
    imageMode(CENTER);
    image(arrowImages[this.currentDirection], this.x, this.y, this.size, this.size);
  }
  checkClick() {
    let leftBoundary = this.x - this.size / 2;
    let rightBoundary = this.x + this.size / 2;
    let topBoundary = this.y - this.size / 2;
    let bottomBoundary = this.y + this.size / 2;

    if (mouseX > leftBoundary && 
        mouseX < rightBoundary &&
        mouseY > topBoundary &&
        mouseY < bottomBoundary) {
      
      let nextDirection = '';
      
      if (this.currentDirection === 'up') {
        nextDirection = 'right';
      } else if (this.currentDirection === 'right') {
        nextDirection = 'down'; 
      } else if (this.currentDirection === 'down') {
        nextDirection = 'left';
      } else if (this.currentDirection === 'left') {
        nextDirection = 'up';
      }
      
      this.currentDirection = nextDirection;
    }
  }
}
