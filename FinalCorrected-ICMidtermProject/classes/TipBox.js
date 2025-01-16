class TipBox {
    constructor() {
        this.isVisible = false;
        this.message = "";
        this.x = 110;
        this.y = 430;
        this.width = 580;
        this.height = 125;
        this.padding = 20;
        this.fadeTimer = 0;
        this.fadeDelay = 500; 
        this.alpha = 200;
    }

    show(message) {
        this.isVisible = true;
        this.message = message;
        this.fadeTimer = millis();
    }

    hide() {
        this.isVisible = false;
        this.message = "";
    }

    update() {
        if (this.isVisible && millis() - this.fadeTimer > this.fadeDelay) {
            this.hide();
        }
    }

    display() {
        if (!this.isVisible) return;

        push();
        fill(0, 0, 0, this.alpha);
        stroke(255);
        strokeWeight(2);
        rect(this.x, this.y, this.width, this.height, 10);

        fill(255);
        noStroke();
        textSize(16);
        textAlign(CENTER, TOP);  

        let parts = this.message.split(/(\*[^*]+\*)/g);
        let currentX = this.x + this.width / 2;  

        let currentY = this.y + this.padding;  

        parts.forEach(part => {
            if (part.startsWith('*') && part.endsWith('*')) {
                textStyle(ITALIC);
                let cleanText = part.slice(1, -1);
                text(cleanText, currentX, currentY);
            } else {
                textStyle(NORMAL);
                text(part, currentX, currentY);
            }
            currentY += textAscent() + textDescent();
        });

        pop();
    }
} 