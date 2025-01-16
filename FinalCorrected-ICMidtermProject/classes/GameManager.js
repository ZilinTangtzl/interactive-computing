// 
class GameManager {
    constructor() {
        this.day = 1;
        this.seasons = ['spring', 'summer', 'autumn', 'winter'];
        this.season = 'winter';
        this.weather = 'sunny';
        this.temperature = 20;
        this.hour = 6;
        this.minute = 0; 


        this.lastTimeUpdate = 0;
        this.timeUpdateInterval = 1000; 
        this.dayLength = 24 * 60; 
        this.timeScale = 1;  


        this.weatherOptions = {
            'sunny': { 
                name: 'Sunny', 
                temp: [20, 30]
            },
            'cloudy': { 
                name: 'Cloudy', 
                temp: [15, 25]
            },
            'rainy': { 
                name: 'Rainy', 
                temp: [10, 20]
            },
            'storm': { 
                name: 'Storm', 
                temp: [8, 15]
            }
        };

        this.seasonConfig = {
            'spring': {
                name: 'Spring',
                tempModifier: 0
            },
            'summer': {
                name: 'Summer',
                tempModifier: 5
            },
            'fall': {
                name: 'Fall',
                tempModifier: 0
            },
            'winter': {
                name: 'Winter',
                tempModifier: -5
            }
        };

        this.gold = 100; 
        this.isNewGame = true;
    }

    checkNewGame() {
        const savedData = localStorage.getItem('ghostFarmSave');
        if (savedData) {
            this.isNewGame = false;
        } else {
            this.isNewGame = true;
        }
    }

    update() {
        let currentTime = millis();
        if (currentTime - this.lastTimeUpdate > this.timeUpdateInterval) {
            this.updateTime();
            this.lastTimeUpdate = currentTime;
        }
    }

    updateTime() {
        this.minute += this.timeScale;

        if (this.minute >= 60) {
            this.hour += Math.floor(this.minute / 60);
            this.minute %= 60;
        }

        if (this.hour >= 24) {
            this.hour = 0;
            this.day++;
            this.updateWeather();

            player.energy = player.maxEnergy;
            player.mana = player.maxMana;

            if (this.day > 30) {
                this.day = 1;
                this.updateSeason();
            }
        }
    }

    updateWeather() {
        let weatherKeys = Object.keys(this.weatherOptions);
        let newWeather = weatherKeys[Math.floor(Math.random() * weatherKeys.length)];
        this.weather = newWeather;

        let [minTemp, maxTemp] = this.weatherOptions[newWeather].temp;
        let seasonMod = this.seasonConfig[this.season].tempModifier;
        
        minTemp += seasonMod;
        maxTemp += seasonMod;
        
        this.temperature = Math.floor(random(minTemp, maxTemp));
    }

    updateSeason() {
        if (!this.seasons || !Array.isArray(this.seasons)) {
            console.error('Seasons array is undefined or not an array');
            this.seasons = ['spring', 'summer', 'autumn', 'winter'];  
        }

        let currentIndex = this.seasons.indexOf(this.season);
        if (currentIndex === -1) {
            console.error('Current season not found in seasons array');
            this.season = this.seasons[0];  
            return;
        }

        if (currentIndex === this.seasons.length - 1) {
            this.season = this.seasons[0];
        } else {
            this.season = this.seasons[currentIndex + 1];
        }
    }

    saveGame() {
        const saveData = {
            player: {
                x: player.x,
                y: player.y,
                energy: player.energy,
                direction: player.direction,
                currentAction: player.currentAction
            },
            inventory: playerInventory.items,
            fields: fields.map(field => ({
                x: field.x,
                y: field.y,
                isWatered: field.isWatered,
                crop: field.crop ? {
                    type: field.crop.type,
                    growthStage: field.crop.growthStage,
                    isWatered: field.crop.isWatered
                } : null
            })),
            gameState: {
                day: this.day,
                season: this.season,
                weather: this.weather,
                temperature: this.temperature,
                hour: this.hour,
                minute: this.minute,
                gold: this.gold,
                tutorialCompleted: true
            }
        };

        localStorage.setItem('ghostFarmSave', JSON.stringify(saveData));
        player.tipBox.show("GAME SAVED");
    }

