let starship;
let obstacles = [];
let energyCrystals = [];
let crewDialogue;
// let achievements;

let starshipImg;
let asteroidImg;
let energyCrystalImg;
let backgroundImg;

let bgMusic;
let shieldHitSound;
let collectEnergySound;
let warpActivateSound;

let collisionDistance = 30;
let shieldDamage = 30;
let recoveryInterval = 60;
let shieldRecoveryRate = 5;
let energySpeed = 3;
let energyRecovery = 10;
let warpCooldownTime = 20;
let warpDurationTime = 10;
let obstacleSpawnInterval = 30;
let obstacleSpeed = 5;
let cristalSpawnInterval = 60;

let achievements = {
    rescueMissionsCompleted: 0,
    energyCrystalsCollected: 0,
    survivalTimeAchieved: false,
    missionCompleted: false,
    totalHitsTaken: 0,
    unlockedAchievements: []
};

let totalEnergyCrystalsCollected = parseInt(localStorage.getItem('totalEnergyCrystalsCollected')) || 0;

let obstacleWarningCooldown = 0;

// rescue lists
let starshipNames = [
    'USS Antares', 'USS Armstrong', 'USS Biddeford', 'USS Bradbury', 'USS Farragut',
    'USS Franklin', 'USS Hood', 'Jellyfish', 'K\'normian trading ship', 'USS Kelvin',
    'USS Kobayashi Maru', 'USS Mayflower', 'Narada', 'USS Newton', 'USS Odyssey',
    'USS Salcombe', 'USS Stargazer', 'USS Truman', 'USS Vengeance', 'USS Wolcott'
];

let gameStarted = false;
let gamePaused = false;
let gameOver = false;
let gameSuccess = false;
let score = 0;
let survivalTime = 0;
let remainingTime;
let gameTime;
let highestScore = 0;
let lastSurvivalTime = 0;
let lastGameSuccess = false;

let startTime;

let isWarpEngineReady = false; 

let isShieldBelow50 = false;  
let isShieldBelow20 = false;  

// rescue related
let rescueSignalGapTime = 30 * 60;
let rescueSignalTriggered = false;
let rescueInProgress = false;
let currentRescueShipName = '';

let difficultyLevel = 'Medium'; 

function preload() {
    starshipImg = loadImage('images/starship.png'); 
    asteroidImg = loadImage('images/asteroid.png');
    energyCrystalImg = loadImage('images/energy_crystal.png');
    backgroundImg = loadImage('images/space_background.png');

    bgMusic = loadSound('sounds/background_music.wav');
    shieldHitSound = loadSound('sounds/shield_hit.wav');
    collectEnergySound = loadSound('sounds/collect_energy.wav');
    warpActivateSound = loadSound('sounds/warp_activate.wav');
}

function setup() {
    let canvas = createCanvas(600, 600);
    canvas.parent('gameCanvas');

    starship = new Starship();

    crewDialogue = new CrewDialogue();

    if (localStorage.getItem('highestScore') !== null) {
        highestScore = parseInt(localStorage.getItem('highestScore'));
    } else {
        highestScore = 0;
    }

    if (localStorage.getItem('lastSurvivalTime') !== null) {
        lastSurvivalTime = parseInt(localStorage.getItem('lastSurvivalTime'));
    } else {
        lastSurvivalTime = 0;
    }

    if (localStorage.getItem('lastGameSuccess') !== null) {
        lastGameSuccess = localStorage.getItem('lastGameSuccess') === 'true';
    } else {
        lastGameSuccess = false;
    }

    updateControlPanel();

    showStartScreen();
}

