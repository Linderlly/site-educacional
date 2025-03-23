document.addEventListener("DOMContentLoaded", function () {
    // Obtém o nome do jogador armazenado no localStorage ou define como "Aluno" se não houver
    const playerName = localStorage.getItem("username") || "Aluno";
    document.getElementById("player-name").textContent = `Jogador: ${playerName}`;

    // Referências aos elementos de áudio para os sons de acerto e erro
    const correctSound = document.getElementById("correct-sound");
    const incorrectSound = document.getElementById("incorrect-sound");

    // Referência ao som de fundo
    const backgroundMusic = document.getElementById("background-music");

    // Inicia o som de fundo ao carregar a página
    backgroundMusic.play();

    // Referência ao botão de mudo
    const muteBtn = document.getElementById("mute-btn");

    // Estado inicial do som (não mudo)
    let isMuted = false;

    // Adiciona o evento de clique ao botão de mudo
    muteBtn.addEventListener("click", function () {
        isMuted = !isMuted; // Alterna entre mudo e não mudo

        if (isMuted) {
            backgroundMusic.pause(); // Pausa o som de fundo
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Altera o ícone para mudo
        } else {
            backgroundMusic.play(); // Toca o som de fundo
            muteBtn.innerHTML = '<i class="fas fa-music"></i>'; // Altera o ícone para nota musical
        }
    });

    // Lista de perguntas e respostas específicas para o Word
    const questions = [
        { type: "multiple", question: "Qual atalho salva um documento no Word?", options: ["Ctrl + S", "Ctrl + N", "Ctrl + O", "Ctrl + P"], answer: "Ctrl + S" },
        { type: "multiple", question: "Qual função permite revisar a ortografia no Word?", options: ["Revisão > Ortografia e Gramática", "Inserir > Comentário", "Layout > Quebras", "Design > Temas"], answer: "Revisão > Ortografia e Gramática" },
        { type: "text", question: "Qual atalho para copiar texto no Word?", answer: ["Ctrl + C", "ctrl+c", "ctrl + c", "CTRL+C", "CTRL + C", "Ctrl+C", "CTRL + c", "CTRL+c"] },
        { type: "text", question: "Qual atalho para colar texto no Word?", answer: ["Ctrl + V", "ctrl+v", "ctrl + v", "CTRL+V", "CTRL + V", "Ctrl+V", "CTRL + v", "CTRL+v"] },
        { type: "text", question: "Qual atalho para desfazer uma ação no Word?", answer: ["Ctrl + Z", "ctrl+z", "ctrl + z", "CTRL+Z", "CTRL + Z", "Ctrl+Z", "CTRL + z", "CTRL+z"] },
        { type: "multiple", question: "O que é um cabeçalho no Word?", options: ["Texto no topo da página", "Uma imagem", "Um gráfico", "Uma tabela"], answer: "Texto no topo da página" },
        { type: "multiple", question: "O que é um rodapé no Word?", options: ["Texto no final da página", "Uma nota de rodapé", "Uma lista", "Um índice"], answer: "Texto no final da página" },
        { type: "multiple", question: "Qual guia permite inserir uma tabela no Word?", options: ["Inserir", "Layout", "Design", "Referências"], answer: "Inserir" },
        { type: "text", question: "Qual atalho para imprimir um documento no Word?", answer: ["Ctrl + P", "ctrl+p", "ctrl + p", "CTRL+P", "CTRL + P", "Ctrl+P", "CTRL + p", "CTRL+p"] },
        { type: "multiple", question: "O que é um estilo no Word?", options: ["Um conjunto de formatações", "Um tipo de fonte", "Um modelo de documento", "Um atalho de teclado"], answer: "Um conjunto de formatações" }
    ];

    // Função para embaralhar as perguntas
    function shuffleQuestions(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos
        }
        return array;
    }

    // Embaralha as perguntas antes de começar o quiz
    const shuffledQuestions = shuffleQuestions(questions);

    let currentQuestionIndex = 0; // Índice da pergunta atual
    let score = 0; // Pontuação do jogador

    // Função para carregar a próxima pergunta
    function loadQuestion() {
        const quizContainer = document.getElementById("quiz-container");

        // Adiciona a animação de saída
        quizContainer.classList.add("fade-out");

        // Aguarda o término da animação de saída antes de carregar a próxima pergunta
        setTimeout(() => {
            // Limpa a animação de saída
            quizContainer.classList.remove("fade-out");

            // Atualiza o número da pergunta atual e o total de perguntas
            document.getElementById("current-question").textContent = currentQuestionIndex + 1;
            document.getElementById("total-questions").textContent = shuffledQuestions.length;

            // Obtém a pergunta atual
            let currentQuestion = shuffledQuestions[currentQuestionIndex];

            // Define o texto da pergunta
            document.getElementById("question").textContent = currentQuestion.question;

            // Limpa as opções anteriores
            const optionsList = document.getElementById("options");
            optionsList.innerHTML = "";

            // Oculta o campo de texto e limpa seu valor
            const textInput = document.getElementById("text-answer");
            textInput.style.display = "none";
            textInput.value = "";
            textInput.removeAttribute("readonly");

            // Oculta o texto da resposta correta
            const correctAnswerText = document.getElementById("correct-answer");
            correctAnswerText.style.display = "none";
            correctAnswerText.textContent = "";

            // Exibe o botão "Verificar" e desabilita o botão "Próxima pergunta"
            document.getElementById("check-btn").style.display = "inline-block";
            document.getElementById("next-btn").disabled = true;

            // Se a pergunta for do tipo múltipla escolha, carrega as opções
            if (currentQuestion.type === "multiple") {
                currentQuestion.options.forEach(option => {
                    const li = document.createElement("li");
                    li.textContent = option;
                    li.onclick = () => checkAnswer(option, li);
                    optionsList.appendChild(li);
                });
            } else {
                // Se a pergunta for do tipo texto, exibe o campo de texto
                textInput.style.display = "block";
                document.getElementById("check-btn").onclick = checkTextAnswer;
            }

            // Adiciona a animação de entrada
            quizContainer.classList.add("fade-in");

            // Remove a animação de entrada após a transição
            setTimeout(() => {
                quizContainer.classList.remove("fade-in");
            }, 500);
        }, 500); // Tempo correspondente à duração da animação de saída
    }

    // Função para verificar a resposta
    function checkAnswer(selectedOption, selectedElement) {
        let currentQuestion = shuffledQuestions[currentQuestionIndex];
        let correctAnswerText = document.getElementById("correct-answer");

        // Marca a resposta correta e as incorretas
        document.querySelectorAll("#options li").forEach(li => {
            if (currentQuestion.answer === li.textContent) {
                li.classList.add("correct");
                li.style.backgroundColor = "green";
            } else {
                li.classList.add("incorrect");
                li.style.backgroundColor = "red";
            }
            li.style.pointerEvents = "none"; // Desabilita cliques nas opções
        });

        // Verifica se a resposta está correta
        if (currentQuestion.answer === selectedOption) {
            score++; // Incrementa a pontuação
            correctSound.currentTime = 0; // Reinicia o som de acerto
            correctSound.play(); // Toca o som de acerto
        } else {
            // Exibe a resposta correta e toca o som de erro
            correctAnswerText.textContent = `Resposta correta: ${currentQuestion.answer}`;
            correctAnswerText.style.display = "block";
            incorrectSound.currentTime = 0; // Reinicia o som de erro
            incorrectSound.play(); // Toca o som de erro
        }

        // Oculta o botão "Verificar" e habilita o botão "Próxima pergunta"
        document.getElementById("check-btn").style.display = "none";
        document.getElementById("next-btn").disabled = false;
    }

    // Função para verificar a resposta do tipo texto
    function checkTextAnswer() {
        let currentQuestion = shuffledQuestions[currentQuestionIndex];
        let textInput = document.getElementById("text-answer");
        let correctAnswerText = document.getElementById("correct-answer");

        // Obtém a resposta do usuário e converte para minúsculas
        let userAnswer = textInput.value.trim().toLowerCase();

        // Reinicia os sons
        correctSound.pause();
        incorrectSound.pause();

        // Verifica se a resposta do usuário está correta
        if (currentQuestion.answer.some(correct => correct.toLowerCase() === userAnswer)) {
            textInput.style.borderColor = "green"; // Marca como correta
            score++; // Incrementa a pontuação
            correctSound.currentTime = 0; // Reinicia o som de acerto
            correctSound.play(); // Toca o som de acerto
        } else {
            textInput.style.borderColor = "red"; // Marca como incorreta
            correctAnswerText.textContent = `Resposta correta: ${currentQuestion.answer[0]}`; // Exibe a resposta correta
            correctAnswerText.style.display = "block";
            incorrectSound.currentTime = 0; // Reinicia o som de erro
            incorrectSound.play(); // Toca o som de erro
        }

        textInput.setAttribute("readonly", true); // Bloqueia o campo de texto

        // Oculta o botão "Verificar" e habilita o botão "Próxima pergunta"
        document.getElementById("check-btn").style.display = "none";
        document.getElementById("next-btn").disabled = false;
    }

    // Avança para a próxima pergunta ou finaliza o quiz
    document.getElementById("next-btn").addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < shuffledQuestions.length) {
            loadQuestion(); // Carrega a próxima pergunta com transição
        } else {
            finishQuiz(); // Finaliza o quiz
        }
    });

    // Função para finalizar o quiz
    function finishQuiz() {
        const container = document.querySelector(".container");
        container.innerHTML = `<h1>Parabéns, ${playerName}!</h1>
                               <p>Você acertou <strong>${score}</strong> de <strong>${shuffledQuestions.length}</strong> questões.</p>
                               <h2>Ranking dos Melhores</h2>
                               <ol id="ranking-list"></ol>
                               <button onclick="restartQuiz()">Tentar Novamente</button>`;

        saveScore(playerName, score); // Salva a pontuação no ranking
        displayRanking(); // Exibe o ranking

        // Para o som de fundo ao finalizar o quiz
        backgroundMusic.pause();

        // Dispara os confetes
        confetti({
            particleCount: 150, // Quantidade de confetes
            spread: 70, // Quão espalhados os confetes estarão
            origin: { y: 0.6 }, // Origem dos confetes (0.6 = 60% da altura da tela)
        });

        // Adiciona mais confetes após um pequeno intervalo
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 60,
                origin: { y: 0.5 },
            });
        }, 500);

        // Adiciona ainda mais confetes após outro intervalo
        setTimeout(() => {
            confetti({
                particleCount: 200,
                spread: 90,
                origin: { y: 0.7 },
            });
        }, 1000);
    }

    // Função para salvar a pontuação
    function saveScore(name, score) {
        let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
        ranking.push({ name, score });
        ranking.sort((a, b) => b.score - a.score); // Ordena o ranking
        localStorage.setItem("ranking", JSON.stringify(ranking.slice(0, 10))); // Limita o ranking a 10 jogadores
    }

    // Função para exibir o ranking
    function displayRanking() {
        let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
        let rankingList = document.getElementById("ranking-list");

        ranking.forEach((player, index) => {
            let listItem = document.createElement("li");
            listItem.textContent = `${index + 1}. ${player.name} - ${player.score} pts`;
            rankingList.appendChild(listItem);
        });
    }

    // Função para reiniciar o quiz
    window.restartQuiz = function () {
        window.location.href = "/site-educacional/index.html";
    };

    // Carrega a primeira pergunta ao iniciar o quiz
    loadQuestion();
});