class DialogueManager {
    constructor(dialogues) {
        this.dialogues = dialogues;
        this.lastDialogueTime = 0;
        this.lastDialogueDate = null; 
        this.dailyGreetingCount = 0;
        this.relationship = 0;  // 好感度系统 暂时没用
        this.currentDialogueIndex = 0;  
        this.currentDialogues = [];   
        this.npc = null; 
    }


    setNPC(npc) {
        this.npc = npc;
    }

    startGreetingDialogue() {
        const hour = gameManager.hour;
        let greetingOptions = [];

        if (this.npc.canGiveTask) {
            greetingOptions.push({ text: "Need any help?", id: "ask_task" });
        }
        
        if (this.npc.id === 'blacksmith') {
            if (hour >= 6 && hour < 20) {  // Business hours
                greetingOptions.push({ text: "I want to see your goods", id: "enter_shop" });
                greetingOptions.push({ text: "Repair tools", id: "repair_tools" });
            } else {
                greetingOptions = [{ text: "Sorry to bother you", id: "close" }];
            }
        }

        if (greetingOptions.length === 0) {
            greetingOptions.push({ text: "Chat", id: "chat" });
        }
        
        greetingOptions.push({ text: "Leave", id: "close" });

        // Choose greeting based on time
        let greeting = this.getTimeBasedGreeting(hour);
        player.dialogBox.showWithOptions(greeting, greetingOptions);
    }

    showNextDialogue() {
        if (this.currentDialogueIndex < this.currentDialogues.length) {
            this.showDialogueWithOptions(this.currentDialogues[this.currentDialogueIndex]);
            this.currentDialogueIndex++;
        } else {
            player.dialogBox.hide();
            if (this.isFirstGreetingOfDay()) {
                this.dailyGreetingCount++;
            }
        }
    }

    showDialogueWithOptions(dialogue) {
        let options = [];
        
        if (this.npc && this.npc.canGiveTask) {
            options.push({text: "Need any help?", id: "ask_task"});
        }
        options.push({text: "Show me your goods", id: "enter_shop"});
        options.push({text: "Goodbye", id: "close"});
        
        player.dialogBox.showWithOptions(dialogue, options);
    }

    checkAndResetDaily() {
        const currentDate = gameManager.getCurrentDate();
        if (this.lastDialogueDate && currentDate !== this.lastDialogueDate) {
            this.dailyGreetingCount = 0;
        }
    }

    isFirstGreetingOfDay() {
        return this.dailyGreetingCount === 0;
    }

    startTaskDialogue() {
        if (!this.npc || !this.npc.taskSystem) {
            console.log('DialogueManager: Invalid NPC or task system');
            return;
        }
        
        if (this.npc.hasActiveTask()) {
            const currentTask = this.npc.currentTask;
            if (!currentTask) {
                console.log('DialogueManager: No current task');
                return;
            }
            
            if (!player) {
                console.log('DialogueManager: Player object is undefined');
                return;
            }

            if (!player.inventory) {
                console.log('DialogueManager: Player inventory is undefined');
                return;
            }
            
            // Check if task can be completed
            const canComplete = currentTask.checkConditions(player);
            const taskProgress = this.npc.taskSystem.getTaskProgress(player);
            
            const inventoryItems = player.inventory ? player.inventory.items : {};
            
            console.log('DialogueManager: Task status', {
                hasTask: this.npc.hasActiveTask(),
                currentTask: currentTask,
                taskProgress: taskProgress,
                canComplete: canComplete,
                playerInventory: inventoryItems
            });
            
            if (canComplete) {
                player.dialogBox.showWithOptions(
                    "You have collected enough materials! Want to complete now?",
                    [
                        { text: "Complete Task", id: "complete_task" },
                        { text: "Later", id: "close" }
                    ]
                );
            } else {
                const current = taskProgress ? taskProgress.current : 0;
                const required = currentTask.requirements.amount;
                const itemName = currentTask.requirements.item;
                
                player.dialogBox.showWithOptions(
                    `How's the task going?\nNeed: ${required} ${itemName}\nProgress: ${current}/${required}`,
                    [
                        { text: "Keep Working", id: "close" },
                        { text: "View Task Details", id: "view_task" }
                    ]
                );
            }
        } else if (this.npc.canGiveTask) {
     
            const newTask = this.npc.taskSystem.generateRandomTask();
            if (newTask) {
                this.npc.pendingTask = newTask;  
                
                player.dialogBox.showWithOptions(
                    `I need help with something...\n${newTask.description}\nReward: ${newTask.reward.gold} gold`,
                    [
                        { text: "Accept Task", id: "accept_task" },
                        { text: "Let me think", id: "close" },
                        { text: "Just chat", id: "chat" }  
                    ]
                );
            } else {
                // If no tasks available then show chat option
                player.dialogBox.showWithOptions(
                    "All tasks are done for today. Come back tomorrow!",
                    [
                        { text: "Let's chat", id: "chat" },
                        { text: "Leave", id: "close" }
                    ]
                );
            }
        }
    }


    showTaskDialog(description) {
        let taskDialogue;
        if (this.npc.taskSystem && 
            this.npc.taskSystem.taskDialogues && 
            this.npc.taskSystem.taskDialogues.available) {
            taskDialogue = this.npc.taskSystem.taskDialogues.available;
        } else {
            taskDialogue = description;
        }
            
        this.showDialogueWithOptions(
            taskDialogue,
            [
                {text: "I'll help", id: "accept_task"},
                {text: "Let me think", id: "close"}
            ]
        );
    }

    showTaskCompletionDialog() {
        let taskDialogue;
        if (this.npc.taskSystem && 
            this.npc.taskSystem.taskDialogues && 
            this.npc.taskSystem.taskDialogues.completed) {
            taskDialogue = this.npc.taskSystem.taskDialogues.completed;
        } else {
            taskDialogue = "Thank you so much! Here's your reward.";
        }
            
        this.showDialogueWithOptions(
            taskDialogue,
            [{text: "You're welcome", id: "complete_task"}]
        );
    }


    showTaskInProgressDialog() {
        if (!this.npc || !this.npc.currentTask || !this.npc.currentTask.requirements) {
            return;
        }

        const task = this.npc.currentTask;
        const amount = task.requirements.amount;
        const itemName = task.requirements.item;
        
        if (!amount || !itemName) {
            return;
        }

        this.showDialogueWithOptions(
            `Still working on it? I need ${amount} ${itemName}.`,
            [{text: "I'll keep collecting", id: "close"}]
        );
    }

    getTimeBasedGreeting(hour) {
        if (hour >= 5 && hour < 11) {
            return this.dialogues.greeting.morning.first[
                Math.floor(Math.random() * this.dialogues.greeting.morning.first.length)
            ];
        } else if (hour >= 11 && hour < 17) {
            return this.dialogues.greeting.afternoon.first[
                Math.floor(Math.random() * this.dialogues.greeting.afternoon.first.length)
            ];
        } else {
            return this.dialogues.greeting.evening.first[
                Math.floor(Math.random() * this.dialogues.greeting.evening.first.length)
            ];
        }
    }
}