class UIToolbar {
    constructor() {
        this.icons = [
            {
                id: 'inventory',
                name: 'Bag',
                shortcut: 'I',
                action: () => playerInventory.toggleDisplay(),
                isOpen: () => playerInventory.isVisible
            },
            {
                id: 'tasks',
                name: 'Tasks',
                shortcut: 'T',
                action: () => taskUI.toggleDisplay(),
                isOpen: () => taskUI.isVisible
            },
            {
                id: 'shop',
                name: 'Shop',
                shortcut: 'B',
                action: () => player.openShop(),
                isOpen: () => shopUI.isVisible
            },
            {
                id: 'achievements',
                name: 'Goals',
                shortcut: 'A',
                action: () => achievementUI.toggleDisplay(),
                isOpen: () => achievementUI.isVisible
            }
        ];

        this.iconSize = 40;
        this.padding = 10;
        this.margin = 5;
        this.tooltipPadding = 5;
        
        this.x = width - this.iconSize - this.padding * 2;
        this.y = 100;
    }

    display() {
        push();
        this.icons.forEach((icon, index) => {
            const iconY = this.y + (this.iconSize + this.margin) * index;
            
            fill(icon.isOpen() ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.5)');
            stroke(255);
            strokeWeight(1);
            rect(this.x, iconY, this.iconSize, this.iconSize, 5);

            if (this.isMouseOver(this.x, iconY)) {
                this.displayTooltip(icon, this.x, iconY);
            }

            if (icon.sprite) {
                image(icon.sprite, this.x + 5, iconY + 5, 
                      this.iconSize - 10, this.iconSize - 10);
            } else {
                fill(255);
                noStroke();
                textAlign(CENTER, CENTER);
                textSize(14);
                text(icon.name[0], 
                     this.x + this.iconSize/2, 
                     iconY + this.iconSize/2);
            }
        });
        pop();
    }

    displayTooltip(icon, x, y) {
        const tooltipText = `${icon.name} (${icon.shortcut})`;
        const tooltipWidth = textWidth(tooltipText) + this.tooltipPadding * 2;
        
        push();
        fill(0, 200);
        noStroke();
        rect(x - tooltipWidth - 5, y, tooltipWidth, 20, 5);
        
        fill(255);
        textAlign(RIGHT, CENTER);
        textSize(12);
        text(tooltipText, x - 10, y + 10);
        pop();
    }

    isMouseOver(x, y) {
        return mouseX >= x && mouseX <= x + this.iconSize &&
               mouseY >= y && mouseY <= y + this.iconSize;
    }

    handleClick() {
        this.icons.forEach((icon, index) => {
            const iconY = this.y + (this.iconSize + this.margin) * index;
            if (this.isMouseOver(this.x, iconY)) {
                icon.action();
            }
        });
    }

    update() {
        this.x = width - this.iconSize - this.padding * 2;
    }
} 