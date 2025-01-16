class Player {
  constructor(x, y, sprites) {
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.direction = 'down';
    
    this.energy = 100;
    this.maxEnergy = 100;
    this.energyRegenRate = 0.5;     
    this.waterRegenRate = 3.0;      
    this.waterDrainRate = 5.0;     
    this.waterStayTime = 0;        
    this.waterStayLimit = 10;      
    this.lastEnergyUpdate = millis();
    this.lastEnergyLogTime = millis();

    this.mana = 100;
    this.maxMana = 100;
    this.manaRegenRate = 2.0;      
    this.lastManaUpdate = millis();
    this.lastManaLogTime = millis();

    this.logInterval = 1000;       
    this.sprites = sprites;

    this.currentAction = 'plant';
    this.selectedCrop = 'corn';

    this.width = tileSize;
    this.height = tileSize;
    this.size = tileSize;

    this.currentFrame = 0;
    this.pauseCounter = 0;
    this.pauseCounterMax = 5;

    this.currentField = null;

    this.dialogBox = new DialogBox();
    this.tipBox = new TipBox();
    this.lastTerrainCheck = 0;
    this.terrainCheckDelay = 300;

    this.inWaterArea = false;
    this.inShopArea = false;

    this.lastLogTime = millis();
    this.logInterval = 2000;        
  }

  moveAndDisplay() {
    this.move();
    this.display();
  }

  computeSensors() {
    this.middleX = this.x + this.width / 2;
    this.middleY = this.y + this.height / 2;

    this.leftX = this.x;
    this.leftY1 = this.y + 2;
    this.leftY2 = this.y + this.height - 5;

    this.rightX = this.x + this.width;
    this.rightY1 = this.y + 5;
    this.rightY2 = this.y + this.height - 5;

    this.upY = this.y;
    this.upX1 = this.x + 5;
    this.upX2 = this.x + this.width - 5;

    this.downY = this.y + this.height + 1;
    this.downX1 = this.x + 5;
    this.downX2 = this.x + this.width - 5;
  }

  move() {
    let isMoving = false;
    let oldX = this.x;
    let oldY = this.y;

    this.computeSensors();
    
    let worldLeftX = this.leftX;
    let worldRightX = this.rightX;
    let worldUpY = this.upY;
    let worldDownY = this.downY;

    const isOutOfBounds = (x, y) => {
        return x < 0 || x >= levelHitMap.width || y < 0 || y >= levelHitMap.height;
    };

    if (keyIsDown(RIGHT_ARROW)) {
        this.direction = 'right';
        isMoving = true;
        
        if (isOutOfBounds(worldRightX, this.rightY1) || isOutOfBounds(worldRightX, this.rightY2)) {
            return;
        }
        
        let p1 = levelHitMap.get(worldRightX, this.rightY1);
        let p2 = levelHitMap.get(worldRightX, this.rightY2);
        
        if (red(p1) == 0 && green(p1) == 0 && blue(p1) == 0 ||
            red(p2) == 0 && green(p2) == 0 && blue(p2) == 0) {
            this.tipBox.show("It seems like you can't go this way...");
        } else {
            this.x += this.speed;
        }
    }

    if (keyIsDown(LEFT_ARROW)) {
        this.direction = 'left';
        isMoving = true;
        
        if (isOutOfBounds(worldLeftX, this.leftY1) || isOutOfBounds(worldLeftX, this.leftY2)) {
            return;
        }
        
        let p1 = levelHitMap.get(worldLeftX, this.leftY1);
        let p2 = levelHitMap.get(worldLeftX, this.leftY2);
        
        if (red(p1) == 0 && green(p1) == 0 && blue(p1) == 0 ||
            red(p2) == 0 && green(p2) == 0 && blue(p2) == 0) {
            this.tipBox.show("It seems like you can't go this way...");
        } else {
            this.x -= this.speed;
        }
    }

    if (keyIsDown(UP_ARROW)) {
        this.direction = 'up';
        isMoving = true;
        
        if (isOutOfBounds(this.upX1, worldUpY) || isOutOfBounds(this.upX2, worldUpY)) {
            return;
        }
        
        let p1 = levelHitMap.get(this.upX1, worldUpY);
        let p2 = levelHitMap.get(this.upX2, worldUpY);
        
        if (red(p1) == 0 && green(p1) == 0 && blue(p1) == 0 ||
            red(p2) == 0 && green(p2) == 0 && blue(p2) == 0) {
            this.tipBox.show("It seems like you can't go this way...");
        } else {
            this.y -= this.speed;
        }
    }

    if (keyIsDown(DOWN_ARROW)) {
        this.direction = 'down';
        isMoving = true;
        
        if (isOutOfBounds(this.downX1, worldDownY) || isOutOfBounds(this.downX2, worldDownY)) {
            return;
        }
        
        let p1 = levelHitMap.get(this.downX1, worldDownY);
        let p2 = levelHitMap.get(this.downX2, worldDownY);
        
        if (red(p1) == 0 && green(p1) == 0 && blue(p1) == 0 ||
            red(p2) == 0 && green(p2) == 0 && blue(p2) == 0) {
            this.tipBox.show("*bump* Oh my... seems I can't pass.");
        } else {
            this.y += this.speed;
        }
    }

    if (isMoving) {
        this.energy -= 0.01;
        if (this.energy <= 0) {
            this.energy = 0;
            this.x = oldX;
            this.y = oldY;
            this.tipBox.show("You're too tired to move.");
            return;
        }
        this.updateAnimation();
    } else {
        this.energy += 0.001;
        this.currentFrame = 0;
    }

    if (this.x !== oldX || this.y !== oldY) {
        this.checkCurrentField();
        
        if (millis() - this.lastTerrainCheck > this.terrainCheckDelay) {
            this.checkTerrain();
            this.lastTerrainCheck = millis();
        }
    }
  }

  action() {
    let currentField = null;
    
    let playerCenterX = this.x + this.width/2;
    let playerCenterY = this.y + this.height/2;
    
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].containsPoint(playerCenterX, playerCenterY)) {
            currentField = fields[i];
            break;
        }
    }

    if (!currentField) {
        return;
    }

    switch (this.currentAction) {
        case 'plant':
            if (currentField.containsCrop()) {
                return;
            }
            if (this.energy < 5) {
                return;
            }
            if (currentField.plant(this.selectedCrop)) {
                this.energy -= 5;
            }
            break;

        case 'water':
            if (!currentField.containsCrop()) {
                return;
            }
            
            if (currentField.crop.type === 'ghostSprout') {
                if (this.mana < 5) {
                    this.tipBox.show("Insufficient mana, cannot water ghost crop!");
                    return;
                }

                var currentTime = millis();
                var oldMana = this.mana;
                this.mana -= 5;
                this.mana = Math.max(0, this.mana);
                this.lastManaUpdate = currentTime;
                this.tipBox.show("*Used mana to nourish the ghost crop...*");
            } else {
                if (this.energy < 3) {
                    this.tipBox.show("Insufficient energy, cannot water!");
                    return;
                }

                var currentTime = millis();
                var oldEnergy = this.energy;
                this.energy -= 3;
                this.energy = Math.max(0, this.energy);
                this.lastEnergyUpdate = currentTime;
            }
            
            currentField.water();
            break;

        case 'harvest':
            if (!currentField.containsCrop()) {
                return;
            }
            if (!currentField.crop.isReadyToHarvest && currentField.crop.type !== 'ghostSprout') {
                return;
            }
            if (this.energy < 3) {
                return;
            }
            let harvestedCrop = currentField.harvest();
            if (harvestedCrop) {
                this.energy -= 3;
                if (playerInventory) {
                    if (typeof harvestedCrop === 'object') {
                        playerInventory.addGhostNote(harvestedCrop.noteType);
                    } else {
                        playerInventory.addItem(harvestedCrop);
                    }
                }
            }
            break;
    }
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  updateAnimation() {
    this.pauseCounter--;

    if (this.pauseCounter <= 0) {
      this.currentFrame += 1;
      if (this.currentFrame >= this.sprites[this.direction].length) {
        this.currentFrame = 0;
      }
      this.pauseCounter = this.pauseCounterMax;
    }
  }

  display() {
    let sprite = this.sprites[this.direction][this.currentFrame];
    image(sprite, this.x, this.y, this.width, this.height);

    if (debugMode) {
        stroke(255, 0, 0);
        strokeWeight(2);
        
        point(this.leftX, this.leftY1);
        point(this.leftX, this.leftY2);
        point(this.rightX, this.rightY1);
        point(this.rightX, this.rightY2);
        
        point(this.upX1, this.upY);
        point(this.upX2, this.upY);
        point(this.downX1, this.downY);
        point(this.downX2, this.downY);
        
        stroke(0, 255, 0);
        point(this.middleX, this.middleY);
        
        strokeWeight(1);
    }

    if (debugMode && this.currentField) {
        stroke(255, 255, 0);
        noFill();
        rect(this.currentField.x, this.currentField.y, this.currentField.size, this.currentField.size);
    }

    if (viewFieldBorder && this.currentField) {
      stroke(255, 255, 0); 
      noFill();
      rect(this.currentField.x, this.currentField.y, this.currentField.size, this.currentField.size);
  }

    this.dialogBox.display();
    this.tipBox.update();
    this.tipBox.display();
  }

  checkCurrentField() {
    this.currentField = null;
    let playerCenterX = this.x + this.width/2;
    let playerCenterY = this.y + this.height/2;

    for (let field of fields) {
        if (field.containsPoint(playerCenterX, playerCenterY)) {
            this.currentField = field;
            break;
        }
    }
  }

  checkTerrain() {
    let terrainColor = levelHitMap.get(this.middleX, this.middleY);
    let r = red(terrainColor);
    let g = green(terrainColor);
    let b = blue(terrainColor);

    let isInWater = (b > 200 && r < 100 && g < 100);
    if (isInWater) {
        if (!this.inWaterArea) {
            this.tipBox.show("Ah, the water's refreshingly cool!");
            this.inWaterArea = true;
            this.waterStayStart = millis();
        } else {
            let waterStayDuration = millis() - this.waterStayStart;
            if (waterStayDuration > 1000) { 
                this.energy -= 5;
                let chance =  random(1, 100); 
                if (chance < 10) { 
                    this.energy += 10;
                    this.tipBox.show("You feel rejuvenated by the water!");
                } else {
                    this.tipBox.show("The water drains your energy...");
                }
                this.waterStayStart = millis();
            }
        }
    } else {
        if (this.inWaterArea) {
            this.inWaterArea = false;
        }
    }

    let isInShop = (r > 200 && g < 100 && b < 100);
    if (isInShop && !this.inShopArea) {
        this.dialogBox.showShopDialog();
        this.inShopArea = true;
    } else if (!isInShop && this.inShopArea) {
        this.inShopArea = false;
        this.dialogBox.hide();
    }
  }

  openShop() {
    this.dialogBox.showShopMenu();
  }

  update() {
    var currentTime = millis();

    var secondsPassedEnergy = (currentTime - this.lastEnergyUpdate) / 1000.0;

    if (secondsPassedEnergy > 0) {
        if (this.isNearWater) {
            this.waterStayTime += secondsPassedEnergy;

            if (this.waterStayTime > this.waterStayLimit) {
                var oldEnergy = this.energy;
                this.energy -= this.waterDrainRate * secondsPassedEnergy;
                this.energy = Math.max(0, this.energy);
            } else {
                var oldEnergy = this.energy;
                this.energy += this.waterRegenRate * secondsPassedEnergy;
                this.energy = Math.min(this.energy, this.maxEnergy);
            }
        } else {
            this.waterStayTime = 0;

            if (this.energy < this.maxEnergy) {
                var oldEnergy = this.energy;
                this.energy += this.energyRegenRate * secondsPassedEnergy;
                this.energy = Math.min(this.energy, this.maxEnergy);
            }
        }

        this.lastEnergyUpdate = currentTime;
    }

    var secondsPassedMana = (currentTime - this.lastManaUpdate) / 1000.0;

    if (secondsPassedMana > 0 && this.mana < this.maxMana) {
        var oldMana = this.mana;
        this.mana += this.manaRegenRate * secondsPassedMana;
        this.mana = Math.min(this.mana, this.maxMana);
        this.lastManaUpdate = currentTime;
    }

  }


}

