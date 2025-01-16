class NPC {
    constructor(data) {
        // 原本就有的基础属性
        this.id = data.id;        
        this.name = data.name;      
        this.title = data.title;        
        this.position = data.position;   
        this.sprite = data.sprite;              

        this.schedule = new Schedule(data.scheduleData);    
        this.dialogueManager = new DialogueManager(data.dialogues);     

        // task related. add
        this.canGiveTask = data.canGiveTasks || false;
        this.hasTask = false;
        this.currentTask = null;
        
        this.taskSystem = data.canGiveTasks ? new TaskSystem({
            taskDialogues: data.taskDialogues || {},
            availableTasks: data.availableTasks || []
        }) : null;

        this.pendingTask = null;
    }

    hasActiveTask() {
        return this.hasTask && this.currentTask && !this.currentTask.isCompleted;
    }

    startTask() {
        // 先检查这个NPC能不能给任务,或者已经有任务了
        if (!this.canGiveTask || this.hasTask) {
            return false;
        }
        
        if (this.pendingTask) {
            this.currentTask = this.pendingTask;
            this.taskSystem.currentTask = this.pendingTask;
            this.hasTask = true;
            this.pendingTask = null;
            
            console.log('Task accepted:', this.currentTask);
            return true;
        }
        return false;
    }


    checkTaskCompletion(player) {
        if (!this.hasTask || !this.currentTask || !this.taskSystem) {
            return false;
        }

        if (!player || !player.inventory) {
            return false;
        }

        if (this.currentTask.checkConditions(player)) {
            if (this.currentTask.complete(player)) {
                this.taskSystem.markTaskCompleted(this.currentTask.id);
                this.hasTask = false;
                this.currentTask = null;
                this.taskSystem.currentTask = null;
                return true;
            }
        }
        return false;
    }

    update() {
        this.schedule.update();
        this.updatePosition();
    }

    updatePosition() {
        let newPosition = this.schedule.getCurrentPosition();
        if (newPosition) {
            this.position = newPosition;
        }
    }

    display() {
        if (this.sprite) {
            image(this.sprite, this.position.x, this.position.y);
        }
    }

    isNearPlayer(player) {
        let dx = player.x - this.position.x;
        let dy = player.y - this.position.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 50) {
            return true;
        } else {
            return false;
        }
    }

    interact(player) {
        if (!player.dialogBox.isVisible) {
            player.npc = this;
            this.dialogueManager.setNPC(this);
            if (this.hasActiveTask()) {
                this.dialogueManager.startTaskDialogue();
            } else {
                this.dialogueManager.startGreetingDialogue();
            }
        }
    }
} 