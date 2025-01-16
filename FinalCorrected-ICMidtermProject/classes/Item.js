class Item {
    constructor(id, name, type, description, sprite) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.sprite = sprite;

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
        null
    ),
    'wheat': new Item(
        'wheat',
        'Wheat',
        'crop',
        'Golden waves of grain, ready to harvest',
        null
    ),
    'ghost_sprout': new Item(
        'ghost_sprout',
        'Ghost Sprout',
        'crop',
        'A translucent mysterious crop that seems to emit a faint glow...',
        null
    ),
    'sixteenth_note': new Item(
        'sixteenth_note',
        'Sixteenth Note',
        'music_note',
        'A mysterious sixteenth note, you can almost hear ghostly whispers...',
        null
    ),
    'eighth_note': new Item(
        'eighth_note',
        'Eighth Note',
        'music_note',
        'An eighth note formed by two sixteenth notes, carrying ghostly songs...',
        null
    ),
    'quarter_note': new Item(
        'quarter_note',
        'Quarter Note',
        'music_note',
        'A quarter note formed by two eighth notes, you can hear a complete ghostly movement...',
        null
    ),
    'carrot': new Item(
        'carrot',
        'Carrot',
        'crop',
        'A normal carrot...',
        null
    )
};

function updateItemSprites() {
    itemsDatabase['corn'].sprite = cropSprites.corn[6];
    itemsDatabase['wheat'].sprite = cropSprites.wheat[5];
    itemsDatabase['carrot'].sprite = loadImage('js/images/crops/carrotIcon.png');
    
    itemsDatabase['sixteenth_note'].sprite = cropSprites.ghostSprout[3]; 
    itemsDatabase['eighth_note'].sprite = cropSprites.ghostSprout[4];
    itemsDatabase['quarter_note'].sprite = cropSprites.ghostSprout[5];
}