// Schedule system temporarily disabled... 

class Schedule {
    constructor(scheduleData) {
        // console.log('Schedule system currently disabled');
        this.scheduleData = scheduleData;
        this.currentActivity = null;
        this.currentPosition = null;
        this.update();
    }

    update() {
        let currentTime = gameManager.getCurrentTimeString();
        if (this.scheduleData[currentTime]) {
            let scheduleEntry = this.scheduleData[currentTime];
            this.currentActivity = scheduleEntry.activity;
            let location = scheduleEntry.location;
            this.currentPosition = this.getPositionForLocation(location);
        }
    }

    getCurrentPosition() {
        return this.currentPosition;
    }

    getPositionForLocation(location) {
        if (LocationConfig[location]) {
            return LocationConfig[location];
        } else {
            return { x: 0, y: 0 };
        }
    }
}