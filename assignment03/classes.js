class Starship {
    constructor() {
        this.x = width / 2;
        this.y = height - 100;

        this.speed = 10;
        this.shieldValue = 100;

        this.isWarping = false;
        this.warpCooldown = 0;
        this.warpDuration = 0;
        this.hitCount = 0;
        this.lastCooldownUpdateTime = millis(); 
    }

    draw() {
        image(starshipImg, this.x, this.y, 50, 50);
    }

    move() {
        if (keyIsDown(LEFT_ARROW) && this.x > 0) {
            this.x -= this.speed;
        }
        if (keyIsDown(RIGHT_ARROW) && this.x < width - 50) {
            this.x += this.speed;
        }
        if (keyIsDown(UP_ARROW) && this.y > 0) {
            this.y -= this.speed;
        }
        if (keyIsDown(DOWN_ARROW) && this.y < height - 50) {
            this.y += this.speed;
        }
    }

    activateWarp() {
        if (this.shieldValue > 50 && this.warpCooldown <= 0) {
            this.isWarping = true;
            this.warpStartTime = millis();  
            this.warpDuration = warpDurationTime * 1000; 
            warpActivateSound.play();
            crewDialogue.trigger('warpActivated');
        } else {
            if (this.shieldValue <= 50) {
                crewDialogue.trigger('warpFailedShield');
            } else if (this.warpCooldown > 0) {
                crewDialogue.trigger('warpFailedCooldown');
            }
        }
    }

    update() {
        if (frameCount % recoveryInterval == 0 && this.shieldValue < 100) {
            if (this.shieldValue + shieldRecoveryRate > 100) {
                this.shieldValue = 100;
            } else {
                this.shieldValue += shieldRecoveryRate;
            }

        }

        if (this.isWarping) {
            if (millis() - this.warpStartTime >= this.warpDuration) {
                this.isWarping = false;
                this.warpCooldown = warpCooldownTime * 1000;  
                this.lastCooldownUpdateTime = millis(); 
            }
        }

        if (!this.isWarping && this.warpCooldown > 0) {
            let currentTime = millis();  
            let elapsedTime = currentTime - this.lastCooldownUpdateTime; 
            this.warpCooldown -= elapsedTime;  
            this.lastCooldownUpdateTime = currentTime; 
        }
    }
}

class Obstacle {
    constructor() {
        this.x = random(0, width - 50);
        this.y = 0;
        this.speed = obstacleSpeed;
    }

    draw() {
        image(asteroidImg, this.x, this.y, 50, 50);
    }

    move() {
        this.y += this.speed;
    }
}

class EnergyCrystal {
    constructor() {
        this.x = random(0, width - 50);
        this.y = 0;
        this.speed = energySpeed;
    }

    draw() {
        image(energyCrystalImg, this.x, this.y, 30, 30);
    }

    move() {
        this.y += this.speed;
    }
}

class CrewDialogue {
    constructor() {
        this.dialogues = [];
        this.maxDialogues = 4;  
    }

    trigger(eventType, additionalInfo) {
        if (additionalInfo === undefined) {
            additionalInfo = {};
        }

        let message = '';
        let crewMember = '';

        switch (eventType) {
            case 'shieldBelow50':
                crewMember = 'Chief Engineer';
                message = 'Captain, shields have dropped below 50%. Proceed with caution!';
                break;
            case 'shieldBelow20':
                crewMember = 'Chief Engineer';
                message = 'Warning! Shields critically low!';
                break;
            case 'energyCollected':
                crewMember = 'Chief Engineer';
                message = "Shield energy restored. Current value: " + starship.shieldValue + "%.";
                break;
            case 'warpReady':
                crewMember = 'First Officer';
                message = 'Captain, the warp drive is ready for activation.';
                break;
            case 'warpActivated':
                crewMember = 'Helmsman';
                message = 'Engaged warp drive. Smooth sailing ahead.';
                break;
            case 'warpFailedShield':
                crewMember = 'Chief Engineer';
                message = 'Apologies, Captain. Shield energy is too low to engage warp.';
                break;
            case 'warpFailedCooldown':
                crewMember = 'First Officer';
                message = 'Warp drive cooling down. Please wait a moment.';
                break;
            case 'obstacleWarning':
                crewMember = 'Helmsman';
                message = 'Asteroid field ahead. Recommend evasive maneuvers.';
                break;
            case 'gameSuccess':
                crewMember = 'Communications Officer';
                message = 'Captain, we have successfully arrived at our destination. Mission accomplished!';
                break;
            case 'gameOver':
                crewMember = 'First Officer';
                message = 'Captain, the starship has been destroyed. Mission failed.';
                break;
            case 'rescueSignal':
                crewMember = 'Communications Officer';
                message = additionalInfo.shipName + ": " + additionalInfo.message + "\n\n";
                break;
            case 'rescueAccepted':
                crewMember = 'First Officer';
                message = "Accepted rescue mission from " + additionalInfo.shipName + ".";  
                break;
            case 'rescueDeclined':
                crewMember = 'First Officer';
                message = "Declined rescue request from " + additionalInfo.shipName + "."; 
                break;
            case 'achievementUnlocked':
                crewMember = 'Starfleet Command';
                message = additionalInfo.message + "\n\n";  
                break;
            default:
                return; 
        }

        // duplicate check
        if (this.dialogues.length > 0 && this.dialogues[0].message === message) {
            return; 
        }

        this.dialogues.unshift({ crewMember, message });

        // message limit
        if (this.dialogues.length > this.maxDialogues) {
            this.dialogues.pop();
        }
    }
}
