import MedalhaSystem from './sistema-medalhas.js';
import AudioManager from './audio-manager.js';
import { shuffleQuestions, normalizeText, fireConfetti, shuffleQuestionOptions } from './utils.js';

document.addEventListener("DOMContentLoaded", function () {
    // ============== INICIALIZAÇÃO DOS MÓDULOS ==============
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

    // ============== CONFIGURAÇÕES INICIAIS ==============
    const playerName = localStorage.getItem("username") || "Aluno";
    document.getElementById("player-name").textContent = `Jogador: ${playerName}`;

   // ============== PERGUNTAS DO QUIZ ==============
   const questions = [
    { 
        type: "multiple", 
        question: "Qual fórmula soma um intervalo no Excel?", 
        options: ["=SOMA(A1:A10)", "=SOMAR(A1:A10)", "=ADD(A1:A10)", "=SUMAR(A1:A10)"], 
        answer: "=SOMA(A1:A10)" 
    },
    { 
        type: "multiple", 
        question: "Qual função busca valores na vertical?", 
        options: ["SOMASE", "ÍNDICE", "CORRESP", "PROCV"], 
        answer: "PROCV" 
    },
    { 
        type: "text", 
        question: "Qual atalho para salvar um arquivo no Excel?", 
        answer: ["Ctrl + B", "ctrl+b", "ctrl + b", "CTRL+B", "CTRL + B", "Ctrl+B", "CTRL + b", "CTRL+b"] 
    },
    { 
        type: "text", 
        question: "Qual o atalho para fechar uma aba no Excel?", 
        answer: ["Ctrl + W", "ctrl+w", "ctrl + W", "CTRL+W", "CTRL + W", "Ctrl+W", "CTRL + w", "CTRL+w"] 
    },
    { 
        type: "text", 
        question: "Qual o atalho para abrir uma nova planilha?", 
        answer: ["Ctrl + O", "ctrl+o", "ctrl + o", "CTRL+O", "CTRL + O", "Ctrl+O", "CTRL + o", "CTRL+o"] 
    },
    { 
        type: "multiple", 
        question: "Qual função busca valores na horizontal?", 
        options: ["PROCH", "PROCV", "ÍNDICE", "MÍNIMO"], 
        answer: "PROCH" 
    },
    { 
        type: "multiple", 
        question: "O que faz a função ÍNDICE?", 
        options: ["Retorna o valor de uma célula específica", "Soma valores", "Conta células", "Filtra dados"], 
        answer: "Retorna o valor de uma célula específica" 
    },
    { 
        type: "multiple", 
        question: "O que faz a função SE?", 
        options: ["Soma valores", "Verifica uma condição", "Filtra dados", "Conta células"], 
        answer: "Verifica uma condição" 
    },
    { 
        type: "text", 
        question: "Como escrever uma função SE que retorna 'Aprovado' se a nota for maior ou igual a 7 e 'Reprovado' caso contrário?", 
        answer: [`=SE(A1>=7;"Aprovado";"Reprovado")`, `=se(A1>=7;"aprovado";"reprovado")`] 
    },
    { 
        type: "multiple", 
        question: "O que faz a função CONCATENAR?", 
        options: ["Junta textos", "Soma números", "Cria gráficos", "Busca valores"], 
        answer: "Junta textos" 
    },
    { 
        type: "text", 
        question: "Qual a função que retorna o tamanho de um texto no Excel?", 
        answer: ["NÚM.CARACT", "num.caract"] 
    },
    { 
        type: "multiple", 
        question: "Qual guia do Excel permite criar gráficos?", 
        options: ["Página inicial", "Dados", "Fórmulas", "Inserir"], 
        answer: "Inserir" },
    { 
        type: "multiple",
        question: "O que é uma Tabela Dinâmica?", 
        options: ["Uma função de soma", "Um tipo de gráfico", "Uma ferramenta para análise de dados", "Um atalho de teclado"], 
        answer: "Uma ferramenta para análise de dados" 
    },
    { 
        type: "multiple",
        question: "O que significa uma referência absoluta no Excel?", 
        options: ["Uma referência fixa", "Uma referência variável", "Um número inteiro", "Um erro de célula"], 
        answer: "Uma referência fixa" 
    },
    { 
        type: "text",
         question: "Como escrever uma referência absoluta para a célula A1?", 
        answer: ["$A$1"] 
    },
    { 
        type: "multiple", 
        question: "O que significa o erro #DIV/0!?", 
        options: ["Célula vazia", "Divisão por zero", "Erro de sintaxe", "Função desconhecida"], 
        answer: "Divisão por zero" 
    },
    { 
        type: "multiple", 
        question: "O que significa o erro #NOME?", 
        options: ["Erro de fórmula", "Erro de célula", "Fórmula com referência inválida", "Falta de memória"], 
        answer: "Erro de fórmula" 
    },
    { 
        type: "multiple", 
        question: "O que faz a função ARRED?", 
        options: ["Arredonda um número", "Calcula a raiz quadrada", "Conta células", "Soma valores"], 
        answer: "Arredonda um número" 
    },
    { 
        type: "text", 
        question: "Qual função retorna o menor valor de um intervalo?", 
        answer: ["MÍNIMO", "Mínimo", "mínimo"] 
    },
    { 
        type: "multiple", 
        question: "O que faz a função HOJE?", 
        options: ["Formata células", "Soma datas", "Retorna a data atual", "Exclui valores"], 
        answer: "Retorna a data atual" 
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
        
        // Adiciona classe visual com base na resposta
        if (isCorrect) {
            textInput.classList.add("correct");
            textInput.classList.remove("incorrect");
        } else {
            textInput.classList.add("incorrect");
            textInput.classList.remove("correct");
        }

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