function draw() {
    if (gameStarted && !gamePaused) {
        background(backgroundImg);

        survivalTime = int((millis() - startTime) / 1000);  

        // draw ship
        starship.draw();
        starship.move();
        starship.update();

        // draw obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].draw();
            obstacles[i].move();
            if (obstacles[i].y > height) {
                obstacles.splice(i, 1);
            } else if (!starship.isWarping) {

                let d = dist(starship.x, starship.y, obstacles[i].x, obstacles[i].y);
                if (d < collisionDistance) {
                    starship.shieldValue -= shieldDamage;
                    shieldHitSound.play();
                    obstacles.splice(i, 1);
                    score -= 15;
                    starship.hitCount++;
                    achievements.totalHitsTaken++;
                    if (starship.shieldValue <= 0) {
                        gameOver = true;
                        gameSuccess = false;
                        crewDialogue.trigger('gameOver');
                        endGame();
                    } else if (starship.shieldValue <= 20) {
                        crewDialogue.trigger('shieldBelow20');
                    } else if (starship.shieldValue <= 50) {
                        crewDialogue.trigger('shieldBelow50');
                    }
                }
            }
        }

        // draw crystal
        for (let i = energyCrystals.length - 1; i >= 0; i--) {
            energyCrystals[i].draw();
            energyCrystals[i].move();
            if (energyCrystals[i].y > height) {
                energyCrystals.splice(i, 1);
            } else {
                let d = dist(starship.x, starship.y, energyCrystals[i].x, energyCrystals[i].y);
                if (d < collisionDistance) {
                    if (starship.shieldValue + energyRecovery > 100) {
                        starship.shieldValue = 100;
                    } else {
                        starship.shieldValue += energyRecovery;
                    }

                    collectEnergySound.play();
                    crewDialogue.trigger('energyCollected');
                    energyCrystals.splice(i, 1);
                    score += 20;
                    achievements.energyCrystalsCollected++;
                    totalEnergyCrystalsCollected++;
                    checkAchievements();
                }
            }
        }

        if (frameCount % obstacleSpawnInterval == 0) {
            obstacles.push(new Obstacle());
        }

        if (frameCount % cristalSpawnInterval == 0) {
            energyCrystals.push(new EnergyCrystal());
        }

        //  rescue trigger
        if (!rescueInProgress && frameCount % rescueSignalGapTime == 0 && !rescueSignalTriggered) {
            currentRescueShipName = random(starshipNames);
            let message = currentRescueShipName + " requesting assistance. Proceed to rescue?\n\n";
            // let message = currentRescueShipName + " requesting assistance. Proceed to rescue?";
            crewDialogue.trigger('rescueSignal', { shipName: currentRescueShipName, message });
            rescueSignalTriggered = true;
            rescueRequestTime = millis();
        }

        // if no response
        if (rescueSignalTriggered && millis() - rescueRequestTime > 10000) {
            declineRescueMission(currentRescueShipName);
            rescueSignalTriggered = false;
        }

        updateControlPanel();

        let elapsedTime = int((millis() - startTime) / 1000);
        remainingTime = gameTime - elapsedTime;
        if (remainingTime <= 0 && !gameOver) {
            remainingTime = 0;
            gameSuccess = true;
            achievements.missionCompleted = true;
            crewDialogue.trigger('gameSuccess');
            checkAchievements();
            endGame();
        }

        if (starship.warpCooldown <= 0 && !starship.isWarping && !isWarpEngineReady) {
            crewDialogue.trigger('warpReady');
            isWarpEngineReady = true;
        }

        if (starship.isWarping) {
            isWarpEngineReady = false;
        }

        if (starship.shieldValue <= 50 && !isShieldBelow50) {
            crewDialogue.trigger('shieldBelow50');
            isShieldBelow50 = true;
        }

        if (starship.shieldValue > 50) {
            isShieldBelow50 = false;
        }

        if (starship.shieldValue <= 20 && !isShieldBelow20) {
            crewDialogue.trigger('shieldBelow20');
            isShieldBelow20 = true;
        }

        if (starship.shieldValue > 20) {
            isShieldBelow20 = false;
        }

        if (obstacleWarningCooldown > 0) {
            obstacleWarningCooldown -= deltaTime;
        }

        if (obstacleWarningCooldown <= 0) {
            for (let obstacle of obstacles) {
                let d = dist(starship.x, starship.y, obstacle.x, obstacle.y);
                if (d < 150) {
                    crewDialogue.trigger('obstacleWarning');
                    obstacleWarningCooldown = 5000;
                    break;
                }
            }
        }

        updateCrewCanvas();
    }
}

function keyPressed() {
    if (keyCode === SHIFT || key === "A") {
        starship.activateWarp();
    }

    if (rescueSignalTriggered) {
        if (key.toUpperCase() === 'Y') {
            acceptRescueMission(currentRescueShipName);
            rescueSignalTriggered = false;
        } else if (key.toUpperCase() === 'N') {
            declineRescueMission(currentRescueShipName);
            rescueSignalTriggered = false;
        }
    }
}

