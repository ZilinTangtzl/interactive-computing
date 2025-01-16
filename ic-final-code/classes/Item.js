class Item {
    constructor(id, name, type, description, sprite, price = 0, canBeSold = true) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.sprite = sprite;

        this.price = price;          
        this.canBeSold = canBeSold;  
    }

    display(x, y, size) {
        if (this.sprite) {
            image(this.sprite, x, y, size, size);
        }
    }
}

const itemsDatabase = {
    'corn': new Item(
        'corn',
        'Corn',
        'crop',
        'Golden yellow corn, emitting a sweet scent of sunlight',
        null,
        25,     
        true    
    ),
    'wheat': new Item(
        'wheat',
        'Wheat',
        'crop',
        'Golden waves of grain, ready to harvest',
        null,
        20,     
        true    
    ),
    'energy_potion': new Item(
        'energy_potion',
        'Energy Potion',
        'consumable',
        'Restores 50 energy',
        null,
        20,     
        false  
    ),
    'beetroot': new Item(
        'beetroot',
        'Beetroot',
        'crop',
        'A deep purple beetroot, rich in nutrients and flavor',
        null,
        30,     
        true    
    ),
    'ghost_sprout': new Item(
        'ghost_sprout',
        'Ghost Sprout',
        'crop',
        'A translucent mysterious crop that seems to emit a faint glow...',
        null,
        50,     
        false   
    ),
    'sixteenth_note': new Item(
        'sixteenth_note',
        'Sixteenth Note',
        'music_note',
        'A mysterious sixteenth note, you can almost hear ghostly whispers...',
        null,
        100,    
        false   
    ),
    'eighth_note': new Item(
        'eighth_note',
        'Eighth Note',
        'music_note',
        'An eighth note formed by two sixteenth notes, carrying ghostly songs...',
        null,
        200,    
        false   
    ),
    'quarter_note': new Item(
        'quarter_note',
        'Quarter Note',
        'music_note',
        'A quarter note formed by two eighth notes, you can hear a complete ghostly movement...',
        null,
        400,    
        false   
    ),
    'carrot': new Item(
        'carrot',
        'Carrot',
        'crop',
        'A normal carrot, crisp and fresh',
        null,
        15,     
        true    
    ),
    'beetroot': new Item(
        'beetroot',
        'Beetroot',
        'crop',
        'A deep purple beetroot, rich in nutrients and flavor',
        null,
        30,     
        true    
    ),
    'cauliflower': new Item(
        'cauliflower',
        'Cauliflower',
        'crop',
        'A white cauliflower, rich in nutrients and flavor',
        null,
        35,     
        true    
    ),
    //种子也放进来吧 商店可以买作物但农夫应该是买种子卖作物 
    // 如果从商店买作物 比如买wheat的价格是20 那卖给商店wheat只能收到12 
    // 中间商赚差价... 
    'corn_seeds': new Item(
        'corn_seeds',
        'Corn Seeds',
        'seed',
        'Plant these to grow corn',
        null,
        12,    
        false  // 种子不能卖回商店
    ),
    'wheat_seeds': new Item(
        'wheat_seeds',
        'Wheat Seeds',
        'seed',
        'Plant these to grow wheat',
        null,
        10,    
        false
    ),
    'beetroot_seeds': new Item(
        'beetroot_seeds',
        'Beetroot Seeds',
        'seed',
        'Plant these to grow beetroots',
        null,
        15,    
        false
    ),
    'cauliflower_seeds': new Item(
        'cauliflower_seeds',
        'Cauliflower Seeds',
        'seed',
        'Plant these to grow cauliflowers',
        null,
        20,    
        false
    )
};

function updateItemSprites() {
    itemsDatabase['corn'].sprite = cropSprites.corn[6];
    itemsDatabase['wheat'].sprite = cropSprites.wheat[5];
    itemsDatabase['carrot'].sprite = loadImage('js/images/crops/carrotIcon.png');
    
    itemsDatabase['sixteenth_note'].sprite = cropSprites.ghostSprout[3]; 
    itemsDatabase['eighth_note'].sprite = cropSprites.ghostSprout[4];
    itemsDatabase['quarter_note'].sprite = cropSprites.ghostSprout[5];
    itemsDatabase['beetroot'].sprite = cropSprites.beetroot[5];
    itemsDatabase['cauliflower'].sprite = cropSprites.cauliflower[5];
    
    itemsDatabase['corn_seeds'].sprite = shopItemSprites.corn_seed;
    itemsDatabase['wheat_seeds'].sprite = shopItemSprites.wheat_seed;
    itemsDatabase['beetroot_seeds'].sprite = shopItemSprites.beetroot_seed;
    itemsDatabase['cauliflower_seeds'].sprite = shopItemSprites.cauliflower_seed;
    itemsDatabase['energy_potion'].sprite = shopItemSprites.energy_potion;
}