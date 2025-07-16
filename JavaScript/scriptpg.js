import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore, collection, addDoc, getDocs, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC4gn4D8D9NmoRKsubV7d2wOvLpwYQhns0",
    authDomain: "site-educacional1.firebaseapp.com",
    projectId: "site-educacional1",
    storageBucket: "site-educacional1.appspot.com",
    messagingSenderId: "202688212315",
    appId: "1:202688212315:web:85288eff89d3df77b7fe7e",
    measurementId: "G-GFBVPMRMK2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
window.db = db;

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

// Controle do menu lateral
document.getElementById("menu-toggle").addEventListener("click", () => {
    const menu = document.getElementById("main-menu");
    menu.classList.toggle("active");
    document.body.classList.toggle("menu-open", menu.classList.contains("active"));
});

// Modo escuro
const isDarkMode = localStorage.getItem("darkMode") === "true";
if (isDarkMode) document.body.classList.add("dark-mode");

document.getElementById("toggle-dark-mode").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// Popup de informações
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

// Popup de opções de quiz
function openQuizOptions() {
    const username = document.getElementById("username").value.trim();
    const nameHelp = document.getElementById("name-help");

    if (username.length >= 3 && /^[a-zA-Z\s]+$/.test(username)) {
        localStorage.setItem("username", username);
        document.getElementById("quiz-options-popup").classList.add("active");
        saveUserToFirestore(username);
    } else {
        nameHelp.style.display = "block";
    }
}
window.openQuizOptions = openQuizOptions;

document.getElementById("close-quiz-options-popup").addEventListener("click", () => {
    document.getElementById("quiz-options-popup").classList.remove("active");
});

window.addEventListener("click", (event) => {
    if (event.target === document.getElementById("quiz-options-popup")) {
        document.getElementById("quiz-options-popup").classList.remove("active");
    }
});

// Redirecionamento para quizzes
function redirectToQuiz(quizType) {
    const quizMap = {
        "excel": "./HTML/quiz-excel.html",
        "word": "./HTML/quiz-word.html",
        "powerpoint": "./HTML/quiz-powerpoint.html",
        "logicaprogramacao": "./HTML/logicaprogramacao.html"
    };
    window.location.href = quizMap[quizType] || "#";
}
window.redirectToQuiz = redirectToQuiz;

// Popup de ranking
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

// Enter no campo de nome
document.getElementById("username").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        openQuizOptions();
    }
});

// Busca e exibe ranking
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

            let medal = "";
            if (index === 1) medal = "🥇 ";
            else if (index === 2) medal = "🥈 ";
            else if (index === 3) medal = "🥉 ";

            const listItem = document.createElement("li");
            listItem.textContent = `${index}. ${medal}${name} - ${score} pts`;
            listItem.classList.add(`rank-${index}`);

            rankingList.appendChild(listItem);
            index++;
        });
    } catch (error) {
        console.error("Erro ao buscar ranking:", error);
    }
}