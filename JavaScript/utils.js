/**
 * Embaralha um array usando o algoritmo Fisher-Yates
 * @param {Array} array - Array a ser embaralhado
 * @returns {Array} - Novo array embaralhado
 */
export function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Embaralha as questões mantendo a proporção de tipos
 * @param {Array} questions - Array de questões
 * @returns {Array} - Questões embaralhadas
 */
export function shuffleQuestions(questions) {
    const multipleChoice = questions.filter(q => q.type === "multiple");
    const textQuestions = questions.filter(q => q.type === "text");
    
    return shuffleArray([...shuffleArray(multipleChoice), ...shuffleArray(textQuestions)]);
}

/**
 * Embaralha as opções de uma questão de múltipla escolha
 * @param {Object} question - Questão a ser processada
 * @returns {Object} - Questão com opções embaralhadas
 */
export function shuffleQuestionOptions(question) {
    if (question.type !== "multiple") return question;
    
    const shuffledOptions = shuffleArray([...question.options]);
    return {
        ...question,
        options: shuffledOptions,
        originalAnswer: question.answer, // Preserva a resposta original
        answer: shuffledOptions[question.options.indexOf(question.answer)] // Mapeia nova posição
    };
}

/**
 * Normaliza texto para comparação (remove acentos e coloca em minúsculas)
 * @param {string} str - Texto a normalizar
 * @returns {string} - Texto normalizado
 */
export function normalizeText(str) {
    return str.normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .trim();
}

/**
 * Efeito de confete para celebração
 */
export function fireConfetti() {
    confetti({ 
        particleCount: 150, 
        spread: 70, 
        origin: { y: 0.6 } 
    });
    
    setTimeout(() => {
        confetti({ 
            particleCount: 100, 
            spread: 60, 
            origin: { y: 0.5 } 
        });
    }, 500);
    
    setTimeout(() => {
        confetti({ 
            particleCount: 200, 
            spread: 90, 
            origin: { y: 0.7 } 
        });
    }, 1000);
}