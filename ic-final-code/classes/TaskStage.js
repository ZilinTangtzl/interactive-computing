
// not used. replaced by task system
class Task {
    constructor(data) {
        this.id = data.id;              
        this.title = data.title;         
        this.description = data.description;  
        this.type = data.type;         
        
        this.stages = [];
        for (let i = 0; i < data.stages.length; i++) {
            this.stages.push(new TaskStage(data.stages[i]));
        } 
        this.rewards = new TaskRewards(data.rewards);  
        this.status = 'ACTIVE';  
        
        this.giver = data.giverNpcId;     
    }


    checkCompletion() {
        for (let i = 0; i < this.stages.length; i++) {
            let stage = this.stages[i];
            if (!stage.isCompleted) {
                return false;
            }
        }
        return true;
    }


    complete() {
        if (this.checkCompletion()) {
            this.status = 'COMPLETED';
            this.rewards.giveToPlayer();
            gameManager.eventSystem.trigger('taskCompleted', this.id);
        }
    }


    update() {
    }

    interactWithPlayer(player) {
    }
} 