class DialogBox {
    constructor() {
        this.isVisible = false;
        this.message = "";
        this.options = [];
        this.x = 110;
        this.y = 430;
        this.width = 580;
        this.height = 125;
        this.padding = 20;
        this.transparency = 200;

        this.tutorialSteps = [
            "Welcome to Ghost Farm! A mysterious place filled with wonder...",
            "Let's start with the basics:\nUse the arrow keys to move around.",
            "Press number keys to switch actions:\n'1' to plant seeds, '2' to water crops, and '3' to harvest.",
            "Once you've selected an action, get close to a field and press 'Shift' to perform it.",
            "Press 'C' to cycle through different crops - each has its own growing pattern.",
            "Don't forget to water your plants! Watered soil will appear darker.",
            "Energy is essential - you'll need it for all your farming activities.",
            "Standing near water might restore some energy, but be careful - staying too long will drain it instead!",
            "You can buy energy potions at the shop. Press 'B' to browse the wares.",
            "Press 'I' to check your inventory and see what you've gathered.",
            "Press 'V' to toggle field border visibility for better planning.",
            "Remember to save your progress with 'S' key!",
            "If you need to start fresh, press 'R' to delete your save data.",
            "Have a wonderful time at Ghost Farm!"
        ];
        this.currentTutorialStep = 0;
        this.hasNextDialogue = false;
    }

    addOption(text, optionId) {
        this.options.push({
            text: text,
            id: optionId
        });
    }

    showDialog(message) {
        this.isVisible = true;
        this.message = message;
        this.options = [];
    }

    showShopDialog() {
        this.isVisible = true;
        this.message = "Ah, the village shop! The scent of herbs and fresh goods fills the air...";
        this.options = [
            {text: "Enter Shop", id: "enter_shop"},
            {text: "Leave", id: "close"}
        ];
    }

    handleOptionClick(optionId) {
        switch(optionId) {
            case "ask_task":
                player.npc.dialogueManager.startTaskDialogue();
                break;
            case "enter_shop":
                this.showShopMenu();
                break;
            case "close":
                this.hide();
                break;
            case "next_dialogue":
                player.npc.dialogueManager.showNextDialogue();
                break;
            case "buy_potion":
                if (gameManager.spendGold(20)) {
                    player.energy = Math.min(player.energy + 50, player.maxEnergy);
                    player.tipBox.show("Energy restored!");
                    this.hide();
                } else {
                    player.tipBox.show("Not enough gold!");
                }
                break;
            case "buy_mana_potion":
                if (gameManager.spendGold(20)) {
                    player.mana = Math.min(player.mana + 50, player.maxMana);
                    player.tipBox.show("*Mana restored!*");
                    this.hide();
                } else {
                    player.tipBox.show("No enough gold!");
                }
                break;
            case "out_of_stock":
                player.tipBox.show("This item is currently out of stock.");
                break;
            case "tutorial_next":
                this.currentTutorialStep++;
                if (this.currentTutorialStep < this.tutorialSteps.length) {
                    this.showTutorial();
                } else {
                    this.isVisible = false;
                    this.currentTutorialStep = 0;  
                }
                break;
            case "start_game":
                this.isVisible = false;
                this.currentTutorialStep = 0;  
                break;
            case "accept_task":
                if (player.npc && player.npc.startTask()) {
                    this.hide();
                    player.tipBox.show("Task accepted!");
                }
                break;
            case "complete_task":
                if (player.npc && player.npc.currentTask) {
                    if (player.npc.checkTaskCompletion(player)) {
                        this.hide();
                        player.tipBox.show("Task completed! Reward received!");
                    }
                }
                break;
            case "view_task":
                taskUI.toggleDisplay();
                this.hide();
                break;
            
            case "chat":
                const chatResponses = [
                    "Nice weather today.",
                    "How's the farm harvest going?",
                    "Have you heard? Strange things appeared in the forest recently...", 
                    "What crops are best to plant this season?"
                ];
                this.show(chatResponses[Math.floor(Math.random() * chatResponses.length)]);
                break;
            
            case "repair_tools":
                if (gameManager.spendGold(50)) {
                    player.tipBox.show("Tools repaired!");
                    this.hide();
                } else {
                    player.tipBox.show("Not enough gold! Repair cost is 50 gold.");
                }
                break;
        }
    }

    hide() {
        this.isVisible = false;
        this.message = "";
        this.options = [];
    }

    display() {
        if (!this.isVisible) return;

        push();
        fill(0, 0, 0, this.transparency);
        stroke(255);
        strokeWeight(2);
        rect(this.x, this.y, this.width, this.height, 10);

        fill(255);
        noStroke();
        textSize(16);
        textAlign(LEFT, TOP);
        textLeading(22);

        let messageX = this.x + this.padding;
        let messageY = this.y + this.padding;
        let messageWidth = this.width - this.padding * 2;
        text(this.message, messageX, messageY, messageWidth);

        if (this.options && this.options.length > 0) {
            let optionWidth = this.width / 2 - this.padding * 2;
            let optionY = this.y + this.height - 40;
            
            this.options.forEach((option, i) => {
                let optionX = this.x + (i * (this.width/2)) + this.padding;
                let optionText = `${option.text}`;
                text(optionText, optionX, optionY);
            });
        }

        pop();
    }

    checkClick(mouseX, mouseY) {
        if (!this.isVisible || !this.options.length) return;

        let optionY = this.y + this.height - 40;
        let optionHeight = 30;
        
        this.options.forEach((option, i) => {
            let optionX = this.x + (i * (this.width/2)) + this.padding;
            let optionWidth = this.width/2 - this.padding * 2;
            
            if (mouseX >= optionX && 
                mouseX <= optionX + optionWidth &&
                mouseY >= optionY && 
                mouseY <= optionY + optionHeight) {
                this.handleOptionClick(option.id);
            }
        });
    }

    showShopMenu() {
        this.isVisible = true;
        this.message = "What would you like to buy?";
        this.options = [
            {text: "Buy Energy Potion (20 GOLD)", id: "buy_potion"},
            {text: "Exit", id: "close"}
        ];
    }

    showTutorial() {
        this.isVisible = true;
        this.message = this.tutorialSteps[this.currentTutorialStep];
        
        if (this.currentTutorialStep < this.tutorialSteps.length - 1) {
            this.options = [
                { text: "Next", id: "tutorial_next" }
            ];
        } else {
            this.options = [
                { text: "Game Start", id: "start_game" }
            ];
        }
    }

    show(message, hasNext = false) {
        this.isVisible = true;
        this.message = message;
        this.hasNextDialogue = hasNext;
        this.options = hasNext ? [{text: "Continue", id: "next_dialogue"}] : [];
    }

    showWithOptions(message, options) {
        this.isVisible = true;
        this.message = message;
        this.options = options;
    }
} 