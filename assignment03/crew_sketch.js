let crewData = {
    dialogues: [],
    achievements: []
};

function setup() {
    let canvas = createCanvas(220, 600);
    canvas.parent(document.body);  
    window.addEventListener('message', function(event) {
        if (event.data) {
            crewData = event.data;
        }
    }, false);
}

function draw() {
    background(17); 

    fill(255);
    textSize(14);
    textAlign(LEFT, TOP);

    let y = 10;
    for (let i = 0; i < crewData.dialogues.length; i++) {
        let dialogue = crewData.dialogues[i];
        let textContent = dialogue.crewMember + ": " + dialogue.message; 
        textFit(textContent, 10, y, 200, 20);
        y += 80;
        if (y > 360) break; 
    }

    // achievment title
    fill(204);
    textSize(16);
    textAlign(CENTER);
    text('Achievements', width / 2, 380);

    // show achievements
    textSize(14);
    textAlign(LEFT);
    y = 410;
    for (let i = 0; i < crewData.achievements.length; i++) {
        let achievement = crewData.achievements[i];
        textFit("- " + achievement, 10, y, 200, 20);  
        y += 40;
    }
}


// ------------------test 1-----------------
function textFit(textContent, x, currentYPosition, maxWidth, lineHeight) {
    let words = textContent.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let testWidth = textWidth(testLine);

        if (testWidth > maxWidth && n > 0) {
            text(line, x, currentYPosition); 
            line = words[n] + ' ';  
            currentYPosition += lineHeight; 
        } else {
            line = testLine;
        }
    }
    text(line, x, currentYPosition);  
    currentYPosition += lineHeight; 

    return currentYPosition; 
}

