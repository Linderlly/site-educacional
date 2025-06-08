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
