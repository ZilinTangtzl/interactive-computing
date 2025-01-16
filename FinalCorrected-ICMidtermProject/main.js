
let debugMode = false;  



let showCoordinates = false; 
let coordinatesX = 0;
let coordinatesY = 0; 
let viewFieldBorder = false;


let player;
let level, levelHitMap;
let currentMap_img;

let fields = []; 

const tileSize = 32;

let playerSprite;
let cropSprites;
let ghostSprite;
let spriteSheet;
let playerSprites = {};

let startX = 200;
let startY = 200;
let gameManager;

const cropsConfig = {
    'corn': {
        maxGrowthStage: 5,
        growthTimePerStage: 3000
    },
    'wheat': {
        maxGrowthStage: 5,
        growthTimePerStage: 2500
    },
    'ghostSprout': {
        maxGrowthStage: 2,
        growthTimePerStage: 6000 
    }
};

let playerInventory;

let cameraX = 0;
let cameraY = 0;

function preload() {

    level = loadImage('js/level612.png');

    levelHitMap = loadImage('js/level_hitmap612_8.png');

    playerSprite = loadImage('js/images/player/front1.png');


    cropSprites = {
        'corn': [
            loadImage('js/images/crops/corn_chopped/corn1.png'), 
            loadImage('js/images/crops/corn_chopped/corn2.png'),  
            loadImage('js/images/crops/corn_chopped/corn3.png'),  
            loadImage('js/images/crops/corn_chopped/corn4.png'),  
            loadImage('js/images/crops/corn_chopped/corn5.png'),  
            loadImage('js/images/crops/corn_chopped/corn6.png'), 
            loadImage('js/images/crops/corn_chopped/corn7.png'), 
        ],
        'wheat': [
            loadImage('js/images/crops/wheat_chopped/wheat_00.png'),
            loadImage('js/images/crops/wheat_chopped/wheat_01.png'),
            loadImage('js/images/crops/wheat_chopped/wheat_02.png'),
            loadImage('js/images/crops/wheat_chopped/wheat_03.png'),
            loadImage('js/images/crops/wheat_chopped/wheat_04.png'),
            loadImage('js/images/crops/wheat_chopped/wheat_05.png'),
        ],
        'ghostSprout': [
            loadImage('js/images/crops/ghostSprout/ghost_sprout_1.png'),
            loadImage('js/images/crops/ghostSprout/ghost_sprout_2.png'),
            loadImage('js/images/crops/ghostSprout/ghost_sprout_3.png'),
            loadImage('js/images/crops/ghostSprout/ghost_sprout_4.png'),
            loadImage('js/images/crops/ghostSprout/ghost_sprout_5.png'),
            loadImage('js/images/crops/ghostSprout/ghost_sprout_6.png'),
        ],
        'carrot': [
            loadImage('js/images/crops/carrotIcon.png'),
        ]
    };




    playerSprites['up'] = [
        loadImage('js/images/player/back1.png'),
        loadImage('js/images/player/back2.png'),
        loadImage('js/images/player/back3.png')
    ];
    playerSprites['down'] = [
        loadImage('js/images/player/front1.png'),
        loadImage('js/images/player/front2.png'),
        loadImage('js/images/player/front3.png')
    ];
    playerSprites['left'] = [
        loadImage('js/images/player/left1.png'),
        loadImage('js/images/player/left2.png'),
        loadImage('js/images/player/left3.png')
    ];
    playerSprites['right'] = [
        loadImage('js/images/player/right1.png'),
        loadImage('js/images/player/right2.png'),
        loadImage('js/images/player/right3.png')
    ];

    updateItemSprites();
}

function setup() {
    createCanvas(800, 612);

    if (!areAllResourcesLoaded()) {
        setTimeout(checkAndInitialize, 100);
        return;
    }

    initializeGameComponents();
}

function areAllResourcesLoaded() {
    if (!level || !level.width) return false;
    if (!levelHitMap || !levelHitMap.width) return false;
    if (!playerSprite || !playerSprite.width) return false;

    for (let cropType in cropSprites) {
        for (let sprite of cropSprites[cropType]) {
            if (!sprite || !sprite.width) return false;
        }
    }

    return true;
}

