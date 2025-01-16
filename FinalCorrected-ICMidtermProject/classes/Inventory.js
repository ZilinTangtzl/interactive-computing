class Inventory {
    constructor(size = 20) {
        this.size = size;
        this.items = {};
        this.selectedSlot = 0;
        this.isVisible = false;
        
        this.musicNotes = {
            sixteenth: 0,  
            eighth: 0,    
            quarter: 0,   
            achievement: false
        };
    }

    toggleDisplay() {
        this.isVisible = !this.isVisible;
    }

    display() {
        if (!this.isVisible) {
            return;
        }

        fill(0, 0, 0, 150);
        rect(0, 0, width, height);

        const cols = 5;
        const slotSize = 64;
        const padding = 10;
        const startX = (width - (cols * slotSize + (cols - 1) * padding)) / 2;
        const startY = (height - (Math.ceil(this.size / cols) * slotSize + (Math.ceil(this.size / cols) - 1) * padding)) / 2;

        let index = 0;
        for (let y = 0; y < Math.ceil(this.size / cols); y++) {
            for (let x = 0; x < cols; x++) {
                const slotX = startX + x * (slotSize + padding);
                const slotY = startY + y * (slotSize + padding);

                fill(255, 200);
                stroke(200);
                rect(slotX, slotY, slotSize, slotSize, 5);

                const itemIds = Object.keys(this.items);
                if (index < itemIds.length) {
                    const itemId = itemIds[index];
                    const item = itemsDatabase[itemId];
                    const quantity = this.items[itemId];

                    if (item.sprite) {
                        image(item.sprite, slotX + 5, slotY + 5, slotSize - 10, slotSize - 10);
                    }

                    fill(0);
                    textSize(16);
                    textAlign(RIGHT, BOTTOM);
                    text(`x${quantity}`, slotX + slotSize - 6, slotY + slotSize - 6);
                }
                index++;
                if (index >= this.size) {
                    break;
                }
            }
            if (index >= this.size) {
                break;
            }
        }

        this.displayMusicNotesSection();
    }

    displayMusicNotesSection() {
        if (!this.isVisible) {
            return;
        }

        const startY = height - 150;  
        
        fill(0, 0, 0, 100);
        noStroke();
        rect(0, startY, width, 150);

        textFont('OldLondon');
        textAlign(CENTER, TOP);
        fill(242, 215, 153, 240); 
        textSize(20);
        text("Music Notes", width/2, startY + 10);

        textFont('PixelNoir');

        const centerX = width/2;
        const noteY = startY + 50;
        const noteSpacing = 140;  
        
        const firstNoteX = centerX - noteSpacing;
        
        this.displayNoteWithCount(firstNoteX, noteY, cropSprites.ghostSprout[3], this.musicNotes.sixteenth);  
        this.displayNoteWithCount(centerX, noteY, cropSprites.ghostSprout[4], this.musicNotes.eighth);       
        this.displayNoteWithCount(centerX + noteSpacing, noteY, cropSprites.ghostSprout[5], this.musicNotes.quarter); 

        if (this.musicNotes.achievement) {
            textAlign(CENTER, BOTTOM);
            fill(242, 215, 153, 240);
            textSize(15);
            text("✧ Music Master ✧", width/2, height - 10);
        }
    }

    displayNoteWithCount(x, y, sprite, count) {
        const noteSize = 48;
        if (sprite) {
            image(sprite, x - noteSize/2, y, noteSize, noteSize);
            fill(242, 215, 153, 240);
            textAlign(CENTER, CENTER);
            textFont('PixelNoir');
            textSize(12);
            text(`x${count}`, x, y + noteSize + 15);
        }
    }

    addItem(itemId, amount = 1) {
        const item = itemsDatabase[itemId];
        if (!item) {
            return false;
        }

        if (!this.items[itemId]) {
            this.items[itemId] = 0;
        }

        this.items[itemId] += amount;
        return true;
    }

    removeItem(itemId, amount = 1) {
        if (!this.items[itemId] || this.items[itemId] < amount) {
            return false;
        }

        const item = itemsDatabase[itemId];
        this.items[itemId] -= amount;

        if (this.items[itemId] === 0) {
            delete this.items[itemId];
        }

        return true;
    }

    hasItem(itemId, amount = 1) {
        return this.items[itemId] && this.items[itemId] >= amount;
    }

    handleMouseClick(mouseX, mouseY) {
        if (!this.isVisible) return;

        const cols = 5;
        const slotSize = 64;
        const padding = 10;
        const startX = (width - (cols * slotSize + (cols - 1) * padding)) / 2;
        const startY = (height - (Math.ceil(this.size / cols) * slotSize + (Math.ceil(this.size / cols) - 1) * padding)) / 2;

        const itemIds = Object.keys(this.items);

        let index = 0;
        for (let y = 0; y < Math.ceil(this.size / cols); y++) {
            for (let x = 0; x < cols; x++) {
                const slotX = startX + x * (slotSize + padding);
                const slotY = startY + y * (slotSize + padding);

                if (mouseX >= slotX && mouseX <= slotX + slotSize && mouseY >= slotY && mouseY <= slotY + slotSize) {
                    if (index < itemIds.length) {
                        const itemId = itemIds[index];
                        const item = itemsDatabase[itemId];

                        if (item.type === 'consumable') {
                            if (itemId === 'energy_potion') {
                                player.energy = min(player.energy + 50, player.maxEnergy);
                                this.removeItem(itemId, 1);
                                player.tipBox.show("You used an Energy Potion!");
                            }
                        } else {
                            player.tipBox.show(`It's a ${item.name}.`);
                        }
                    }
                    this.selectedSlot = index;
                    return;
                }

                index++;
                if (index >= this.size) break;
            }
            if (index >= this.size) break;
        }
    }

    addGhostNote(noteType) {
        if (noteType === 4) {
            this.musicNotes.sixteenth++;
            player.tipBox.show("*Obtained a mysterious sixteenth note!*");
        } else if (noteType === 5) {
            this.musicNotes.eighth++;
            player.tipBox.show("*Obtained a mysterious eighth note!*");
        } else if (noteType === 6) {
            this.musicNotes.quarter++;
            player.tipBox.show("*Obtained a mysterious quarter note!*");
        }
        
        this.tryToCombineNotes();
    }

    tryToCombineNotes() {
        this.checkAndCombineSixteenthNotes();
        this.checkAndCombineEighthNotes();
        this.checkForAchievement();
    }

    checkAndCombineSixteenthNotes() {
        while (this.musicNotes.sixteenth >= 2) {
            this.musicNotes.sixteenth = this.musicNotes.sixteenth - 2;
            this.musicNotes.eighth = this.musicNotes.eighth + 1;
            player.tipBox.show("*Two sixteenth notes combined into an eighth note!*");
        }
    }

    checkAndCombineEighthNotes() {
        while (this.musicNotes.eighth >= 2) {
            this.musicNotes.eighth = this.musicNotes.eighth - 2;
            this.musicNotes.quarter = this.musicNotes.quarter + 1;
            player.tipBox.show("*Two eighth notes combined into a quarter note!*");
        }
    }

    checkForAchievement() {
        if (this.musicNotes.quarter >= 4 && !this.musicNotes.achievement) {
            this.musicNotes.quarter = this.musicNotes.quarter - 4;
            this.musicNotes.achievement = true;
            player.tipBox.show("*Four quarter notes composed a complete movement! Earned the title - Music Master!*");
            gameManager.addGold(500);
        }
    }
}



