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
    let medalPopupActive = false;

    // ============== INICIALIZAÇÃO ==============
    initQuiz();

    function initQuiz() {
        if (questions.length === 0) {
            showError("Nenhuma pergunta foi definida no quiz!");
            return;
        }

        shuffledQuestions = shuffleQuestions([...questions]).map(q => {
            return q.type === "multiple" ? shuffleQuestionOptions(q) : q;
        });
        
        setupEventListeners();
        tryPlayBackgroundMusic();
        loadQuestion();
    }

    function setupEventListeners() {
        document.getElementById("mute-btn").addEventListener("click", toggleMute);
        document.getElementById("check-btn").addEventListener("click", checkAnswer);
        document.getElementById("next-btn").addEventListener("click", nextQuestion);
        document.getElementById("text-answer").addEventListener("keypress", function(e) {
            if (e.key === "Enter") checkAnswer();
        });

        document.querySelector('.medalha-popup-btn').addEventListener('click', closeMedalPopup);
        document.querySelector('.close-medalha-popup').addEventListener('click', closeMedalPopup);
    }

    function tryPlayBackgroundMusic() {
        audioManager.sounds.background.play().catch(e => {
            console.log("Reprodução automática bloqueada");
        });
    }

    // ============== LÓGICA DO QUIZ ==============
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
        const optionsList = document.getElementById("options");
        optionsList.innerHTML = "";
        
        const textInput = document.getElementById("text-answer");
        textInput.style.display = "none";
        textInput.value = "";
        textInput.removeAttribute("readonly");
        
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
        if (medalPopupActive) return;
        
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
        if (medalPopupActive) return;
        
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        
        if (currentQuestion.type === "text") {
            const textInput = document.getElementById("text-answer");
            const userAnswer = textInput.value.trim();
            
            if (!userAnswer) {
                alert("Por favor, digite sua resposta!");
                return;
            }
            
            const normalizedAnswers = Array.isArray(currentQuestion.answer) 
                ? currentQuestion.answer.map(ans => normalizeText(ans))
                : [normalizeText(currentQuestion.answer)];
                
            const isCorrect = normalizedAnswers.includes(normalizeText(userAnswer));
            handleAnswerFeedback(isCorrect, currentQuestion.answer);
            textInput.setAttribute("readonly", true);
        }
    }

    function handleAnswerFeedback(isCorrect, correctAnswer) {
        if (isCorrect) {
            score++;
            audioManager.playSound('correct');
            
            if (shouldShowMedal()) {
                showMedal();
            } else {
                document.getElementById("next-btn").disabled = false;
            }
        } else {
            audioManager.playSound('incorrect');
            showCorrectAnswer(correctAnswer);
            document.getElementById("next-btn").disabled = false;
        }
        
        document.getElementById("check-btn").style.display = "none";
    }

    function showCorrectAnswer(answer) {
        const correctAnswerText = Array.isArray(answer) ? answer[0] : answer;
        const correctAnswerElement = document.getElementById("correct-answer");
        correctAnswerElement.textContent = `Resposta correta: ${correctAnswerText}`;
        correctAnswerElement.style.display = "block";
    }

    function nextQuestion() {
        if (medalPopupActive) return;
        
        currentQuestionIndex++;
        loadQuestion();
    }

    // ============== SISTEMA DE MEDALHAS ==============
    function shouldShowMedal() {
        const milestones = {
            'bronze': 10,
            'silver': 15,
            'gold': shuffledQuestions.length
        };
        
        return Object.values(milestones).includes(score);
    }

    function showMedal() {
        medalPopupActive = true;
        const medalType = getMedalType();
        const medalData = medalhaSystem.getMedalData(medalType);
        
        document.querySelector('.medalha-popup-img').src = medalData.img;
        document.querySelector('.medalha-popup-title').textContent = medalData.title;
        document.querySelector('.medalha-popup-desc').textContent = medalData.desc;
        
        document.getElementById('medalha-popup').classList.add('active');
        document.getElementById("next-btn").disabled = false;
    }

    function closeMedalPopup() {
        document.getElementById('medalha-popup').classList.remove('active');
        medalPopupActive = false;
    }

    function getMedalType() {
        if (score === shuffledQuestions.length) return 'gold';
        if (score >= 15) return 'silver';
        if (score >= 10) return 'bronze';
        return '';
    }

    // ============== FINALIZAÇÃO ==============
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
        
        if (shouldShowMedal()) {
            showMedal();
        } else {
            fireConfetti();
        }
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
};import MedalhaSystem from './sistema-medalhas.js';
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
    let medalPopupActive = false;

    // ============== INICIALIZAÇÃO ==============
    initQuiz();

    function initQuiz() {
        if (questions.length === 0) {
            showError("Nenhuma pergunta foi definida no quiz!");
            return;
        }

        shuffledQuestions = shuffleQuestions([...questions]).map(q => {
            return q.type === "multiple" ? shuffleQuestionOptions(q) : q;
        });
        
        setupEventListeners();
        tryPlayBackgroundMusic();
        loadQuestion();
    }

    function setupEventListeners() {
        document.getElementById("mute-btn").addEventListener("click", toggleMute);
        document.getElementById("check-btn").addEventListener("click", checkAnswer);
        document.getElementById("next-btn").addEventListener("click", nextQuestion);
        document.getElementById("text-answer").addEventListener("keypress", function(e) {
            if (e.key === "Enter") checkAnswer();
        });

        document.querySelector('.medalha-popup-btn').addEventListener('click', closeMedalPopup);
        document.querySelector('.close-medalha-popup').addEventListener('click', closeMedalPopup);
    }

    function tryPlayBackgroundMusic() {
        audioManager.sounds.background.play().catch(e => {
            console.log("Reprodução automática bloqueada");
        });
    }

    // ============== LÓGICA DO QUIZ ==============
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
        const optionsList = document.getElementById("options");
        optionsList.innerHTML = "";
        
        const textInput = document.getElementById("text-answer");
        textInput.style.display = "none";
        textInput.value = "";
        textInput.removeAttribute("readonly");
        
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
        if (medalPopupActive) return;
        
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
        if (medalPopupActive) return;
        
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        
        if (currentQuestion.type === "text") {
            const textInput = document.getElementById("text-answer");
            const userAnswer = textInput.value.trim();
            
            if (!userAnswer) {
                alert("Por favor, digite sua resposta!");
                return;
            }
            
            const normalizedAnswers = Array.isArray(currentQuestion.answer) 
                ? currentQuestion.answer.map(ans => normalizeText(ans))
                : [normalizeText(currentQuestion.answer)];
                
            const isCorrect = normalizedAnswers.includes(normalizeText(userAnswer));
            handleAnswerFeedback(isCorrect, currentQuestion.answer);
            textInput.setAttribute("readonly", true);
        }
    }

    function handleAnswerFeedback(isCorrect, correctAnswer) {
        if (isCorrect) {
            score++;
            audioManager.playSound('correct');
            
            if (shouldShowMedal()) {
                showMedal();
            } else {
                document.getElementById("next-btn").disabled = false;
            }
        } else {
            audioManager.playSound('incorrect');
            showCorrectAnswer(correctAnswer);
            document.getElementById("next-btn").disabled = false;
        }
        
        document.getElementById("check-btn").style.display = "none";
    }

    function showCorrectAnswer(answer) {
        const correctAnswerText = Array.isArray(answer) ? answer[0] : answer;
        const correctAnswerElement = document.getElementById("correct-answer");
        correctAnswerElement.textContent = `Resposta correta: ${correctAnswerText}`;
        correctAnswerElement.style.display = "block";
    }

    function nextQuestion() {
        if (medalPopupActive) return;
        
        currentQuestionIndex++;
        loadQuestion();
    }

    // ============== SISTEMA DE MEDALHAS ==============
    function shouldShowMedal() {
        const milestones = {
            'bronze': 10,
            'silver': 15,
            'gold': shuffledQuestions.length
        };
        
        return Object.values(milestones).includes(score);
    }

    function showMedal() {
        medalPopupActive = true;
        const medalType = getMedalType();
        const medalData = medalhaSystem.getMedalData(medalType);
        
        document.querySelector('.medalha-popup-img').src = medalData.img;
        document.querySelector('.medalha-popup-title').textContent = medalData.title;
        document.querySelector('.medalha-popup-desc').textContent = medalData.desc;
        
        document.getElementById('medalha-popup').classList.add('active');
        document.getElementById("next-btn").disabled = false;
    }

    function closeMedalPopup() {
        document.getElementById('medalha-popup').classList.remove('active');
        medalPopupActive = false;
    }

    function getMedalType() {
        if (score === shuffledQuestions.length) return 'gold';
        if (score >= 15) return 'silver';
        if (score >= 10) return 'bronze';
        return '';
    }

    // ============== FINALIZAÇÃO ==============
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
        
        if (shouldShowMedal()) {
            showMedal();
        } else {
            fireConfetti();
        }
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