function checkAndInitialize() {
    if (areAllResourcesLoaded()) {
        initializeGameComponents();
    } else {
        setTimeout(checkAndInitialize, 100);
    }
}

function initializeGameComponents() {
    currentMap_img = level;
    player = new Player(startX, startY, playerSprites);
    playerInventory = new Inventory();
    gameManager = new GameManager();

    gameManager.checkNewGame();

    initializeGame();
}

function initializeGame() {
    fields = [
        new Field(108, 330, 50),  
        new Field(158, 330, 50),
        new Field(208, 330, 50),
        new Field(258, 330, 50),

        new Field(108, 380, 50), 
        new Field(158, 380, 50),
        new Field(208, 380, 50),
        new Field(258, 380, 50),

        new Field(108, 430, 50),  
        new Field(158, 430, 50),
        new Field(208, 430, 50),
        new Field(258, 430, 50),
        new Field(308, 430, 50),

        new Field(208, 480, 50), 
        new Field(258, 480, 50),
        new Field(308, 480, 50)
    ];



    if (gameManager.isNewGame) {
        player.dialogBox.showTutorial();
        initializeStartingCrops();
    } else {
        if (localStorage.getItem('ghostFarmSave')) {
            if (confirm('detect save data, load?')) {
                gameManager.loadGame();
            } else {
                player.dialogBox.showTutorial();
                initializeStartingCrops();
            }
        } else {
            player.dialogBox.showTutorial();
            initializeStartingCrops();
        }
    }
}

function initializeStartingCrops() {
    fields[0].plant('corn');
    fields[1].plant('corn');
    fields[2].plant('corn');
}

function draw() {
    if (!gameManager || !gameManager.seasons) {
        console.error('GameManager or seasons not properly initialized');
        return;
    }

    gameManager.update();

    cameraX = constrain(player.x - width / 2, 0, level.width - width);
    cameraY = constrain(player.y - height / 2, 0, level.height - height);

    push();
    translate(-cameraX, -cameraY);

    image(currentMap_img, 0, 0);

    for (let field of fields) {
        field.update();
        field.display();
    }

    player.moveAndDisplay();

    pop();

    gameManager.displayGameInfo();

    playerInventory.display();

    player.update();

    if (showCoordinates) {
        let worldX = mouseX + cameraX;
        let worldY = mouseY + cameraY;
        fill(255, 0, 0);
        text(`X: ${worldX}, Y: ${worldY}`, mouseX, mouseY - 10);
        stroke(255, 0, 0);
        line(mouseX - 5, mouseY, mouseX + 5, mouseY);
        line(mouseX, mouseY - 5, mouseX, mouseY + 5);
    }
}


function keyPressed() {
    if (key === '1') {
        player.currentAction = 'plant';
        console.log('Action: Plant');
    } else if (key === '2') {
        player.currentAction = 'water';
        console.log('Action: Water');
    } else if (key === '3') {
        player.currentAction = 'harvest';
        console.log('Action: Harvest');
    } else if (key === 'Shift') {
        player.action(); 
    } else if (key === 'd' || key === 'D') {
        debugMode = !debugMode;  
    } else if (key === 'v' || key === 'V') {
        viewFieldBorder = !viewFieldBorder;
    } else if (key === 'i' || key === 'I') {
        playerInventory.toggleDisplay();
    } else if (key === 's' || key === 'S') {
        gameManager.saveGame();
        player.tipBox.show("游戏已保存！");
    } else if (key === 'r' || key === 'R') {
        gameManager.removeStorage();  
    } else if (key === 'b' || key === 'B') {
        player.openShop();
    } else if (key === 'c' || key === 'C') {
        const crops = ['corn', 'wheat'];
        let currentIndex = crops.indexOf(player.selectedCrop);
        player.selectedCrop = crops[(currentIndex + 1) % crops.length];
        player.tipBox.show(`Selected crop: ${player.selectedCrop}`);
    }

    if (key == 'X' || key == 'x') {
        if (currentMap_img == level) {
            currentMap_img = levelHitMap;
        }
        else {
            currentMap_img = level;
        }
    }
}

function mouseClicked() {
    player.dialogBox.checkClick(mouseX, mouseY);
    playerInventory.handleMouseClick(mouseX, mouseY);
}


