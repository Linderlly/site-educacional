document.addEventListener("DOMContentLoaded", function () {
    // ============== CONFIGURAÇÕES INICIAIS ==============
    const playerName = localStorage.getItem("username") || "Aluno";
    document.getElementById("player-name").textContent = `Jogador: ${playerName}`;

    // Elementos de áudio
    const correctSound = document.getElementById("correct-sound");
    const incorrectSound = document.getElementById("incorrect-sound");
    const backgroundMusic = document.getElementById("background-music");

    // Controles de áudio
    const muteBtn = document.getElementById("mute-btn");
    let isMuted = false;

    // ============== PERGUNTAS DO QUIZ ==============
    const questions = [
        { type: "multiple", question: "Qual fórmula soma um intervalo no Excel?", options: ["=SOMA(A1:A10)", "=SOMAR(A1:A10)", "=ADD(A1:A10)", "=SUMAR(A1:A10)"], answer: "=SOMA(A1:A10)" },
        { type: "multiple", question: "Qual função busca valores na vertical?", options: ["SOMASE", "ÍNDICE", "CORRESP", "PROCV"], answer: "PROCV" },
        { type: "text", question: "Qual atalho para salvar um arquivo no Excel?", answer: ["Ctrl + S", "ctrl+s", "ctrl + s", "CTRL+S", "CTRL + S", "Ctrl+S", "CTRL + s", "CTRL+s"] },
        { type: "text", question: "Qual o atalho para fechar o Excel?", answer: ["Ctrl + W", "ctrl+w", "ctrl + W", "CTRL+W", "CTRL + W", "Ctrl+W", "CTRL + w", "CTRL+w"] },
        { type: "text", question: "Qual o atalho para abrir uma nova planilha?", answer: ["Ctrl + N", "ctrl+n", "ctrl + n", "CTRL+N", "CTRL + N", "Ctrl+N", "CTRL + n", "CTRL+n"] },
        { type: "multiple", question: "Qual função busca valores na horizontal?", options: ["PROCH", "PROCV", "ÍNDICE", "MÍNIMO"], answer: "PROCH" },
        { type: "multiple", question: "O que faz a função ÍNDICE?", options: ["Retorna o valor de uma célula específica", "Soma valores", "Conta células", "Filtra dados"], answer: "Retorna o valor de uma célula específica" },
        { type: "multiple", question: "O que faz a função SE?", options: ["Soma valores", "Verifica uma condição", "Filtra dados", "Conta células"], answer: "Verifica uma condição" },
        { type: "text", question: "Como escrever uma função SE que retorna 'Aprovado' se a nota for maior ou igual a 7 e 'Reprovado' caso contrário?", answer: [`=SE(A1>=7;"Aprovado";"Reprovado")`, `=se(A1>=7;"aprovado";"reprovado")`] },
        { type: "multiple", question: "O que faz a função CONCATENAR?", options: ["Junta textos", "Soma números", "Cria gráficos", "Busca valores"], answer: "Junta textos" },
        { type: "text", question: "Qual a função que retorna o tamanho de um texto no Excel?", answer: ["NÚM.CARACT", "num.caract"] },
        { type: "multiple", question: "Qual guia do Excel permite criar gráficos?", options: ["Página inicial", "Dados", "Fórmulas", "Inserir"], answer: "Inserir" },
        { type: "multiple", question: "O que é uma Tabela Dinâmica?", options: ["Uma função de soma", "Um tipo de gráfico", "Uma ferramenta para análise de dados", "Um atalho de teclado"], answer: "Uma ferramenta para análise de dados" },
        { type: "multiple", question: "O que significa uma referência absoluta no Excel?", options: ["Uma referência fixa", "Uma referência variável", "Um número inteiro", "Um erro de célula"], answer: "Uma referência fixa" },
        { type: "text", question: "Como escrever uma referência absoluta para a célula A1?", answer: ["$A$1"] },
        { type: "multiple", question: "O que significa o erro #DIV/0!?", options: ["Célula vazia", "Divisão por zero", "Erro de sintaxe", "Função desconhecida"], answer: "Divisão por zero" },
        { type: "multiple", question: "O que significa o erro #NOME?", options: ["Erro de fórmula", "Erro de célula", "Fórmula com referência inválida", "Falta de memória"], answer: "Erro de fórmula" },
        { type: "multiple", question: "O que faz a função ARRED?", options: ["Arredonda um número", "Calcula a raiz quadrada", "Conta células", "Soma valores"], answer: "Arredonda um número" },
        { type: "text", question: "Qual função retorna o menor valor de um intervalo?", answer: ["MÍNIMO", "Mínimo", "mínimo"] },
        { type: "multiple", question: "O que faz a função HOJE?", options: ["Formata células", "Soma datas", "Retorna a data atual", "Exclui valores"], answer: "Retorna a data atual" }
    ];

    // ============== VARIÁVEIS DE ESTADO ==============
    let shuffledQuestions = shuffleQuestions([...questions]);
    let currentQuestionIndex = 0;
    let score = 0;
    let hintsUsed = 0;

    // ============== INICIALIZAÇÃO ==============
    init();

    // ============== FUNÇÕES PRINCIPAIS ==============
    function init() {
        setupEventListeners();
        tryPlayBackgroundMusic();
        loadQuestion();
    }

    function setupEventListeners() {
        // Controle de áudio
        muteBtn.addEventListener("click", toggleMute);
        
        // Botão de verificar (para perguntas textuais)
        document.getElementById("check-btn").addEventListener("click", checkTextAnswer);
        
        // Botão de próxima pergunta
        document.getElementById("next-btn").addEventListener("click", nextQuestion);
        
        // Botão de reiniciar (definido globalmente)
        window.restartQuiz = restartQuiz;
    }

    function tryPlayBackgroundMusic() {
        backgroundMusic.play().catch(e => {
            console.log("Reprodução automática bloqueada. Mostrar botão de ativação.");
            // Aqui você pode mostrar um botão para o usuário ativar o som
        });
    }

    // ============== LÓGICA DO QUIZ ==============
    function loadQuestion() {
        const quizContainer = document.getElementById("quiz-container");
        
        // Animação de transição
        quizContainer.classList.add("fade-out");
        setTimeout(() => {
            quizContainer.classList.remove("fade-out");
            
            // Atualiza contador de progresso
            updateProgress();
            
            const currentQuestion = shuffledQuestions[currentQuestionIndex];
            document.getElementById("question").textContent = currentQuestion.question;
            
            // Limpa opções anteriores
            const optionsList = document.getElementById("options");
            optionsList.innerHTML = "";
            
            // Configura campo de texto ou múltipla escolha
            const textInput = document.getElementById("text-answer");
            if (currentQuestion.type === "multiple") {
                textInput.style.display = "none";
                currentQuestion.options.forEach(option => {
                    const li = document.createElement("li");
                    li.textContent = option;
                    li.addEventListener("click", () => checkAnswer(option, li));
                    optionsList.appendChild(li);
                });
            } else {
                textInput.style.display = "block";
                textInput.value = "";
                textInput.removeAttribute("readonly");
            }
            
            // Reseta elementos de feedback
            document.getElementById("correct-answer").style.display = "none";
            document.getElementById("check-btn").style.display = "inline-block";
            document.getElementById("next-btn").disabled = true;
            
            // Animação de entrada
            quizContainer.classList.add("fade-in");
            setTimeout(() => quizContainer.classList.remove("fade-in"), 500);
            
        }, 500);
    }

    function checkAnswer(selectedOption, selectedElement) {
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const correctAnswerText = document.getElementById("correct-answer");
        
        // Marca todas as opções
        document.querySelectorAll("#options li").forEach(li => {
            const isCorrect = currentQuestion.answer === li.textContent;
            li.classList.add(isCorrect ? "correct" : "incorrect");
            li.style.pointerEvents = "none";
        });
        
        // Verifica se acertou
        const isCorrect = currentQuestion.answer === selectedOption;
        handleAnswerFeedback(isCorrect, currentQuestion.answer);
    }

    function checkTextAnswer() {
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const userAnswer = document.getElementById("text-answer").value.trim();
        const normalizedAnswers = currentQuestion.answer.map(ans => normalizeText(ans));
        const isCorrect = normalizedAnswers.includes(normalizeText(userAnswer));
        
        handleAnswerFeedback(isCorrect, currentQuestion.answer[0]);
        document.getElementById("text-answer").setAttribute("readonly", true);
    }

    function handleAnswerFeedback(isCorrect, correctAnswer) {
        if (isCorrect) {
            score++;
            playSound(correctSound);
            checkMilestones();
        } else {
            playSound(incorrectSound);
            document.getElementById("correct-answer").textContent = `Resposta correta: ${correctAnswer}`;
            document.getElementById("correct-answer").style.display = "block";
        }
        
        document.getElementById("check-btn").style.display = "none";
        document.getElementById("next-btn").disabled = false;
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < shuffledQuestions.length) {
            loadQuestion();
        } else {
            finishQuiz();
        }
    }

    // ============== SISTEMA DE MEDALHAS ==============
    function checkMilestones() {
        if (score === 10) {
            showMedal('bronze');
        } else if (score === 15) {
            showMedal('silver');
        } else if (score === shuffledQuestions.length) {
            showMedal('gold');
        }
    }

    function showMedal(medalType) {
        const medalData = {
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
        
        const medal = medalData[medalType];
        const medalPopup = document.getElementById('medalha-popup');
        
        // Configura o popup
        document.querySelector('.medalha-popup-img').src = medal.img;
        document.querySelector('.medalha-popup-title').textContent = medal.title;
        document.querySelector('.medalha-popup-desc').textContent = medal.desc;
        
        // Mostra o popup
        medalPopup.classList.add('active');
        
        // Configura eventos para fechar
        const closePopup = () => medalPopup.classList.remove('active');
        document.querySelector('.close-medalha-popup').onclick = closePopup;
        document.querySelector('.medalha-popup-btn').onclick = closePopup;
        medalPopup.onclick = (e) => e.target === medalPopup && closePopup();
        
        // Efeitos de confete
        fireConfetti();
    }

    // ============== FINALIZAÇÃO DO QUIZ ==============
    function finishQuiz() {
        const container = document.querySelector(".container");
        container.innerHTML = `
            <h1>Parabéns, ${playerName}!</h1>
            <p>Você acertou <strong>${score}</strong> de <strong>${shuffledQuestions.length}</strong> questões.</p>
            <h2>Ranking dos Melhores</h2>
            <ol id="ranking-list"></ol>
            <button onclick="restartQuiz()">Tentar Novamente</button>
        `;
        
        saveScore();
        displayRanking();
        backgroundMusic.pause();
        
        // Verifica se merece medalha ao finalizar
        if (score === shuffledQuestions.length) {
            showMedal('gold');
        } else if (score >= 15 && shuffledQuestions.length >= 15) {
            showMedal('silver');
        } else if (score >= 10) {
            showMedal('bronze');
        }
    }

    // ============== FUNÇÕES AUXILIARES ==============
    function toggleMute() {
        isMuted = !isMuted;
        if (isMuted) {
            backgroundMusic.pause();
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            backgroundMusic.play();
            muteBtn.innerHTML = '<i class="fas fa-music"></i>';
        }
    }

    function playSound(audioElement) {
        if (isMuted) return;
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.error("Erro ao reproduzir som:", e));
    }

    function fireConfetti() {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => confetti({ particleCount: 100, spread: 60, origin: { y: 0.5 } }), 500);
        setTimeout(() => confetti({ particleCount: 200, spread: 90, origin: { y: 0.7 } }), 1000);
    }

    function updateProgress() {
        document.getElementById("current-question").textContent = currentQuestionIndex + 1;
        document.getElementById("total-questions").textContent = shuffledQuestions.length;
        
        // Atualiza barra de progresso (se existir)
        const progressBar = document.getElementById("progress");
        if (progressBar) {
            const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    function normalizeText(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }

    function shuffleQuestions(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function saveScore() {
        let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
        ranking.push({ name: playerName, score });
        ranking.sort((a, b) => b.score - a.score);
        localStorage.setItem("ranking", JSON.stringify(ranking.slice(0, 10)));
    }

    function displayRanking() {
        const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
        const rankingList = document.getElementById("ranking-list");
        rankingList.innerHTML = "";
        
        ranking.forEach((player, index) => {
            const li = document.createElement("li");
            li.textContent = `${index + 1}. ${player.name} - ${player.score} pts`;
            rankingList.appendChild(li);
        });
    }

    function restartQuiz() {
        window.location.href = "/site-educacional/index.html";
    }
});