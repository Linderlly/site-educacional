document.getElementById("view-ranking-btn").addEventListener("click", function() {
    displayRanking();
    const popup = document.getElementById("ranking-popup");
    popup.classList.add("active");
});


    document.getElementById("close-popup").addEventListener("click", function() {
    const popup = document.getElementById("ranking-popup");
    popup.classList.remove("active");
});

    window.addEventListener("click", function(event) {
    const popup = document.getElementById("ranking-popup");
    if (event.target === popup) {
        popup.classList.remove("active");
    }
});
        
        const isDarkMode = localStorage.getItem("darkMode") === "true";
        if (isDarkMode) {
            document.body.classList.add("dark-mode");
        }
        
        document.getElementById("toggle-dark-mode").addEventListener("click", function() {
            document.body.classList.toggle("dark-mode");
            const isDarkMode = document.body.classList.contains("dark-mode");
            localStorage.setItem("darkMode", isDarkMode); 
        });
 
        function displayRanking() {
            let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
            let rankingList = document.getElementById("ranking-list");

            rankingList.innerHTML = ""; 

            ranking.forEach((player, index) => {
                let listItem = document.createElement("li");
                listItem.textContent = `${index + 1}. ${player.name} - ${player.score} pts`;
                rankingList.appendChild(listItem);
            });
        }
        document.getElementById("view-ranking-btn").addEventListener("click", function() {
            displayRanking(); 
            document.getElementById("ranking-popup").style.display = "block";
        });

        document.getElementById("close-popup").addEventListener("click", function() {
            document.getElementById("ranking-popup").style.display = "none";
        });
        window.addEventListener("click", function(event) {
            const popup = document.getElementById("ranking-popup");
            if (event.target === popup) {
                popup.style.display = "none";
            }
        });

        function startQuiz() {
            const name = document.getElementById("username").value.trim();
            const nameHelp = document.getElementById("name-help");

            if (name.length >= 3 && /^[a-zA-Z\s]+$/.test(name)) {
                localStorage.setItem("username", name);
                window.location.href = "./HTML/quiz-excel.html";
            } else {
                nameHelp.style.display = "block";
            }
        }

        document.getElementById("username").addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                startQuiz();
            }
        });
        // Abrir popup de informações
document.getElementById("info-btn").addEventListener("click", function () {
    const infoPopup = document.getElementById("info-popup");
    infoPopup.classList.add("active");
});

// Fechar popup de informações
document.getElementById("close-info-popup").addEventListener("click", function () {
    const infoPopup = document.getElementById("info-popup");
    infoPopup.classList.remove("active");
});

// Fechar popup ao clicar fora dele
window.addEventListener("click", function (event) {
    const infoPopup = document.getElementById("info-popup");
    if (event.target === infoPopup) {
        infoPopup.classList.remove("active");
    }
});
// Função para abrir o pop-up de opções de quiz
function openQuizOptions() {
    const username = document.getElementById("username").value.trim();
    const nameHelp = document.getElementById("name-help");

    // Valida o nome do usuário
    if (username.length >= 3 && /^[a-zA-Z\s]+$/.test(username)) {
        localStorage.setItem("username", username);
        const quizOptionsPopup = document.getElementById("quiz-options-popup");
        quizOptionsPopup.classList.add("active");
    } else {
        nameHelp.style.display = "block"; // Exibe a mensagem de erro
    }
}

// Função para fechar o pop-up de opções de quiz
document.getElementById("close-quiz-options-popup").addEventListener("click", function () {
    const quizOptionsPopup = document.getElementById("quiz-options-popup");
    quizOptionsPopup.classList.remove("active");
});

// Função para redirecionar para a página do quiz escolhido
function redirectToQuiz(quizType) {
    switch (quizType) {
        case "excel":
            window.location.href = "./HTML/quiz-excel.html";
            break;
        case "word":
            window.location.href = "./HTML/quiz-word.html";
            break;
        case "powerpoint":
            window.location.href = "./HTML/quiz-powerpoint.html";
            break;
        default:
            console.error("Tipo de quiz inválido");
    }
}

// Fechar pop-up ao clicar fora dele
window.addEventListener("click", function (event) {
    const quizOptionsPopup = document.getElementById("quiz-options-popup");
    if (event.target === quizOptionsPopup) {
        quizOptionsPopup.classList.remove("active");
    }
});