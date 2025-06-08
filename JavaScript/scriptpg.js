// Importa as funções necessárias do Firebase SDK v10.12.0
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore, collection, addDoc, getDocs, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuração do Firebase do seu projeto
const firebaseConfig = {
    apiKey: "AIzaSyC4gn4D8D9NmoRKsubV7d2wOvLpwYQhns0",
    authDomain: "site-educacional1.firebaseapp.com",
    projectId: "site-educacional1",
    storageBucket: "site-educacional1.firebasestorage.app",
    messagingSenderId: "202688212315",
    appId: "1:202688212315:web:85288eff89d3df77b7fe7e",
    measurementId: "G-GFBVPMRMK2"
};

// Inicializa o Firebase e o Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Deixa o Firestore acessível globalmente (caso precise em outro script)
window.db = db;

//Salva o nome do usuário no Firestore
async function saveUserToFirestore(nome) {
    try {
        await addDoc(collection(db, "usuarios"), {
            nome: nome,
            data: new Date()
        });
        console.log("Usuário salvo com sucesso no Firestore.");
    } catch (error) {
        console.error("Erro ao salvar usuário no Firestore:", error);
    }
}

// Alternar modo escuro
const isDarkMode = localStorage.getItem("darkMode") === "true";
if (isDarkMode) document.body.classList.add("dark-mode");

document.getElementById("toggle-dark-mode").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// Abertura e fechamento do pop-up de informações
document.getElementById("info-btn").addEventListener("click", () => {
    document.getElementById("info-popup").classList.add("active");
});
document.getElementById("close-info-popup").addEventListener("click", () => {
    document.getElementById("info-popup").classList.remove("active");
});
window.addEventListener("click", (event) => {
    if (event.target === document.getElementById("info-popup")) {
        document.getElementById("info-popup").classList.remove("active");
    }
});

// Abrir pop-up de opções de quiz
function openQuizOptions() {
    const username = document.getElementById("username").value.trim();
    const nameHelp = document.getElementById("name-help");

    // Validação: mínimo 3 letras e apenas letras e espaços
    if (username.length >= 3 && /^[a-zA-Z\s]+$/.test(username)) {
        localStorage.setItem("username", username);
        document.getElementById("quiz-options-popup").classList.add("active");

        // Salvar no Firestore
        saveUserToFirestore(username);
    } else {
        nameHelp.style.display = "block";
    }
}
window.openQuizOptions = openQuizOptions;

// Fechar o pop-up de opções
document.getElementById("close-quiz-options-popup").addEventListener("click", () => {
    document.getElementById("quiz-options-popup").classList.remove("active");
});
window.addEventListener("click", (event) => {
    if (event.target === document.getElementById("quiz-options-popup")) {
        document.getElementById("quiz-options-popup").classList.remove("active");
    }
});

// Redirecionar para a página do quiz conforme a escolha
function redirectToQuiz(quizType) {
    const quizMap = {
        "excel": "./HTML/quiz-excel.html",
        "word": "./HTML/quiz-word.html",
        "powerpoint": "./HTML/quiz-powerpoint.html"
    };
    window.location.href = quizMap[quizType] || "#";
}
window.redirectToQuiz = redirectToQuiz;

// Exibir o pop-up de ranking ao clicar no botão
document.getElementById("view-ranking-btn").addEventListener("click", async () => {
    await displayRanking();
    document.getElementById("ranking-popup").classList.add("active");
});
document.getElementById("close-popup").addEventListener("click", () => {
    document.getElementById("ranking-popup").classList.remove("active");
});
window.addEventListener("click", (event) => {
    if (event.target === document.getElementById("ranking-popup")) {
        document.getElementById("ranking-popup").classList.remove("active");
    }
});

// Pressionar "Enter" no campo de nome ativa o botão
document.getElementById("username").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        openQuizOptions();
    }
});

// Função para buscar e exibir o ranking dos 10 melhores jogadores
async function displayRanking() {
    const rankingList = document.getElementById("ranking-list");
    rankingList.innerHTML = "";

    try {
        const rankingQuery = query(
            collection(db, "ranking-pontuacao"),
            orderBy("score", "desc"),
            limit(10)
        );
        const querySnapshot = await getDocs(rankingQuery);

        let index = 1;
        querySnapshot.forEach((doc) => {
            const player = doc.data();
            const name = player.name || "Jogador Desconhecido";
            const score = typeof player.score === "number" && !isNaN(player.score) ? player.score : 0;

            // Medalha de acordo com a posição
            let medal = "";
            if (index === 1) medal = "🥇 ";
            else if (index === 2) medal = "🥈 ";
            else if (index === 3) medal = "🥉 ";

            // Cria o item do ranking
            const listItem = document.createElement("li");
            listItem.textContent = `${index}. ${medal}${name} - ${score} pts`;

            // Adiciona classe com base na posição (para estilização via CSS)
            listItem.classList.add(`rank-${index}`); // ex: rank-1, rank-2, ...

            // Adiciona ao ranking
            rankingList.appendChild(listItem);
            index++;
        });
    } catch (error) {
        console.error("Erro ao buscar ranking:", error);
    }
}