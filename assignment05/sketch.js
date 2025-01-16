
class IceCream {
    constructor(world, x, y, z) {
        this.world = world;
        this.x = x;
        this.y = y;
        this.z = z;
        this.model = null;
        this.isSpinning = false;
        this.spinSpeed = 1;
    }

    create() {
        this.model = new AFrameP5.OBJ({
            asset: 'icecream_obj',
            mtl: 'icecream_mtl',
            x: this.x,
            y: this.y,
            z: this.z,
            scaleX: 0.005,
            scaleY: 0.005,
            scaleZ: 0.005,
            rotationX: 0,
            rotationY: 180,
            rotationZ: 0,
            clickFunction: () => {
                this.startSpinning();
            }
        });
        this.world.add(this.model);
    }

    startSpinning() {
        this.isSpinning = true;
    }

    stopSpinning() {
        this.isSpinning = false;
    }

    update() {
        if (this.isSpinning) {
            this.model.rotateY(this.spinSpeed);
        }
    }
}

let world;
let buffer; 
let collectedItems = 0; 
const totalItems = 5; 
let ringsCollected = 0; 
const requiredRings = 3; 
let iceCream; 

function setup() {
    noCanvas();

    world = new AFrameP5.World('VRScene');
    world.setBackground(173, 216, 230); 

    let ground = new AFrameP5.Plane({
        x: 0, y: 0, z: 0,
        width: 100, height: 100,
        asset: 'ice',
        rotationX: -90
    });
    world.add(ground);

    let sky = new AFrameP5.Sky({
        asset: 'sky'
    });
    world.add(sky);

    let floatingPlatform = new AFrameP5.Box({
        x: 0, y: 5, z: -10,
        width: 5, height: 0.2, depth: 5,
        red: 255, green: 165, blue: 0,
        clickFunction: function () {
            if (ringsCollected === requiredRings) {
                world.setUserPosition(0, 5.5, -10); 
                buffer.clear();
                buffer.background(0, 255, 0);
                buffer.fill(0);
                buffer.text('Mission Complete!\nEnjoy your Ice Cream!', 256, 256);            
            }
        }
    });
    world.add(floatingPlatform);

    iceCream = new IceCream(world, 0, 8, -10);
    iceCream.create();

    buffer = createGraphics(512, 512);
    buffer.textSize(32);
    buffer.textAlign(CENTER, CENTER);
    updateHUD();

    let hudPlane = new AFrameP5.Plane({
        x: 0,
        y: 2,
        z: -3,
        dynamicTexture: true,
        dynamicTextureWidth: 512,
        dynamicTextureHeight: 512,
        asset: world.createDynamicTextureFromCreateGraphics(buffer)
    });
    world.addToHUD(hudPlane);

    addCollectibleItems();
}

function addCollectibleItems() {
    for (let i = 0; i < totalItems; i++) {
        let item = new AFrameP5.Sphere({
            x: random(-10, 10), y: 1, z: random(-10, 10),
            radius: 0.5,
            red: 255, green: 223, blue: 0, 
            clickFunction: function (entity) {
                world.remove(entity); 
                collectedItems++;
                updateHUD();
                if (collectedItems === totalItems) {
                    addRingWithBlueSphere(); 
                }
            }
        });
        world.add(item);
    }
}

function addRingWithBlueSphere() {
    let userPos = world.getUserPosition();
    let ringX = userPos.x;
    let ringY = 2;
    let ringZ = userPos.z - 5;

    let ringContainer = new AFrameP5.Container3D({
        x: ringX,
        y: ringY,
        z: ringZ
    });

    let greenRing = new AFrameP5.Ring({
        x: 0, y: 0, z: 0,
        radiusInner: 0.5,
        radiusOuter: 1,
        red: 0, green: 255, blue: 0
    });

    let blueSphere = new AFrameP5.Sphere({
        x: 0, y: 0, z: 0,
        radius: 0.3,
        red: 0, green: 0, blue: 255,
        clickFunction: function () {
            world.remove(ringContainer);
            ringsCollected++;
            updateHUD();

            if (ringsCollected === requiredRings) {
                buffer.text('Go to the Platform.', 256, 450);
            } else {
                collectedItems = 0;
                addCollectibleItems();
            }
        }
    });

    ringContainer.addChild(greenRing);
    ringContainer.addChild(blueSphere);
    world.add(ringContainer);
}

function updateHUD() {
    buffer.clear();
    buffer.background(255);
    buffer.fill(0);
    buffer.textAlign(CENTER, CENTER);

    if (collectedItems === 0 && ringsCollected === 0) {
        buffer.textSize(28);
        buffer.text('Use WASD keys to move', 256, 50);
        buffer.text('Collect golden spheres to start', 256, 110);
        buffer.text('Each cycle collect 5 spheres', 256, 170);
        buffer.text('Then collect the sphere in ring', 256, 230);
        buffer.text('You need to complete 3 cycles', 256, 280);
        buffer.text('Then go to the platform', 256, 340);
        buffer.text('And enjoy your Ice Cream!', 256, 400);
    } else {
        buffer.textSize(32);
        buffer.text('Collected: ' + collectedItems + '/' + totalItems, 256, 200);
        buffer.text('Rings: ' + ringsCollected + '/' + requiredRings, 256, 300);

        if (collectedItems === totalItems) {
            buffer.text('A new Ring with Blue Sphere', 256, 400);
        } else if (ringsCollected === requiredRings) {
            buffer.text('Go to the Platform!', 256, 400);
        } else {
        }
    }
}

function draw() {
    if (keyIsDown(87)) {
        world.moveUserForward(0.1); // s
    }
    if (keyIsDown(83)) {
        world.moveUserBackward(0.1); // s
    }
    if (keyIsDown(65)) {
        world.moveUserLeft(0.1); // a
    }
    if (keyIsDown(68)) {
        world.moveUserRight(0.1); // d
    }

    if (iceCream) {
        iceCream.update();
    }
}


