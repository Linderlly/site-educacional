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
                window.location.href = "./HTML/quiz.html";
            } else {
                nameHelp.style.display = "block";
            }
        }

        document.getElementById("username").addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                startQuiz();
            }
        });