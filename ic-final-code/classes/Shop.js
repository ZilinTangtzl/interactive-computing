class Shop {
    constructor() {
        this.name = "Village Shop";
        this.isOpen = true;
        this.openHour = 8;    
        this.closeHour = 18;  
        
        this.inventory = {
            'energy_potion': {
                basePrice: 20,
                currentPrice: 20,
                stock: 999,
                maxStock: 999,
                canBeSoldToPlayer: true,
                type: 'sell' 
            },
            'corn_seeds': {
                basePrice: 10,
                currentPrice: 10,
                stock: 999,
                maxStock: 999,
                canBeSoldToPlayer: true,
                type: 'sell'
            },
            'wheat_seeds': {
                basePrice: 8,
                currentPrice: 8,
                stock: 999,
                maxStock: 999,
                canBeSoldToPlayer: true,
                type: 'sell'
            },
            
            'corn': {
                stock: 0,
                maxStock: 100,
                type: 'buy' 
            },
            'wheat': {
                stock: 0,
                maxStock: 100,
                type: 'buy'
            },
            'carrot': {
                stock: 0,
                maxStock: 100,
                type: 'buy'
            },
            'beetroot': {
                stock: 0,
                maxStock: 100,
                type: 'buy'
            },
            'cauliflower': {
                stock: 0,
                maxStock: 100,
                type: 'buy'
            }
        };
    }

    checkIfOpen() {
        const isInBusinessHours = gameManager.hour >= this.openHour && 
                                 gameManager.hour < this.closeHour;
        if (!isInBusinessHours) {
            player.tipBox.show("Shop closed! Business hours: " + 
                             this.openHour + ":00 - " + this.closeHour + ":00");
            return false;
        }
        return true;
    }

    sellItem(itemId, amount = 1) {
        if (!this.checkIfOpen()) {
            return false;
        }

        const shopItem = this.inventory[itemId];
        if (!shopItem || shopItem.type !== 'buy') {
            player.tipBox.show("Shop doesn't buy this item!");
            return false;
        }

        if (shopItem.stock + amount > shopItem.maxStock) {
            player.tipBox.show("Shop inventory is full!");   
            return false;
        }

        const sellingPrice = this.getSellingPrice(itemId);
        if (sellingPrice <= 0) {
            player.tipBox.show("This item cannot be sold!");
            return false;
        }

        if (!playerInventory.hasItem(itemId, amount)) {
            player.tipBox.show("Not enough items to sell!");
            return false;
        }

        if (playerInventory.removeItem(itemId, amount)) {
            shopItem.stock += amount;
            gameManager.addGold(sellingPrice * amount);
            player.tipBox.show("Sold " + itemsDatabase[itemId].name + 
                             " for " + (sellingPrice * amount) + " gold!");   
            return true;
        }
        return false;
    }

    getStockInfo(itemId) {
        const item = this.inventory[itemId];
        if (!item) return null;

        return {
            current: item.stock,
            max: item.maxStock,
            isFull: item.stock >= item.maxStock
        };
    }

    update() {
        const shouldBeOpen = gameManager.hour >= this.openHour && 
                           gameManager.hour < this.closeHour;
        
        if (this.isOpen !== shouldBeOpen) {
            this.isOpen = shouldBeOpen;
            if (this.isOpen) {
                player.tipBox.show("The shop is now open!");
            } else {
                player.tipBox.show("The shop is now closed!");
                this.clearDailyStock(); 
            }
        }
    }

    clearDailyStock() {
        for (let itemId in this.inventory) {
            const item = this.inventory[itemId];
            if (item.type === 'buy') {
                item.stock = 0;
            }
        }
    }

    getSellingPrice(itemId) {
        const item = itemsDatabase[itemId];
        if (!item || !item.canBeSold) {
            return 0;
        }
        return Math.floor(item.price * 0.5);  
    }

    getBuyingPrice(itemId) {
        const item = this.inventory[itemId];
        if (!item || !item.canBeSoldToPlayer) {
            return 0;
        }
        return item.currentPrice;
    }
} 