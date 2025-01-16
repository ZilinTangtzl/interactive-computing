class TaskUI {
    constructor() {
        this.isVisible = false;
        this.currentTab = 'active'; 
        
        this.x = 100;
        this.y = 100;
        this.width = 600;
        this.height = 400;
        this.padding = 20;
    }

    toggleDisplay() {
        this.isVisible = !this.isVisible;
    }

    display() {
        if (!this.isVisible) return;

        push();
        fill(0, 0, 0, 150);
        rect(0, 0, width, height);

        fill(0, 0, 0, 200);
        stroke(255);
        strokeWeight(2);
        rect(this.x, this.y, this.width, this.height, 10);

        fill(255);
        noStroke();
        textSize(24);
        textAlign(CENTER, TOP);
        text("Tasks", this.x + this.width/2, this.y + 20);

        this.displayTabs();
        
        this.displayTasks();
        pop();
    }

    displayTabs() {
        const tabs = [
            {id: 'active', text: 'Active'},
            {id: 'completed', text: 'Done'}
        ];

        let tabWidth = 100;
        let tabHeight = 30;
        let startX = this.x + this.padding;
        let tabY = this.y + 60;

        tabs.forEach((tab, index) => {
            let tabX = startX + (tabWidth + 10) * index;
            
            if (this.currentTab === tab.id) {
                fill(200, 200, 255);
            } else {
                fill(100, 100, 100);
            }
            
            rect(tabX, tabY, tabWidth, tabHeight, 5);
            
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(14);
            text(tab.text, tabX + tabWidth/2, tabY + tabHeight/2);
        });
    }

    displayTasks() {
        let startY = this.y + 100;
        let taskHeight = 80;
        
        if (this.currentTab === 'active') {
            let activeTasks = this.getActiveTasks();
            if (activeTasks.length === 0) {
                fill(150);
                textAlign(CENTER);
                text("No active tasks", this.x + this.width/2, startY + 50);
            } else {
                activeTasks.forEach((task, index) => {
                    if (task && task.description) {
                        this.displayTaskItem(task, startY + index * (taskHeight + 10));
                    }
                });
            }
        } else {
            let completedTasks = this.getCompletedTasks();
            if (completedTasks.length === 0) {
                fill(150);
                textAlign(CENTER);
                text("No completed tasks", this.x + this.width/2, startY + 50);
            } else {
                completedTasks.forEach((task, index) => {
                    if (task && task.description) {
                        this.displayTaskItem(task, startY + index * (taskHeight + 10), true);
                    }
                });
            }
        }
    }

    displayTaskItem(task, y, completed = false) {
        fill(40, 40, 40, 200);
        rect(this.x + this.padding, y, this.width - this.padding * 2, 70, 5);

        fill(255);
        textAlign(LEFT, TOP);
        textSize(16);
        text(task.description, this.x + this.padding * 2, y + 10);

        if (!completed) {
            let progress = playerInventory.getItemCount(task.requirements.item) / task.requirements.amount;
            this.displayProgressBar(
                this.x + this.padding * 2, 
                y + 40, 
                this.width - this.padding * 4, 
                20, 
                progress
            );
        }
    }

    displayProgressBar(x, y, width, height, progress) {
        fill(70);
        rect(x, y, width, height, 5);
        
        fill(0, 255, 0);
        rect(x, y, width * progress, height, 5);
        
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(12);
        text(`${Math.floor(progress * 100)}%`, x + width/2, y + height/2);
    }

    getActiveTasks() {
        let tasks = [];
        if (npcManager && npcManager.npcs) {
            npcManager.npcs.forEach(npc => {
                if (npc && npc.currentTask && !npc.currentTask.isCompleted) {
                    if (npc.currentTask.description) {
                        tasks.push(npc.currentTask);
                    }
                }
            });
        }
        console.log('Active tasks:', tasks); 
        return tasks;
    }

    getCompletedTasks() {
        let tasks = [];
        if (npcManager && npcManager.npcs) {
            npcManager.npcs.forEach(npc => {
                if (npc && npc.taskSystem) {
                    const completedTaskIds = Array.from(npc.taskSystem.completedTasks);
                    completedTaskIds.forEach(taskId => {
                        const lastIndex = taskId.lastIndexOf('_');
                        const baseTaskId = taskId.substring(0, lastIndex);
                        const taskConfig = TaskConfigs[baseTaskId];
                        if (taskConfig) {
                            tasks.push({
                                description: taskConfig.description,
                                isCompleted: true
                            });
                        }
                    });
                }
            });
        }
        console.log('Completed tasks:', tasks);
        return tasks;
    }

    handleClick(mouseX, mouseY) {
        if (!this.isVisible) return;

        let tabWidth = 100;
        let tabHeight = 30;
        let startX = this.x + this.padding;
        let tabY = this.y + 60;

        if (mouseY >= tabY && mouseY <= tabY + tabHeight) {
            if (mouseX >= startX && mouseX <= startX + tabWidth) {
                this.currentTab = 'active';
            } else if (mouseX >= startX + tabWidth + 10 && mouseX <= startX + tabWidth * 2 + 10) {
                this.currentTab = 'completed';
            }
        }
    }
}