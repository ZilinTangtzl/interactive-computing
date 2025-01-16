class TaskSystem {
    constructor(npcConfig) {
        this.taskDialogues = npcConfig.taskDialogues;
        this.availableTasks = npcConfig.availableTasks;
        this.currentTask = null;
        this.completedTasks = new Set();
        this.lastResetDay = null;  
    }

    generateRandomTask() {
        this.checkAndResetTasks();
        
        if (!this.availableTasks || this.availableTasks.length === 0) {
            return null;
        }
        
        const availableTaskIds = this.availableTasks.filter(taskId => {
            const todayKey = this.getTodayKey(taskId);
            return !this.completedTasks.has(todayKey);
        });
        
        if (availableTaskIds.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * availableTaskIds.length);
        const taskId = availableTaskIds[randomIndex];
        const taskConfig = TaskConfigs[taskId];
        
        if (!taskConfig) {
            console.error('Task config not found:', taskId);
            return null;
        }
        
        const task = new Task(taskConfig);
        console.log('Generated new task:', task);
        return task;
    }

    checkAndResetTasks() {
        const currentDate = gameManager.getCurrentDate();
        if (this.lastResetDay !== currentDate) {
            this.completedTasks.clear();
            this.lastResetDay = currentDate;
            console.log('TaskSystem: Reset tasks for new day', currentDate);
        }
    }

    getTodayKey(taskId) {
        return `${taskId}_${gameManager.getCurrentDate()}`;
    }

    markTaskCompleted(taskId) {
        const todayKey = this.getTodayKey(taskId);
        this.completedTasks.add(todayKey);
        console.log('Task completed:', {
            taskId: taskId,
            todayKey: todayKey,
            completedTasks: Array.from(this.completedTasks)
        });
    }

    loadTaskState(savedState) {
        if (savedState.currentTask) {
            this.currentTask = new Task(savedState.currentTask);
        }
        this.completedTasks = new Set(savedState.completedTasks || []);
    }

    getTaskProgress(player) {
        if (!this.currentTask) {
            console.log('TaskSystem: No current task');
            return null;
        }
        
        if (!player || !player.inventory) {
            console.log('TaskSystem: Invalid player or inventory');
            return null;
        }
        
        const required = this.currentTask.requirements;
        const itemCount = player.inventory.getItemCount(required.item);
        
        console.log('TaskSystem: Progress check', {
            itemType: required.item,
            required: required.amount,
            current: itemCount,
            inventory: player.inventory.items
        });
        
        return {
            current: itemCount,
            required: required.amount,
            percentage: Math.min(Math.floor((itemCount / required.amount) * 100), 100)
        };
    }
}

class Task {
    constructor(data) {
        this.id = data.id;                  
        this.description = data.description;  
        this.requirements = data.requirements; 
        this.reward = data.reward;           
        this.isCompleted = false;           
    }

    checkConditions(player) {
        if (!player) {
            console.log('Task: Player is null');
            return false;
        }
        
        if (!player.inventory) {
            console.log('Task: Player inventory is null');
            return false;
        }
        
        const itemCount = player.inventory.getItemCount(this.requirements.item);
        const hasEnough = itemCount >= this.requirements.amount;
        
        console.log('Task: Condition check', {
            taskId: this.id,
            itemRequired: this.requirements.item,
            amountRequired: this.requirements.amount,
            currentAmount: itemCount,
            hasEnough: hasEnough
        });
        
        return hasEnough;
    }

    complete(player) {
        if (this.isCompleted) return false;
        
        player.inventory.removeItem(
            this.requirements.item, 
            this.requirements.amount
        );
        
        // 发放奖励
        gameManager.addGold(this.reward.gold);
        
        this.isCompleted = true;
        return true;
    }
} 