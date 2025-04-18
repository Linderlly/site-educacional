class MedalhaSystem {
    constructor() {
        this.medalhas = {
            'bronze': { 
                img: '../img/medalha-bronze.png',
                title: 'Medalha de Bronze!',
                desc: 'Parabéns! Você acertou 10 perguntas!'
            },
            'silver': { 
                img: '../img/medalha-prata.png',
                title: 'Medalha de Prata!',
                desc: 'Incrível! Você acertou 15 perguntas!'
            },
            'gold': { 
                img: '../img/medalha-ouro.png',
                title: 'Medalha de Ouro!',
                desc: 'Perfeito! Você acertou todas as perguntas!'
            }
        };
    }

    // Método adicionado para corrigir o erro
    getMedalData(medalType) {
        return this.medalhas[medalType] || {};
    }

    // Método mantido para compatibilidade
    checkMilestones(score, totalQuestions) {
        if (score === totalQuestions) return 'gold';
        if (score >= 15) return 'silver';
        if (score >= 10) return 'bronze';
        return null;
    }
}

export default MedalhaSystem;