function acceptRescueMission(shipName) {
    rescueInProgress = true;
    gameTime += 30;

    if (difficultyLevel === 'Easy') {
        obstacleSpeed += 0.5;
        obstacleSpawnInterval = Math.max(obstacleSpawnInterval - 5, 30);
    } else if (difficultyLevel === 'Medium') {
        obstacleSpeed += 1;
        obstacleSpawnInterval = Math.max(obstacleSpawnInterval - 5, 20);
    } else if (difficultyLevel === 'Hard') {
        obstacleSpeed += 1.5;
        obstacleSpawnInterval = Math.max(obstacleSpawnInterval - 5, 10);
    }

    crewDialogue.trigger('rescueAccepted', { shipName });
    achievements.rescueMissionsCompleted++;
    checkAchievements();
    rescueInProgress = false;
    rescueSignalTriggered = false;
}

function declineRescueMission(shipName) {
    crewDialogue.trigger('rescueDeclined', { shipName });
    rescueSignalTriggered = false;
}


function unlockAchievement(achievementName) {
    if (!achievements.unlockedAchievements.includes(achievementName)) {
        achievements.unlockedAchievements.push(achievementName);

        // crewDialogue.trigger('achievementUnlocked', { message: achievementName });
        crewDialogue.trigger('achievementUnlocked', { shipName: 'Starfleet Command', message: achievementName });
    }
}


function checkAchievements() {
    if (achievements.rescueMissionsCompleted >= 1) {
        unlockAchievement('Starfleet Honor Medal: Completed 1 rescue mission');
    }
    if (achievements.rescueMissionsCompleted >= 2) {
        unlockAchievement('Federation Valor Medal: Completed 2 rescue missions');
    }
    if (achievements.rescueMissionsCompleted >= 3) {
        unlockAchievement('Starfleet Explorer Medal: Completed 3 rescue missions');
    }
    if (achievements.energyCrystalsCollected >= 10) {
        unlockAchievement('Energy Operator Medal: Collected 10 energy crystals in one mission');
    }
    if (achievements.survivalTimeAchieved === false && survivalTime >= gameTime / 2) {
        achievements.survivalTimeAchieved = true;
        unlockAchievement('Starfleet Survival Medal: Survived halfway through the mission');
    }
    if (achievements.missionCompleted && !achievements.unlockedAchievements.includes('Five-Year Mission Medal: Successfully completed the mission aboard the USS Enterprise NCC-1701.')) {
        unlockAchievement('Five-Year Mission Medal: Successfully completed the mission aboard the USS Enterprise NCC-1701.');
    }
}

function startGame() {

    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameInstructions').style.display = 'block';
    

    gameStarted = true;

    gamePaused = false;
    gameOver = false;
    gameSuccess = false;
    score = 0;

    startTime = millis();
    survivalTime = 0;

    gameTime = int(random(60, 121));
    remainingTime = gameTime;

    obstacles = [];
    energyCrystals = [];
    starship = new Starship();
    crewDialogue = new CrewDialogue();
    frameCount = 0;

    achievements = {
        rescueMissionsCompleted: 0,
        energyCrystalsCollected: 0,
        survivalTimeAchieved: false,
        missionCompleted: false,
        totalHitsTaken: 0,
        unlockedAchievements: []
    };

    isWarpEngineReady = false;
    isShieldBelow50 = false;
    isShieldBelow20 = false;

    rescueSignalGapTime = 30 * 60;

    rescueSignalTriggered = false;
    rescueInProgress = false;
    currentRescueShipName = '';

    if (difficultyLevel === 'Easy') {
        obstacleSpeed = 3;
        obstacleSpawnInterval = 45;
        cristalSpawnInterval = 45;
    } else if (difficultyLevel === 'Medium') {
        obstacleSpeed = 5;
        obstacleSpawnInterval = 30;
        cristalSpawnInterval = 60;
    } else if (difficultyLevel === 'Hard') {
        obstacleSpeed = 7;
        obstacleSpawnInterval = 20;
        cristalSpawnInterval = 80;
    }

    bgMusic.loop();
}

function endGame() {
    gameStarted = false;

    bgMusic.stop();

    localStorage.setItem('lastSurvivalTime', survivalTime);
    localStorage.setItem('lastGameSuccess', gameSuccess);

    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem('highestScore', highestScore);

        localStorage.setItem('lastSurvivalTime', survivalTime);
        localStorage.setItem('lastGameSuccess', gameSuccess);
    }

    localStorage.setItem('totalEnergyCrystalsCollected', totalEnergyCrystalsCollected);

    showEndScreen();
}


