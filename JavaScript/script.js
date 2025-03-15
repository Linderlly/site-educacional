document.addEventListener("DOMContentLoaded", function () {
    const playerName = localStorage.getItem("username") || "Aluno";
    document.getElementById("player-name").textContent = `Jogador: ${playerName}`;

    // Sons de feedback
    const correctSound = document.getElementById("correct-sound");
    const incorrectSound = document.getElementById("incorrect-sound");
    
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

    let currentQuestionIndex = 0;
    let score = 0;

    // Função para atualizar a barra de progresso
    function updateProgress() {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        document.getElementById("progress").style.width = `${progress}%`;
    }

    // Função para carregar a pergunta atual
    function loadQuestion() {
        // Atualiza o número da pergunta atual e o total de perguntas
        document.getElementById("current-question").textContent = currentQuestionIndex + 1;
        document.getElementById("total-questions").textContent = questions.length;

        // Restante do código da função loadQuestion...
        const questionElement = document.getElementById("question");
        const optionsList = document.getElementById("options");
        const textInput = document.getElementById("text-answer");
        const correctAnswerText = document.getElementById("correct-answer");
        const checkButton = document.getElementById("check-btn");
        const nextButton = document.getElementById("next-btn");

        let currentQuestion = questions[currentQuestionIndex];

        questionElement.textContent = currentQuestion.question;
        optionsList.innerHTML = "";
        textInput.style.display = "none";
        textInput.value = "";
        textInput.removeAttribute("readonly");
        correctAnswerText.style.display = "none";
        correctAnswerText.textContent = "";
        checkButton.style.display = "inline-block";
        nextButton.disabled = true;

        if (currentQuestion.type === "multiple") {
            currentQuestion.options.forEach(option => {
                const li = document.createElement("li");
                li.textContent = option;
                li.onclick = () => checkAnswer(option, li);
                optionsList.appendChild(li);
            });
        } else {
            textInput.style.display = "block";
            checkButton.onclick = checkTextAnswer;
        }
    }

    // Função para verificar a resposta (múltipla escolha)
    function checkAnswer(selectedOption, selectedElement) {
        let currentQuestion = questions[currentQuestionIndex];
        let correctAnswerText = document.getElementById("correct-answer");

        document.querySelectorAll("#options li").forEach(li => {
            if (currentQuestion.answer === li.textContent) {
                li.classList.add("correct");
                li.style.backgroundColor = "green";
            } else {
                li.classList.add("incorrect");
                li.style.backgroundColor = "red";
            }
            li.style.pointerEvents = "none";
        });

        if (currentQuestion.answer === selectedOption) {
            score++;
            correctSound.currentTime = 0;
            correctSound.play();
        } else {
            correctAnswerText.textContent = `Resposta correta: ${currentQuestion.answer}`;
            correctAnswerText.style.display = "block";
            incorrectSound.currentTime = 0;
            incorrectSound.play();
        }

        document.getElementById("check-btn").style.display = "none";
        document.getElementById("next-btn").disabled = false;
    }

    // Função para verificar a resposta (texto)
    function checkTextAnswer() {
        let currentQuestion = questions[currentQuestionIndex];
        let textInput = document.getElementById("text-answer");
        let correctAnswerText = document.getElementById("correct-answer");

        let userAnswer = textInput.value.trim().toLowerCase();

        correctSound.pause();
        incorrectSound.pause();

        if (currentQuestion.answer.some(correct => correct.toLowerCase() === userAnswer)) {
            textInput.style.borderColor = "green";
            score++;
            correctSound.currentTime = 0;
            correctSound.play();
        } else {
            textInput.style.borderColor = "red";
            correctAnswerText.textContent = `Resposta correta: ${currentQuestion.answer[0]}`;
            correctAnswerText.style.display = "block";
            incorrectSound.currentTime = 0;
            incorrectSound.play();
        }

        textInput.setAttribute("readonly", true);

        document.getElementById("check-btn").style.display = "none";
        document.getElementById("next-btn").disabled = false;
    }

    // Avança para a próxima pergunta
    document.getElementById("next-btn").addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            finishQuiz();
        }
    });

    // Finaliza o quiz
    function finishQuiz() {
        const container = document.querySelector(".container");
        container.innerHTML = `<h1>Parabéns, ${playerName}!</h1>
                               <p>Você acertou <strong>${score}</strong> de <strong>${questions.length}</strong> questões.</p>
                               <h2>Ranking dos Melhores</h2>
                               <ol id="ranking-list"></ol>
                               <button onclick="restartQuiz()">Tentar Novamente</button>`;

        saveScore(playerName, score);
        displayRanking();
    }

    // Salva a pontuação no localStorage
    function saveScore(name, score) {
        let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
        ranking.push({ name, score });
        ranking.sort((a, b) => b.score - a.score);
        localStorage.setItem("ranking", JSON.stringify(ranking.slice(0, 10)));
    }

    // Exibe o ranking
    function displayRanking() {
        let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
        let rankingList = document.getElementById("ranking-list");

        ranking.forEach((player, index) => {
            let listItem = document.createElement("li");
            listItem.textContent = `${index + 1}. ${player.name} - ${player.score} pts`;
            rankingList.appendChild(listItem);
        });
    }

    // Botão "Ver Ranking"
    document.getElementById("view-ranking-btn").addEventListener("click", function () {
        const container = document.querySelector(".container");
        container.innerHTML = `
            <h1>Ranking dos Melhores</h1>
            <ol id="ranking-list"></ol>
            <button id="back-to-quiz-btn">Voltar ao Quiz</button>
        `;

        displayRanking(); // Exibe o ranking

        // Botão "Voltar ao Quiz"
        document.getElementById("back-to-quiz-btn").addEventListener("click", function () {
            window.location.reload(); // Recarrega a página para voltar ao quiz
        });
    });

    // Botão "Voltar ao Início"
    document.getElementById("back-to-home-btn").addEventListener("click", function () {
        window.location.href = "index.html"; // Redireciona para a página inicial
    });

    // Reinicia o quiz
    window.restartQuiz = function () {
        window.location.href = "index.html";
    };

    // Carrega a primeira pergunta
    loadQuestion();
});