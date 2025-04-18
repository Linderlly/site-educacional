class AudioManager {
    constructor() {
        this.sounds = {
            correct: document.getElementById('correct-sound'),
            incorrect: document.getElementById('incorrect-sound'),
            background: document.getElementById('background-music')
        };
        this.isMuted = false;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.sounds.background.pause();
        } else {
            this.sounds.background.play().catch(e => console.log("Reprodução bloqueada"));
        }
        return this.isMuted;
    }

    playSound(type) {
        if (this.isMuted) return;
        this.sounds[type].currentTime = 0;
        this.sounds[type].play().catch(e => console.error("Erro ao reproduzir som:", e));
    }
}

export default AudioManager;