    loadGame() {
        const savedData = localStorage.getItem('ghostFarmSave');
        if (savedData) {
            const gameData = JSON.parse(savedData);

            this.seasons = ['spring', 'summer', 'autumn', 'winter'];
            
            if (this.seasons.includes(gameData.gameState.season)) {
                this.season = gameData.gameState.season;
            } else {
                console.warn('invalid season in save file');
                this.season = 'winter';
            }
            
            player.x = gameData.player.x;
            player.y = gameData.player.y;
            player.energy = gameData.player.energy;
            player.direction = gameData.player.direction;
            player.currentAction = gameData.player.currentAction;

            playerInventory.items = gameData.inventory;

            if (gameData.fields) {
                gameData.fields.forEach((fieldData, index) => {
                    if (index < fields.length) {
                        fields[index].isWatered = fieldData.isWatered;
                        if (fieldData.crop) {
                            fields[index].crop = new Crop(
                                fields[index].x + 9,
                                fields[index].y - 5,
                                fieldData.crop.type
                            );
                            fields[index].crop.growthStage = fieldData.crop.growthStage;
                            fields[index].crop.isWatered = fieldData.crop.isWatered;
                        }
                    }
                });
            }

            this.day = gameData.gameState.day;
            this.season = gameData.gameState.season;
            this.weather = gameData.gameState.weather;
            this.temperature = gameData.gameState.temperature;
            this.hour = gameData.gameState.hour;
            this.minute = gameData.gameState.minute;
            this.gold = gameData.gameState.gold || 100;

            if (gameData.gameState.tutorialCompleted) {
                this.isNewGame = false;
            } else {
                this.isNewGame = true;
            }

            player.tipBox.show("GAME LOADED");
            return true;
        }
        return false;
    }

    getTimeString() {
        return `${String(this.hour).padStart(2, '0')}:${String(this.minute).padStart(2, '0')}`;
    }

    displayGameInfo() {
        push();
        fill(0, 0, 0, 150);
        noStroke();
        rect(5, 5, 200, 180, 10); 

        fill(255);
        textSize(10.5);
        textAlign(LEFT, TOP);

        let seasonName = this.seasonConfig[this.season].name;
        text(`${seasonName.toUpperCase()} DAY ${this.day} ${this.getTimeString()}`, 15, 20);

        let weatherName = this.weatherOptions[this.weather].name;
        text(`WEATHER: ${weatherName}`, 15, 40);
        text(`TEMPERSTURE: ${this.temperature}°C`, 15, 60);

        let energyColor;
        if (player.energy > 50) {
            energyColor = color(0, 255, 0);
        } else if (player.energy > 20) {
            energyColor = color(255, 165, 0);
        } else {
            energyColor = color(255, 0, 0);
        }
        
        fill(energyColor);
        text(`ENERGY: ${floor(player.energy)}`, 15, 80);

        let manaColor;
        if (player.mana > 50) {
            manaColor = color(224, 227, 255); 

        } else if (player.mana > 20) {
            manaColor = color(250, 224, 255);  
        } else {
            manaColor = color(255, 224, 230);    
        }
        
        fill(manaColor);
        text(`MANA: ${floor(player.mana)}`, 15, 100);

        let cropName = 'None';
        if (player && player.selectedCrop) {
            if (itemsDatabase[player.selectedCrop]) {
                cropName = itemsDatabase[player.selectedCrop].name;
            } else {
                cropName = player.selectedCrop;
            }
        }

        fill(255);
        text(`ACTION: ${player.currentAction || 'None'}`, 15, 120);
        text(`CROP: ${cropName}`, 15, 140);
        text(`GOLD: ${this.gold}`, 15, 160);

        pop();
    }

    removeStorage() {
        if (confirm('Are you sure you want to delete the save? This cannot be undone.')) {
            localStorage.removeItem('ghostFarmSave');
            player.tipBox.show("STORAGE DELETED");
            console.log('Storage deleted');
        }
    }

    addGold(amount) {
        this.gold += amount;
    }

    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true; 
        } else {
            return false; 
        }
    }

} 