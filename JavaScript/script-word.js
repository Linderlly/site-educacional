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
