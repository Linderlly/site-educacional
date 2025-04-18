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
        question: "Qual atalho salva um documento no Word?",
        options: ["Ctrl + B", "Ctrl + N", "Ctrl + O", "Ctrl + P"],
        answer: "Ctrl + B"
    },
    {
        type: "multiple",
        question: "Qual função permite revisar a ortografia no Word?",
        options: ["Revisão > Ortografia e Gramática", "Inserir > Comentário", "Layout > Quebras", "Design > Temas"],
        answer: "Revisão > Ortografia e Gramática"
    },
    {
        type: "text",
        question: "Qual atalho para copiar texto no Word?",
        answer: ["Ctrl + C", "ctrl+c", "ctrl + c", "CTRL+C", "CTRL + C", "Ctrl+C", "CTRL + c", "CTRL+c"]
    },
    {
        type: "text",
        question: "Qual atalho para colar texto no Word?",
        answer: ["Ctrl + V", "ctrl+v", "ctrl + v", "CTRL+V", "CTRL + V", "Ctrl+V", "CTRL + v", "CTRL+v"]
    },
    {
        type: "text",
        question: "Qual atalho para desfazer uma ação no Word?",
        answer: ["Ctrl + Z", "ctrl+z", "ctrl + z", "CTRL+Z", "CTRL + Z", "Ctrl+Z", "CTRL + z", "CTRL+z"]
    },
    {
        type: "multiple",
        question: "O que é um cabeçalho no Word?",
        options: ["Texto no topo da página", "Uma imagem", "Um gráfico", "Uma tabela"],
        answer: "Texto no topo da página"
    },
    {
        type: "multiple",
        question: "O que é um rodapé no Word?",
        options: ["Texto no final da página", "Uma nota de rodapé", "Uma lista", "Um índice"],
        answer: "Texto no final da página"
    },
    {
        type: "multiple",
        question: "Qual guia permite inserir uma tabela no Word?",
        options: ["Inserir", "Layout", "Design", "Referências"],
        answer: "Inserir"
    },
    {
        type: "text",
        question: "Qual atalho para imprimir um documento no Word?",
        answer: ["Ctrl + P", "ctrl+p", "ctrl + p", "CTRL+P", "CTRL + P", "Ctrl+P", "CTRL + p", "CTRL+p"]
    },
    {
        type: "multiple",
        question: "O que é um estilo no Word?",
        options: ["Um conjunto de formatações", "Um tipo de fonte", "Um modelo de documento", "Um atalho de teclado"],
        answer: "Um conjunto de formatações"
    },
    {
        type: "multiple",
        question: "Qual atalho permite recortar um texto no Word?",
        options: ["Ctrl + X", "Ctrl + C", "Ctrl + V", "Ctrl + Z"],
        answer: "Ctrl + X"
    },
    {
        type: "multiple",
        question: "Qual atalho abre um novo documento no Word?",
        options: ["Ctrl + O", "Ctrl + S", "Ctrl + N", "Ctrl + P"],
        answer: "Ctrl + O"
    },
    {
        type: "text",
        question: "Qual atalho permite selecionar todo o texto no Word?",
        answer: ["Ctrl + T", "ctrl+t", "ctrl + t", "CTRL+T", "CTRL + T", "Ctrl+T", "CTRL + t", "CTRL+t"]
    },
    {
        type: "multiple",
        question: "Qual função permite adicionar números de página em um documento?",
        options: ["Inserir > Número de Página", "Layout > Margens", "Design > Temas", "Revisão > Contagem de Palavras"],
        answer: "Inserir > Número de Página"
    },
    {
        type: "text",
        question: "Qual atalho permite refazer uma ação no Word?",
        answer: ["Ctrl + R", "ctrl+r", "ctrl + r", "CTRL+R", "CTRL + R", "Ctrl+R", "CTRL + r", "CTRL+r"]
    },
    {
        type: "multiple",
        question: "Qual é o formato padrão de arquivos do Word?",
        options: [".docx", ".pdf", ".txt", ".xlsx"],
        answer: ".docx"
    },
    {
        type: "multiple",
        question: "Onde você pode alterar a orientação da página no Word?",
        options: ["Layout > Orientação", "Inserir > Tabela", "Design > Planos de Fundo", "Revisão > Comparar"],
        answer: "Layout > Orientação"
    },
    {
        type: "multiple",
        question: "Qual guia permite adicionar imagens ao documento?",
        options: ["Inserir", "Página Inicial", "Layout", "Referências"],
        answer: "Inserir"
    },
    {
        type: "text",
        question: "Qual atalho abre a opção de salvar como no Word?",
        answer: ["F12", "f12", "F-12", "F 12", "f 12"]
    },
    {
        type: "multiple",
        question: "Qual é a função do 'Modo de Exibição de Impressão' no Word?",
        options: ["Visualizar como o documento será impresso", "Editar apenas o texto", "Ativar a escrita manual", "Converter o documento para PDF"],
        answer: "Visualizar como o documento será impresso"
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