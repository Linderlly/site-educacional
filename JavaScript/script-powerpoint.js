import MedalhaSystem from './sistema-medalhas.js';
import AudioManager from './audio-manager.js';
import { shuffleQuestions, normalizeText, fireConfetti, shuffleQuestionOptions } from './utils.js';

document.addEventListener("DOMContentLoaded", function () {
    // ============== INICIALIZAÇÃO DOS MÓDULOS ==============
    const medalhaSystem = new MedalhaSystem();
    const audioManager = new AudioManager();

    // ============== CONFIGURAÇÕES INICIAIS ==============
    const playerName = localStorage.getItem("username") || "Aluno";
    document.getElementById("player-name").textContent = `Jogador: ${playerName}`;

// ============== PERGUNTAS DO QUIZ ==============
const questions = [
    { 
        type: "multiple", 
        question: "Qual atalho inicia a apresentação de slides no PowerPoint?", 
        options: ["F5", "Ctrl + S", "Ctrl + P", "F12"], 
        answer: "F5" 
    },
    { 
        type: "multiple", 
        question: "Qual guia permite adicionar animações no PowerPoint?", 
        options: ["Animação", "Inserir", "Design", "Transição"], 
        answer: "Animação" 
    },
    { 
        type: "text", 
        question: "Qual atalho para salvar uma apresentação no PowerPoint?", 
        answer: ["Ctrl + B", "ctrl+b", "ctrl + b", "CTRL+B", "CTRL + B", "Ctrl+B", "CTRL + b", "CTRL+b"] 
    },
    { 
        type: "text", 
        question: "Qual atalho para duplicar um slide no PowerPoint?", 
        answer: ["Ctrl + D", "ctrl+d", "ctrl + d", "CTRL+D", "CTRL + D", "Ctrl+D", "CTRL + d", "CTRL+d"] 
    },
    { 
        type: "text", 
        question: "Qual guia permite gravar a apresentação de Slides no PowerPoint", 
        answer: ["GRAVAÇÃO", "Gravação", "Gravacao", "GRAVACAO", "Gravaçao", "GRAVAÇAO"] 
    },
    { 
        type: "multiple", 
        question: "O que é um slide mestre no PowerPoint?", 
        options: ["Um modelo de slide", "Um slide animado", "Um slide oculto", "Um slide de título"], 
        answer: "Um modelo de slide" 
    },
    { 
        type: "multiple", 
        question: "Qual guia permite adicionar transições entre slides?", 
        options: ["Transição", "Animação", "Design", "Inserir"], 
        answer: "Transição" 
    },
    { 
        type: "multiple", 
        question: "O que é um tema no PowerPoint?", 
        options: ["Um conjunto de cores e fontes", "Um tipo de animação", "Um modelo de slide", "Um atalho de teclado"], 
        answer: "Um conjunto de cores e fontes" 
    },
    { 
        type: "text", 
        question: "Qual atalho para inserir um novo slide no PowerPoint?", 
        answer: ["Ctrl + M", "ctrl+m", "ctrl + m", "CTRL+M", "CTRL + M", "Ctrl+M", "CTRL + m", "CTRL+m"] 
    },
    { 
        type: "multiple", 
        question: "O que é um layout de slide no PowerPoint?", 
        options: ["Um modelo de organização de conteúdo", "Um tipo de animação", "Um slide mestre", "Um tema"], 
        answer: "Um modelo de organização de conteúdo" 
    },
    { 
        type: "multiple", 
        question: "Qual atalho exibe um slide em tela cheia no PowerPoint?", 
        options: ["Shift + F5", "Ctrl + F5", "Alt + F5", "F12"], 
        answer: "Shift + F5" 
    },
    { 
        type: "multiple", 
        question: "Qual guia permite adicionar gráficos em uma apresentação do PowerPoint?", 
        options: ["Inserir", "Design", "Animação", "Transição"], 
        answer: "Inserir" 
    },
    { 
        type: "text", 
        question: "Qual atalho para desfazer uma ação no PowerPoint?", 
        answer: ["Ctrl + Z", "ctrl+z", "ctrl + z", "CTRL+Z", "CTRL + Z", "Ctrl+Z", "CTRL + z", "CTRL+z"] 
    },
    { 
        type: "text", 
        question: "Qual atalho para refazer uma ação no PowerPoint?", 
        answer: ["Ctrl + Y", "ctrl+y", "ctrl + y", "CTRL+Y", "CTRL + Y", "Ctrl+Y", "CTRL + y", "CTRL+y"] 
    },
    { 
        type: "multiple", 
        question: "Onde você pode alterar o tamanho dos slides no PowerPoint?", 
        options: ["Design > Tamanho do Slide", "Inserir > Layout", "Animação > Personalizar Animação", "Exibição > Modos de Exibição"], 
        answer: "Design > Tamanho do Slide" 
    },
    { 
        type: "multiple", 
        question: "Qual guia permite inserir vídeos no PowerPoint?", 
        options: ["Inserir", "Design", "Animação", "Exibição"], 
        answer: "Inserir" 
    },
    { 
        type: "text", 
        question: "Qual atalho para abrir uma nova apresentação no PowerPoint?", 
        answer: ["Ctrl + O", "ctrl+o", "ctrl + o", "CTRL+O", "CTRL + O", "Ctrl+O", "CTRL + o", "CTRL+o"] 
    },
    { 
        type: "multiple", 
        question: "Qual ferramenta do PowerPoint permite desenhar à mão livre em um slide?", 
        options: ["Caneta", "Marcador", "Pincel", "Borracha"], 
        answer: "Caneta" 
    },
    { 
        type: "text", 
        question: "Qual atalho para iniciar a apresentação de slides do slide atual?", 
        answer: ["Shift + F5", "shift+f5", "Shift+F5", "SHIFT+F5", "SHIFT + F5", "shift + f5"] 
    },
    { 
        type: "multiple", 
        question: "Qual formato padrão de arquivo é usado no PowerPoint?", 
        options: [".pptx", ".docx", ".xlsx", ".pdf"], 
        answer: ".pptx" 
    }
];

    // ============== VARIÁVEIS DE ESTADO ==============
    let shuffledQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let quizCompleted = false;

    // ============== INICIALIZAÇÃO ==============
    initQuiz();

    function initQuiz() {
        if (questions.length === 0) {
            showError("Nenhuma pergunta foi definida no quiz!");
            return;
        }

        // Embaralha questões e alternativas
        shuffledQuestions = shuffleQuestions([...questions]).map(q => {
            return q.type === "multiple" ? shuffleQuestionOptions(q) : q;
        });
        
        console.log("Questões e alternativas embaralhadas:", shuffledQuestions);
        
        setupEventListeners();
        tryPlayBackgroundMusic();
        loadQuestion();
    }

    function setupEventListeners() {
        // Botão de mudo
        document.getElementById("mute-btn").addEventListener("click", toggleMute);
        
        // Botões do quiz
        document.getElementById("check-btn").addEventListener("click", checkAnswer);
        document.getElementById("next-btn").addEventListener("click", nextQuestion);
        
        // Tecla Enter para resposta textual
        document.getElementById("text-answer").addEventListener("keypress", function(e) {
            if (e.key === "Enter") checkAnswer();
        });
    }

    function tryPlayBackgroundMusic() {
        audioManager.sounds.background.play().catch(e => {
            console.log("Reprodução automática bloqueada");
        });
    }

    // ============== LÓGICA DO QUIZ ==============
    function loadQuestion() {
        if (quizCompleted) return;
        
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
        const optionsList = document.getElementById("options");
        optionsList.innerHTML = "";
        
        document.getElementById("text-answer").style.display = "none";
        document.getElementById("text-answer").value = "";
        document.getElementById("correct-answer").style.display = "none";
        document.getElementById("check-btn").style.display = "inline-block";
        document.getElementById("next-btn").disabled = true;
    }

    function setupQuestionOptions(question) {
        if (question.type === "multiple") {
            const optionsList = document.getElementById("options");
            question.options.forEach(option => {
                const li = document.createElement("li");
                li.textContent = option;
                li.addEventListener("click", () => selectOption(option, li));
                optionsList.appendChild(li);
            });
        } else {
            document.getElementById("text-answer").style.display = "block";
        }
    }

    function selectOption(selectedOption, selectedElement) {
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const correctAnswer = currentQuestion.originalAnswer || currentQuestion.answer;
        const isCorrect = correctAnswer === selectedOption;
        
        document.querySelectorAll("#options li").forEach(li => {
            const optionIsCorrect = correctAnswer === li.textContent;
            li.classList.add(optionIsCorrect ? "correct" : "incorrect");
            li.style.pointerEvents = "none";
        });

        handleAnswerFeedback(isCorrect, correctAnswer);
    }

    function checkAnswer() {
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        
        if (currentQuestion.type === "text") {
            const userAnswer = document.getElementById("text-answer").value.trim();
            const normalizedAnswers = Array.isArray(currentQuestion.answer) 
                ? currentQuestion.answer.map(ans => normalizeText(ans))
                : [normalizeText(currentQuestion.answer)];
                
            const isCorrect = normalizedAnswers.includes(normalizeText(userAnswer));
            handleAnswerFeedback(isCorrect, currentQuestion.answer);
            document.getElementById("text-answer").setAttribute("readonly", true);
        }
    }

    function handleAnswerFeedback(isCorrect, correctAnswer) {
        if (isCorrect) {
            score++;
            audioManager.playSound('correct');
            medalhaSystem.checkMilestones(score, shuffledQuestions.length);
        } else {
            audioManager.playSound('incorrect');
            showCorrectAnswer(correctAnswer);
        }
        
        document.getElementById("check-btn").style.display = "none";
        document.getElementById("next-btn").disabled = false;
    }

    function showCorrectAnswer(answer) {
        const correctAnswerText = Array.isArray(answer) ? answer[0] : answer;
        const correctAnswerElement = document.getElementById("correct-answer");
        correctAnswerElement.textContent = `Resposta correta: ${correctAnswerText}`;
        correctAnswerElement.style.display = "block";
    }

    function nextQuestion() {
        currentQuestionIndex++;
        loadQuestion();
    }

    function finishQuiz() {
        quizCompleted = true;
        const container = document.querySelector(".container");
        container.innerHTML = `
            <h1>Quiz Concluído!</h1>
            <p>${playerName}, você acertou <strong>${score}</strong> de <strong>${shuffledQuestions.length}</strong> questões.</p>
            <div class="score-display ${getScoreClass()}">
                ${calculatePercentage()}% de acertos
            </div>
            <h2>Top 10 Melhores</h2>
            <ol id="ranking-list"></ol>
            <button onclick="restartQuiz()">Tentar Novamente</button>
        `;
        
        saveScore();
        displayRanking();
        audioManager.sounds.background.pause();
        fireConfetti();
    }

    // ============== FUNÇÕES AUXILIARES ==============
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
        const percentage = calculatePercentage();
        if (percentage >= 80) return "excellent";
        if (percentage >= 60) return "good";
        if (percentage >= 40) return "average";
        return "poor";
    }

    function saveScore() {
        let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
        ranking.push({ 
            name: playerName, 
            score,
            date: new Date().toLocaleDateString(),
            total: shuffledQuestions.length
        });
        ranking.sort((a, b) => b.score - a.score);
        localStorage.setItem("ranking", JSON.stringify(ranking.slice(0, 10)));
    }

    function displayRanking() {
        const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
        const rankingList = document.getElementById("ranking-list");
        rankingList.innerHTML = "";
        
        ranking.forEach((player, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="rank">${index + 1}.</span>
                <span class="name">${player.name}</span>
                <span class="score">${player.score}/${player.total}</span>
                <span class="date">${player.date}</span>
            `;
            rankingList.appendChild(li);
        });
    }

    function showError(message) {
        const container = document.querySelector(".container");
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Erro no Quiz</h2>
                <p>${message}</p>
                <button onclick="window.location.href='/site-educacional/index.html'">Voltar</button>
            </div>
        `;
        console.error(message);
    }
});

// Funções globais
window.restartQuiz = function() {
    window.location.reload();
};

window.toggleDarkMode = function() {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);
};