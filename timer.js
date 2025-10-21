class StayTimer {
    constructor(elementId) {
        this.startTime = new Date();
        this.timerElement = document.getElementById(elementId);
        this.intervalId = setInterval(() => this.updateTimer(), 1000);
    }
    updateTimer() {
        const now = new Date();
        const duration = Math.floor((now.getTime() - this.startTime.getTime()) / 1000);
        const hours = Math.floor(duration / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((duration % 3600) / 60).toString().padStart(2, '0');
        const seconds = (duration % 60).toString().padStart(2, '0');
        this.timerElement.textContent = `Duration of Stay: ${hours}:${minutes}:${seconds}`;
    }
    stop() {
        clearInterval(this.intervalId);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new StayTimer('stay-timer');
});
