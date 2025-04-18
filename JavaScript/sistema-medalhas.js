class MedalhaSystem {
    constructor() {
        this.medalhas = {
            'bronze': { 
                img: '../img/medalha-bronze.png',
                title: 'Medalha de Bronze!',
                desc: 'Parabéns! Você acertou 10 perguntas!',
                condition: (score, total) => score >= 10
            },
            'silver': { 
                img: '../img/medalha-prata.png',
                title: 'Medalha de Prata!',
                desc: 'Incrível! Você acertou 15 perguntas!',
                condition: (score, total) => score >= 15
            },
            'gold': { 
                img: '../img/medalha-ouro.png',
                title: 'Medalha de Ouro!',
                desc: 'Perfeito! Você acertou todas as perguntas!',
                condition: (score, total) => score === total
            }
        };
    }

    checkMilestones(score, totalQuestions) {
        if (this.medalhas.gold.condition(score, totalQuestions)) {
            this.showMedal('gold');
        } else if (this.medalhas.silver.condition(score, totalQuestions)) {
            this.showMedal('silver');
        } else if (this.medalhas.bronze.condition(score, totalQuestions)) {
            this.showMedal('bronze');
        }
    }

    showMedal(medalType) {
        const medal = this.medalhas[medalType];
        const medalPopup = document.getElementById('medalha-popup');
        
        document.querySelector('.medalha-popup-img').src = medal.img;
        document.querySelector('.medalha-popup-title').textContent = medal.title;
        document.querySelector('.medalha-popup-desc').textContent = medal.desc;
        
        medalPopup.classList.add('active');
        
        const closePopup = () => medalPopup.classList.remove('active');
        document.querySelector('.close-medalha-popup').onclick = closePopup;
        document.querySelector('.medalha-popup-btn').onclick = closePopup;
        medalPopup.onclick = (e) => e.target === medalPopup && closePopup();

        fireConfetti();
    }
}

export default MedalhaSystem;