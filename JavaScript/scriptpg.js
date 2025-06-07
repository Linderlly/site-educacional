// Firebase - IMPORTAÇÃO E INICIALIZAÇÃO
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configurações do Firebase (substitua por suas chaves, se necessário)
const firebaseConfig = {
    apiKey: "AIzaSyC4gn4D8D9NmoRKsubV7d2wOvLpwYQhns0",
    authDomain: "site-educacional1.firebaseapp.com",
    projectId: "site-educacional1",
    storageBucket: "site-educacional1.appspot.com",
    messagingSenderId: "202688212315",
    appId: "1:202688212315:web:85288eff89d3df77b7fe7e",
    measurementId: "G-GFBVPMRMK2"
};

// Inicializar Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Alternar modo escuro
const isDarkMode = localStorage.getItem("darkMode") === "true";
if (isDarkMode) document.body.classList.add("dark-mode");

document.getElementById("toggle-dark-mode").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// Abertura e fechamento de popups
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

    if (username.length >= 3 && /^[a-zA-Z\s]+$/.test(username)) {
        localStorage.setItem("username", username);
        document.getElementById("quiz-options-popup").classList.add("active");
        saveUserToFirestore(username); //  Salvar o nome do usuário no Firestore
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

// Redirecionar para o quiz
function redirectToQuiz(quizType) {
    const quizMap = {
        "excel": "./HTML/quiz-excel.html",
        "word": "./HTML/quiz-word.html",
        "powerpoint": "./HTML/quiz-powerpoint.html"
    };
    window.location.href = quizMap[quizType] || "#";
}
window.redirectToQuiz = redirectToQuiz;

// Exibir o ranking
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

// Validação do nome via Enter
document.getElementById("username").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        openQuizOptions();
    }
});

//  Salva nome do usuário no Firestore (coleção "usuarios")
async function saveUserToFirestore(name) {
    try {
        await addDoc(collection(db, "usuarios"), {
            name: name,
            createdAt: new Date()
        });
    } catch (error) {
        console.error("Erro ao salvar nome no Firestore:", error);
    }
}

// Exibe o ranking do Firestore (coleção "ranking")
async function displayRanking() {
    const rankingList = document.getElementById("ranking-list");
    rankingList.innerHTML = "";

    try {
        const rankingQuery = query(
            collection(db, "ranking"),
            orderBy("score", "desc"),
            limit(10)
        );
        const querySnapshot = await getDocs(rankingQuery);

        querySnapshot.forEach((doc, index) => {
            const player = doc.data();
            const listItem = document.createElement("li");
            listItem.textContent = `${index + 1}. ${player.name} - ${player.score} pts`;
            rankingList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Erro ao buscar ranking:", error);
    }
}
