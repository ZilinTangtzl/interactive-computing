// Not used
class AchievementUI {
    constructor() {
        this.isVisible = false;
        this.achievements = [];
        

        this.x = 100;
        this.y = 100;
        this.width = 600;
        this.height = 400;
        this.padding = 20;
        

        this.scrollOffset = 0;
        this.maxScroll = 0;
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
        text("Achievements", this.x + this.width/2, this.y + 20);

        this.displayAchievements();
        pop();
    }

    displayAchievements() {
        let startY = this.y + 60;
        let achievementHeight = 80;
        
        if (this.achievements.length === 0) {
            fill(150);
            textAlign(CENTER);
            text("No achievements yet", this.x + this.width/2, startY + 50);
            return;
        }

        this.achievements.forEach((achievement, index) => {
            this.displayAchievementItem(achievement, startY + index * (achievementHeight + 10));
        });
    }

    handleClick(mouseX, mouseY) {
        if (!this.isVisible) return;
    }
} 