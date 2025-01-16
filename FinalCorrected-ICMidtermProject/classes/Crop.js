class Crop {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; 
        this.growthStage = 0;
        this.isWatered = false;
        this.isReadyToHarvest = false;

        let cropData = cropsConfig[type];
        this.maxGrowthStage = cropData.maxGrowthStage;
        this.growthTimePerStage = cropData.growthTimePerStage;

        if (!cropSprites[type]) {
            console.error(`Crop sprite not found: ${type}`);
            this.sprites = null;
        } else {
            this.sprites = cropSprites[type];
        }

        if (type === 'ghostSprout') {
            this.noteType = Math.floor(Math.random() * 3) + 4; 
        }

        this.timeSinceLastStage = 0; 
        this.lastUpdateTime = millis();

        this.width = tileSize;  
        this.height = tileSize; 
    }

    updateAndDisplay() {
        this.update();
        this.display();
    }

    update() {
        let currentTime = millis();
        let elapsedTime = currentTime - this.lastUpdateTime;
  
        if (this.isWatered) {
            this.timeSinceLastStage += elapsedTime;
  
            if (this.timeSinceLastStage >= this.growthTimePerStage) {
                this.growthStage++;
                this.timeSinceLastStage = 0;
                this.isWatered = false;
  
                if (this.growthStage >= this.maxGrowthStage) {
                    this.isReadyToHarvest = true;
                    this.growthStage = this.maxGrowthStage;
                }
            }
        }
  
        this.lastUpdateTime = currentTime;
    }

    water() {
        this.isWatered = true;
        this.lastUpdateTime = millis(); 
    }

    harvest() {
        if (this.isReadyToHarvest || this.type === 'ghostSprout') {
            if (this.type === 'ghostSprout') {
                return {
                    type: this.type,
                    noteType: this.noteType
                };
            }
            return this.type;
        }
        return null;
    }

    display() {
        if (!this.sprites) {
            fill(0, 255, 0);
            noStroke();
            rect(this.x, this.y, this.width, this.height);
            return;
        }

        let spriteIndex = this.growthStage;
        if (this.isReadyToHarvest) {
            spriteIndex = Math.min(spriteIndex, this.sprites.length - 1);
        }

        try {
            let sprite = this.sprites[spriteIndex];
            if (sprite && sprite.width) {
                image(sprite, this.x, this.y, this.width, this.height);
            } else {
                throw new Error('Sprite not fully loaded');
            }
        } catch (error) {
            console.error(`Error displaying crop: ${this.type}`, error);
            fill(0, 255, 0);
            noStroke();
            rect(this.x, this.y, this.width, this.height);
        }
    }
}