function restartGame() {
    document.getElementById('endScreen').style.display = 'none';
    showStartScreen();
}



function returnToMenu() {
    document.getElementById('endScreen').style.display = 'none';
    showStartScreen();
}


function showStartScreen() {
    document.getElementById('startScreen').style.display = 'flex';
    document.getElementById('gameInstructions').style.display = 'none';
}



function showEndScreen() {
    document.getElementById('endScreen').style.display = 'flex';
    document.getElementById('currentScoreDisplay').innerHTML = score;
    document.getElementById('currentSurvivalTimeDisplay').innerHTML = survivalTime;

    if (gameSuccess) {
        document.getElementById('currentGameSuccessDisplay').innerHTML = 'Yes';
        document.getElementById('endTitle').innerHTML = 'Mission Complete';
        document.getElementById('endMessage').innerHTML = 'Congratulations, Captain! You successfully reached the destination.';
    } else {
        document.getElementById('currentGameSuccessDisplay').innerHTML = 'No';
        document.getElementById('endTitle').innerHTML = 'Game Over';
        document.getElementById('endMessage').innerHTML = 'Unfortunately, your starship was destroyed.';
    }

    let achievementsList = document.getElementById('endAchievementsList');
    achievementsList.innerHTML = '';

    if (achievements.unlockedAchievements.length > 0) {
        for (let i = 0; i < achievements.unlockedAchievements.length; i++) {
            let achievement = achievements.unlockedAchievements[i];
            let listItem = document.createElement('li');
            listItem.innerHTML = achievement;
            achievementsList.appendChild(listItem);
        }
    } else {
        let listItem = document.createElement('li');
        listItem.innerHTML = 'None';
        achievementsList.appendChild(listItem);
    }

    let damageReport = document.getElementById('damageReport');
    damageReport.innerHTML = 'Asteroid Collisions: ' + achievements.totalHitsTaken;

    if (achievements.totalHitsTaken > 5) {
        let damageReportMessage = document.getElementById('damageReportMessage');
        damageReportMessage.innerHTML = 'Our helmsman needs retraining at Starfleet Academy!';
    } else {
        let damageReportMessage = document.getElementById('damageReportMessage');
        damageReportMessage.innerHTML = '';
    }

    let totalCrystalsCollectedDisplay = document.getElementById('totalCrystalsCollected');
    totalCrystalsCollectedDisplay.innerHTML = 'Total energy crystals collected: ' + totalEnergyCrystalsCollected;
}

function updateControlPanel() {
    document.getElementById('shieldBar').value = starship.shieldValue;
    document.getElementById('shieldValue').innerHTML = starship.shieldValue + '%';
    document.getElementById('remainingTime').innerHTML = remainingTime + ' seconds';

    if (starship.isWarping) {
        let warpRemainingSeconds = int((starship.warpDuration - (millis() - starship.warpStartTime)) / 1000);
        document.getElementById('warpState').innerHTML = 'Warping (remaining ' + warpRemainingSeconds + ' seconds)';
    } else if (starship.warpCooldown > 0) {
        let cooldownSeconds = int(starship.warpCooldown / 1000);
        document.getElementById('warpState').innerHTML = 'Cooldown (remaining ' + cooldownSeconds + ' seconds)';
    } else {
        document.getElementById('warpState').innerHTML = 'Ready for Activation';
    }

    document.getElementById('currentScore').innerHTML = score;
    document.getElementById('highestScoreDisplay').innerHTML = highestScore;
}

function togglePause() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        noLoop();
        bgMusic.pause();
        document.getElementById('pauseButton').innerHTML = 'Resume Exploration';
    } else {
        loop();
        bgMusic.loop();
        document.getElementById('pauseButton').innerHTML = 'Pause Exploration';
    }
}

function clearHistory() {
    localStorage.removeItem('highestScore');
    localStorage.removeItem('totalEnergyCrystalsCollected');
    highestScore = 0;
    totalEnergyCrystalsCollected = 0;
    document.getElementById('highestScoreDisplay').innerHTML = highestScore;
    alert('History cleared');
}

function activateWarp() {
    starship.activateWarp();
}

function updateCrewCanvas() {
    let crewData = {
        dialogues: crewDialogue.dialogues,
        achievements: achievements.unlockedAchievements
    };
    let iframe = document.querySelector('#crewCanvasContainer iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(crewData, '*');
    }
}

function selectDifficulty(level) {
    difficultyLevel = level;
    startGame();
}