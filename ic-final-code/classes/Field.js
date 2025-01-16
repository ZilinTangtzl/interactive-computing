class Field {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.crop = null;
        this.isWatered = false;
    }

    containsCrop() {
        return this.crop !== null;
    }

    containsPoint(pointX, pointY) {
        const worldPointX = pointX;
        const worldPointY = pointY;
        
        const xInRange = worldPointX >= this.x && worldPointX < this.x + this.size;
        const yInRange = worldPointY >= this.y && worldPointY < this.y + this.size;
        const contains = xInRange && yInRange;
        
        if (debugMode) {
            console.log('Detailed position check:', {
                worldPointX,
                worldPointY,
                fieldX: this.x,
                fieldY: this.y,
                fieldSize: this.size,
                xInRange,
                yInRange,
                contains
            });
        }
        
        return contains;
    }

    plant(cropType) {
        if (!this.crop) {
            const cropX = this.x+9;
            const cropY = this.y - 5;

            if (Math.random() < 0.3) {
                this.crop = new Crop(cropX, cropY, 'ghostSprout');
                player.tipBox.show("*A mysterious force affected the seed...*");
            } else {
                this.crop = new Crop(cropX, cropY, cropType);
            }
            return true;
        }
        return false;
    }

    water() {
        if (!this.crop) {
            return false;
        }
        if (this.crop.isWatered) {
            return false;
        }
        this.isWatered = true;
        this.crop.water();
        return true;
    }

    reset() {
        this.crop = null;
        this.isWatered = false;
    }
    
    harvest() {
        if (this.crop) {
            if (this.crop.type === 'ghostSprout') {
                const harvestedGhost = {
                    type: 'ghostSprout',
                    noteType: this.crop.noteType
                };
                this.reset();
                return harvestedGhost;
            } else if (this.crop.isReadyToHarvest) {
                const harvestedCrop = this.crop.type;
                this.reset();
                return harvestedCrop;
            }
        }
        return null;
    }

    update() {
        if (this.crop) {
            this.crop.update();
        }
    }

    display() {
        if (debugMode) {
            noFill();
            stroke(255, 0, 0, 50);
            rect(this.x, this.y, this.size, this.size);
        }

        if (this.isWatered) {
            fill(0, 0, 255, 30);  
            noStroke();
            rect(this.x, this.y, this.size, this.size);
        }

        if (this.crop) {
            this.crop.display();
        }
    }
}

