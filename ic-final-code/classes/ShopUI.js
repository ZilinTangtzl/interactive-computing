class ShopUI {
    constructor() {
        this.isVisible = false;
        this.selectedTab = 'buy';  // 'buy' or 'sell'
        
        this.x = 100;
        this.y = 100;
        this.width = 600;
        this.height = 400;
        this.padding = 20;
        
        this.gridCols = 4;
        this.slotSize = 64;
        this.slotPadding = 10;
        
        this.scrollOffset = 0;
        this.maxScroll = 0;
        
        this.selectedItem = null;
        
        this.closeButtonSize = 20;
        this.closeButtonX = this.x + 10;
        this.closeButtonY = this.y + 10;
    }

    display() {
        if (!this.isVisible) return;
        
        push();
        fill(0, 0, 0, 200);
        rect(this.x, this.y, this.width, this.height, 10);
        
        fill(255);
        textSize(24);
        textAlign(CENTER, TOP);
        text("Village Shop", this.x + this.width/2 + 15, this.y + 20);
        
        this.displayTabs();
        
        this.displayItems();
        
        if (this.selectedItem) {
            this.displayItemDetails();
        }
        
        this.displayGoldInfo();
        
        fill(255, 100, 100,100);  // 红色按钮
        rect(this.closeButtonX, this.closeButtonY, 
             this.closeButtonSize, this.closeButtonSize, 5);
        
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(20);
        text('×', this.closeButtonX + this.closeButtonSize/2, 
             this.closeButtonY + this.closeButtonSize/2);
        
        pop();
    }

    displayTabs() {
        let tabWidth = 100;
        let tabHeight = 30;
        let tabY = this.y + 60;
        
        let buyX = this.x + this.padding;
        let buyColor;
        if (this.selectedTab === 'buy') {
            buyColor = '#4a4a4a';
        } else {
            buyColor = '#2a2a2a';
        }
        fill(buyColor);
        rect(buyX, tabY, tabWidth, tabHeight, 5);
        fill(255);
        textAlign(CENTER, CENTER);
        text("Buy", buyX + tabWidth/2, tabY + tabHeight/2);
        
        let sellX = buyX + tabWidth + 10;
        let sellColor;
        if (this.selectedTab === 'sell') {
            sellColor = '#4a4a4a';
        } else {
            sellColor = '#2a2a2a';
        }
        fill(sellColor);
        rect(sellX, tabY, tabWidth, tabHeight, 5);
        fill(255);
        text("Sell", sellX + tabWidth/2, tabY + tabHeight/2);
    }

    displayItems() {
        let startY = this.y + 100;
        let startX = this.x + this.padding;
        
        let items;
        if (this.selectedTab === 'buy') {
            items = this.getBuyableItems();
        } else {
            items = this.getSellableItems();
        }
        
        for (let i = 0; i < items.length; i++) {
            let row = Math.floor(i / this.gridCols);
            let col = i % this.gridCols;
            let itemX = startX + col * (this.slotSize + this.slotPadding);
            let itemY = startY + row * (this.slotSize + this.slotPadding) - this.scrollOffset;
            
            this.displayItemSlot(items[i], itemX, itemY);
        }
    }

    displayItemSlot(item, x, y) {
        fill(60);
        rect(x, y, this.slotSize, this.slotSize, 5);
        
        if (item.sprite) {
            image(item.sprite, x + 5, y + 5, this.slotSize - 10, this.slotSize - 10);
        }
        
        fill(255);
        textAlign(RIGHT, BOTTOM);
        textSize(12);
        text(`${this.getItemPrice(item)} Gold`, x + this.slotSize - 5, y + this.slotSize - 5);
    }

    displayItemDetails() {
        let detailX = this.x + this.width - 200;
        let detailY = this.y + 100;
        
        fill(40);
        rect(detailX, detailY, 180, 250, 5);
        
        fill(255);
        textAlign(LEFT, TOP);
        textSize(16);
        text(this.selectedItem.name, detailX + 10, detailY + 10);
        
        textSize(12);
        text(this.selectedItem.description, detailX + 10, detailY + 40, 160);
        
        this.displayActionButton();
    }

    displayGoldInfo() {
        fill(255);
        textAlign(RIGHT, TOP);
        textSize(16);
        text("Gold: " + gameManager.gold, this.x + this.width - 20, this.y + 20);
    }

    handleClick(mouseX, mouseY) {
        if (!this.isVisible) return;
        
        if (mouseX >= this.closeButtonX && 
            mouseX <= this.closeButtonX + this.closeButtonSize &&
            mouseY >= this.closeButtonY && 
            mouseY <= this.closeButtonY + this.closeButtonSize) {
            this.isVisible = false;
            return;
        }
        
        if (mouseX < this.x || mouseX > this.x + this.width ||
            mouseY < this.y || mouseY > this.y + this.height) {
            this.isVisible = false;
            return;
        }
        
        this.handleTabClick(mouseX, mouseY);
        
        this.handleItemClick(mouseX, mouseY);
        
        if (this.selectedItem) {
            this.handleButtonClick(mouseX, mouseY);
        }
    }

    getBuyableItems() {
        return Object.entries(shop.inventory)
            .filter(function(entry) {
                return entry[1].type === 'sell';
            })
            .map(function(entry) {
                return itemsDatabase[entry[0]];
            });
    }

    getSellableItems() {
        console.log("Current inventory:", playerInventory.items);
        
        const sellableItems = Object.entries(playerInventory.items)
            .filter(function(entry) {
                const itemId = entry[0];
                const item = itemsDatabase[itemId];
                const canBeSold = item && item.canBeSold;
                
                console.log(`Item ${itemId}: canSell=${canBeSold}`);
                
                return canBeSold;
            })
            .map(function(entry) {
                return itemsDatabase[entry[0]];
            });
        
        console.log("Sellable items:", sellableItems);
        
        return sellableItems;
    }

    getItemPrice(item) {
        if (this.selectedTab === 'buy') {
            return shop.getBuyingPrice(item.id);
        } else {
            return shop.getSellingPrice(item.id);
        }
    }

    toggle() {
        this.isVisible = !this.isVisible;
        this.selectedItem = null;
        this.scrollOffset = 0;
    }

    handleTabClick(mouseX, mouseY) {
        let tabWidth = 100;
        let tabHeight = 30;
        let tabY = this.y + 60;
        let buyX = this.x + this.padding;
        let sellX = buyX + tabWidth + 10;

        if (mouseX >= buyX && mouseX <= buyX + tabWidth &&
            mouseY >= tabY && mouseY <= tabY + tabHeight) {
            this.selectedTab = 'buy';
            this.selectedItem = null;
            return true;
        }

        if (mouseX >= sellX && mouseX <= sellX + tabWidth &&
            mouseY >= tabY && mouseY <= tabY + tabHeight) {
            this.selectedTab = 'sell';
            this.selectedItem = null;
            return true;
        }

        return false;
    }

    handleItemClick(mouseX, mouseY) {
        let startY = this.y + 100;
        let startX = this.x + this.padding;
        
        let items;
        if (this.selectedTab === 'buy') {
            items = this.getBuyableItems();
        } else {
            items = this.getSellableItems();
        }

        for (let i = 0; i < items.length; i++) {
            let row = Math.floor(i / this.gridCols);
            let col = i % this.gridCols;
            let x = startX + col * (this.slotSize + this.slotPadding);
            let y = startY + row * (this.slotSize + this.slotPadding);

            if (mouseX >= x && mouseX <= x + this.slotSize &&
                mouseY >= y && mouseY <= y + this.slotSize) {
                this.selectedItem = items[i];
                return true;
            }
        }

        return false;
    }

    handleButtonClick(mouseX, mouseY) {
        if (!this.selectedItem) return false;

        let buttonX = this.x + this.width - 180;
        let buttonY = this.y + 300;
        let buttonWidth = 160;
        let buttonHeight = 30;

        if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
            mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
            
            if (this.selectedTab === 'sell') {
                let price = shop.getSellingPrice(this.selectedItem.id);
                if (shop.sellItem(this.selectedItem.id, 1)) {
                    player.tipBox.show("Sold " + this.selectedItem.name + " for " + price + " gold!");
                }
            } else if (this.selectedTab === 'buy') {
                let price = shop.getBuyingPrice(this.selectedItem.id);
                if (gameManager.gold >= price) {
                    if (playerInventory.addItem(this.selectedItem.id, 1)) {
                        gameManager.spendGold(price);
                        player.tipBox.show("Bought " + this.selectedItem.name + " for " + price + " gold!");
                    } else {
                        player.tipBox.show("Inventory is full!");
                    }
                } else {
                    player.tipBox.show("Not enough gold!");
                }
            }
            return true;
        }
        return false;
    }

    displayActionButton() {
        let buttonX = this.x + this.width - 180;
        let buttonY = this.y + 300;
        let buttonWidth = 160;
        let buttonHeight = 30;

        fill(100, 149, 237);  
        rect(buttonX, buttonY, buttonWidth, buttonHeight, 5);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(14);
        
        let buttonText = '';
        if (this.selectedTab === 'buy') {
            let price = shop.getBuyingPrice(this.selectedItem.id);
            buttonText = 'Buy (' + price + ' gold)';
        } else {
            let price = shop.getSellingPrice(this.selectedItem.id);
            buttonText = 'Sell (' + price + ' gold)';
        }

        text(buttonText, buttonX + buttonWidth/2, buttonY + buttonHeight/2);
    }
}