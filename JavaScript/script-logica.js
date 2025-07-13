import { db, collection, addDoc, getDocs, query, orderBy, limit } from './firebase-config.js';
import MedalhaSystem from './sistema-medalhas.js';
import AudioManager from './audio-manager.js';
import { shuffleQuestions, normalizeText, fireConfetti, shuffleQuestionOptions } from './utils.js';


document.addEventListener("DOMContentLoaded", function () {
    const medalhaSystem = new MedalhaSystem();
    const audioManager = new AudioManager();

    document.addEventListener("keydown", function (event) {
        const input = document.getElementById("text-answer");
        if (!input) return;

        if (event.key === "Control") {
            event.preventDefault();
            input.value += "CTRL + ";
            input.focus();
        }
    });

    const playerName = localStorage.getItem("username") || "Aluno";
    document.getElementById("player-name").textContent = `Jogador: ${playerName}`;

  // ============== PERGUNTAS DO QUIZ ==============
   const questions = [
    { 
        type: "multiple", 
        question: "O que é uma variável em programação?", 
        options: ["Um valor fixo", "Um contêiner para armazenar dados", "Um tipo de loop", "Uma função"], 
        answer: "Um contêiner para armazenar dados" 
    },
    { 
        type: "multiple", 
        question: "Qual estrutura é usada para repetir um bloco de código várias vezes?", 
        options: ["Condicional IF", "Função", "Loop FOR", "Operador lógico"], 
        answer: "Loop FOR" 
    },
    { 
        type: "text", 
        question: "Qual operador lógico representa 'E' em muitas linguagens de programação?", 
        answer: ["&&", "and", "AND"] 
    },
    { 
        type: "multiple", 
        question: "O que é um algoritmo?", 
        options: ["Uma linguagem de programação", "Um conjunto de instruções para resolver um problema", "Um tipo de hardware", "Um erro de sintaxe"], 
        answer: "Um conjunto de instruções para resolver um problema" 
    },
    { 
        type: "multiple", 
        question: "Qual estrutura de controle é usada para tomar decisões?", 
        options: ["FOR", "WHILE", "IF-ELSE", "FUNCTION"], 
        answer: "IF-ELSE" 
    },
    { 
        type: "text", 
        question: "Qual palavra-chave é usada para retornar um valor de uma função?", 
        answer: ["return", "Return", "RETURN"] 
    },
    { 
        type: "multiple", 
        question: "O que é um array?", 
        options: ["Um tipo de variável", "Uma estrutura de dados que armazena múltiplos valores", "Um operador matemático", "Um tipo de loop"], 
        answer: "Uma estrutura de dados que armazena múltiplos valores" 
    },
    { 
        type: "text", 
        question: "Como se chama o processo de encontrar e corrigir erros no código?", 
        answer: ["debugging", "Debugging", "DEBUGGING"] 
    },
    { 
        type: "multiple", 
        question: "O que significa OOP?", 
        options: ["Operador Ou Programação", "Orientação a Objetos em Programação", "Ordem de Operações Padrão", "Organização de Operadores Primários"], 
        answer: "Orientação a Objetos em Programação" 
    },
    { 
        type: "multiple", 
        question: "Qual desses NÃO é um tipo de dado primário?", 
        options: ["Inteiro", "String", "Boolean", "Objeto"], 
        answer: "Objeto" 
    },
    { 
        type: "text", 
        question: "Qual operador é usado para verificar igualdade de valor E tipo em JavaScript?", 
        answer: ["===", "== ="] 
    },
    { 
        type: "multiple", 
        question: "O que é recursão?", 
        options: ["Um tipo de loop", "Quando uma função chama a si mesma", "Um erro de sintaxe", "Um operador matemático"], 
        answer: "Quando uma função chama a si mesma" 
    },
    { 
        type: "multiple", 
        question: "O que é um pseudocódigo?", 
        options: ["Uma linguagem de programação específica", "Uma descrição informal de um algoritmo", "Um código com erros", "Um tipo de comentário"], 
        answer: "Uma descrição informal de um algoritmo" 
    },
    { 
        type: "text", 
        question: "Qual estrutura de repetição executa pelo menos uma vez antes de verificar a condição?", 
        answer: ["do-while", "Do-While", "DO-WHILE"] 
    },
    { 
        type: "multiple", 
        question: "O que é um operador ternário?", 
        options: ["Um operador que usa três operandos", "Um operador para strings", "Um operador matemático complexo", "Um tipo especial de loop"], 
        answer: "Um operador que usa três operandos" 
    },
    { 
        type: "text", 
        question: "Como se chama o valor que indica o fim de uma estrutura de dados linear?", 
        answer: ["sentinel", "Sentinel", "SENTINEL"] 
    },
    { 
        type: "multiple", 
        question: "O que é um ponteiro?", 
        options: ["Um tipo de dado", "Uma variável que armazena um endereço de memória", "Um operador lógico", "Uma estrutura de repetição"], 
        answer: "Uma variável que armazena um endereço de memória" 
    },
    { 
        type: "multiple", 
        question: "Qual desses é um paradigma de programação?", 
        options: ["Python", "Funcional", "Java", "C++"], 
        answer: "Funcional" 
    },
    { 
        type: "text", 
        question: "Qual termo descreve quando duas variáveis apontam para o mesmo objeto na memória?", 
        answer: ["aliasing", "Aliasing", "ALIASING"] 
    },
    { 
        type: "multiple", 
        question: "O que é complexidade de tempo?", 
        options: ["Quanto tempo leva para escrever um programa", "Como o tempo de execução cresce em relação ao tamanho da entrada", "O horário que o programa é executado", "A duração de um loop"], 
        answer: "Como o tempo de execução cresce em relação ao tamanho da entrada" 
    }
];

    let shuffledQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let quizCompleted = false;
    let medalPopupActive = false;

    initQuiz();

    function initQuiz() {
        shuffledQuestions = shuffleQuestions([...questions]).map(q =>
            q.type === "multiple" ? shuffleQuestionOptions(q) : q
        );
        setupEventListeners();
        tryPlayBackgroundMusic();
        loadQuestion();
    }

    function setupEventListeners() {
        document.getElementById("mute-btn").addEventListener("click", toggleMute);
        document.getElementById("check-btn").addEventListener("click", checkAnswer);
        document.getElementById("next-btn").addEventListener("click", nextQuestion);
        document.getElementById("text-answer").addEventListener("keypress", function (e) {
            if (e.key === "Enter") checkAnswer();
        });

        document.querySelector(".medalha-popup-btn").addEventListener("click", closeMedalPopup);
        document.querySelector(".close-medalha-popup").addEventListener("click", closeMedalPopup);
    }

    function tryPlayBackgroundMusic() {
        audioManager.sounds.background.play().catch(() => {
            console.log("Reprodução automática bloqueada");
        });
    }

    function loadQuestion() {
        if (quizCompleted || medalPopupActive) return;
        if (currentQuestionIndex >= shuffledQuestions.length) {
            finishQuiz();
            return;
        }

        const quizContainer = document.getElementById("quiz-container");
        quizContainer.classList.add("fade-out");

        setTimeout(() => {
            resetQuestionUI();
            updateProgress();

            const currentQuestion = shuffledQuestions[currentQuestionIndex];
            document.getElementById("question").textContent = currentQuestion.question;
            setupQuestionOptions(currentQuestion);

            quizContainer.classList.remove("fade-out");
            quizContainer.classList.add("fade-in");
            setTimeout(() => quizContainer.classList.remove("fade-in"), 500);
        }, 300);
    }

    function resetQuestionUI() {
        document.getElementById("options").innerHTML = "";
        const textInput = document.getElementById("text-answer");
        textInput.classList.remove("correct", "incorrect");
        textInput.style.display = "none";
        textInput.value = "";
        textInput.removeAttribute("readonly");

        document.getElementById("correct-answer").style.display = "none";
        document.getElementById("check-btn").style.display = "inline-block";
        document.getElementById("next-btn").disabled = true;
    }

    function setupQuestionOptions(question) {
        if (question.type === "multiple") {
            question.options.forEach(option => {
                const li = document.createElement("li");
                li.textContent = option;
                li.addEventListener("click", () => selectOption(option, li));
                document.getElementById("options").appendChild(li);
            });
        } else {
            document.getElementById("text-answer").style.display = "block";
        }
    }

    function selectOption(selectedOption, selectedElement) {
        if (medalPopupActive) return;

        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const correctAnswer = currentQuestion.originalAnswer || currentQuestion.answer;
        const isCorrect = correctAnswer === selectedOption;

        document.querySelectorAll("#options li").forEach(li => {
            const isCorrectOption = correctAnswer === li.textContent;
            li.classList.add(isCorrectOption ? "correct" : "incorrect");
            li.style.pointerEvents = "none";
        });

        handleAnswerFeedback(isCorrect, correctAnswer);
    }

    function checkAnswer() {
        if (medalPopupActive) return;

        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        if (currentQuestion.type !== "text") return;

        const textInput = document.getElementById("text-answer");
        const userAnswer = textInput.value.trim();
        // Verifica resposta vazia
        if (!userAnswer) {
            showEmptyAnswerPopup();
            return;
        }

        // Função para exibir o pop-up
        function showEmptyAnswerPopup() {
            const popup = document.getElementById("empty-answer-popup");
            popup.style.display = "flex";

            const closeBtn = document.getElementById("close-empty-popup");
            closeBtn.onclick = () => {
                popup.style.display = "none";
                document.getElementById("text-answer").focus();
            };
        }


        const normalizedAnswers = Array.isArray(currentQuestion.answer)
            ? currentQuestion.answer.map(normalizeText)
            : [normalizeText(currentQuestion.answer)];

        const isCorrect = normalizedAnswers.includes(normalizeText(userAnswer));
        textInput.classList.add(isCorrect ? "correct" : "incorrect");
        textInput.classList.remove(isCorrect ? "incorrect" : "correct");
        textInput.setAttribute("readonly", true);

        handleAnswerFeedback(isCorrect, currentQuestion.answer);
    }

    function handleAnswerFeedback(isCorrect, correctAnswer) {
        if (isCorrect) {
            score++;
            audioManager.playSound("correct");

            if (shouldShowMedal()) {
                showMedal();
            } else {
                document.getElementById("next-btn").disabled = false;
            }
        } else {
            audioManager.playSound("incorrect");
            showCorrectAnswer(correctAnswer);
            document.getElementById("next-btn").disabled = false;
        }

        document.getElementById("check-btn").style.display = "none";
    }

    function showCorrectAnswer(answer) {
        const text = Array.isArray(answer) ? answer[0] : answer;
        const correctAnswerEl = document.getElementById("correct-answer");
        correctAnswerEl.textContent = `Resposta correta: ${text}`;
        correctAnswerEl.style.display = "block";
    }

    function nextQuestion() {
        if (medalPopupActive) return;
        currentQuestionIndex++;
        loadQuestion();
    }

    function shouldShowMedal() {
        const milestones = { bronze: 10, silver: 15, gold: shuffledQuestions.length };
        return Object.values(milestones).includes(score);
    }

    function showMedal() {
        medalPopupActive = true;
        const medalType = getMedalType();
        const medalData = medalhaSystem.getMedalData(medalType);

        document.querySelector(".medalha-popup-img").src = medalData.img;
        document.querySelector(".medalha-popup-title").textContent = medalData.title;
        document.querySelector(".medalha-popup-desc").textContent = medalData.desc;

        document.getElementById("medalha-popup").classList.add("active");
        document.getElementById("next-btn").disabled = false;
    }

    function closeMedalPopup() {
        document.getElementById("medalha-popup").classList.remove("active");
        medalPopupActive = false;
    }

    function getMedalType() {
        if (score === shuffledQuestions.length) return "gold";
        if (score >= 15) return "silver";
        if (score >= 10) return "bronze";
        return "";
    }

    function finishQuiz() {
        quizCompleted = true;
        document.querySelector(".container").innerHTML = `
            <h1>Quiz Concluído!</h1>
            <p>${playerName}, você acertou <strong>${score}</strong> de <strong>${shuffledQuestions.length}</strong> questões.</p>
            <div class="score-display ${getScoreClass()}">${calculatePercentage()}% de acertos</div>
            <h2>Top 10 Melhores</h2>
            <ol id="ranking-list"></ol>
            <button onclick="location.reload()">Tentar Novamente</button>
        `;

        saveScore();
        displayRanking();
        audioManager.sounds.background.pause();
        if (shouldShowMedal()) showMedal();
        else fireConfetti();
    }

    function toggleMute() {
        const isMuted = audioManager.toggleMute();
        document.getElementById("mute-btn").innerHTML = isMuted
            ? '<i class="fas fa-volume-mute"></i>'
            : '<i class="fas fa-music"></i>';
    }

    function updateProgress() {
        document.getElementById("current-question").textContent = currentQuestionIndex + 1;
        document.getElementById("total-questions").textContent = shuffledQuestions.length;
    }

    function calculatePercentage() {
        return Math.round((score / shuffledQuestions.length) * 100);
    }

    function getScoreClass() {
        const pct = calculatePercentage();
        if (pct >= 80) return "excellent";
        if (pct >= 60) return "good";
        if (pct >= 40) return "average";
        return "poor";
    }

  async function saveScore() {
    try {
        await addDoc(collection(db, "ranking-pontuacao"), {
            name: playerName,
            score: score,
            total: shuffledQuestions.length,
            date: new Date().toISOString()
        });
    } catch (error) {
        console.error("Erro ao salvar pontuação no Firestore:", error);
    }
}
    async function saveScore() {
    try {
        await addDoc(collection(db, "ranking-pontuacao"), {
            name: playerName,
            score: score,
            total: shuffledQuestions.length,
            date: new Date().toISOString()
        });
    } catch (error) {
        console.error("Erro ao salvar pontuação no Firestore:", error);
    }
    }

    async function displayRanking() {
    const list = document.getElementById("ranking-list");
    list.innerHTML = "";

    try {
        const q = query(collection(db, "ranking-pontuacao"), orderBy("score", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        
        let rank = 1;
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const li = document.createElement("li");
            li.innerHTML = `<span class="rank">${rank++}.</span> <span class="name">${data.name}</span> <span class="score">${data.score}/${data.total}</span>`;
            list.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao carregar ranking do Firestore:", error);
    }
    }

});
