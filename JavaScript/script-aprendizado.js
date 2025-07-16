// Ativa modo escuro se estiver ativado no localStorage
const darkMode = localStorage.getItem("darkMode") === "true";
if (darkMode) document.body.classList.add("dark-mode");

// Manipulação de vídeo modal
const videoBtns = document.querySelectorAll('.video-btn');
const modal = document.getElementById('videoModal');
const container = document.getElementById('videoContainer');

// Ao clicar no botão "Veja na prática"
videoBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const videoSrc = btn.getAttribute('data-video');
    let videoHTML = '';

    if (videoSrc.includes("youtube")) {
      videoHTML = `<iframe src="${videoSrc}" frameborder="0" allowfullscreen></iframe>`;
    } else {
      videoHTML = `<video controls><source src="${videoSrc}" type="video/mp4">Seu navegador não suporta vídeos.</video>`;
    }

    container.innerHTML = videoHTML;
    modal.style.display = 'flex';
  });
});

// Fecha o modal
function fecharModal() {
  modal.style.display = 'none';
  container.innerHTML = '';
}

// Fecha ao clicar fora do conteúdo
window.addEventListener('click', function (e) {
  if (e.target === modal) fecharModal();
});
// Expansão dos botões de módulo
document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const conteudo = btn.nextElementSibling;
    conteudo.style.display = conteudo.style.display === 'block' ? 'none' : 'block';
  });
});

// Modal de vídeo
function fecharModal() {
  const modal = document.getElementById('videoModal');
  const container = document.getElementById('videoContainer');
  container.innerHTML = '';
  modal.style.display = 'none';
}

document.querySelectorAll('.video-btn').forEach(button => {
  button.addEventListener('click', () => {
    const videoSrc = button.getAttribute('data-video');
    const isYoutube = videoSrc.includes("youtube.com");

    const videoElement = isYoutube
      ? `<iframe width="100%" height="100%" src="${videoSrc}" frameborder="0" allowfullscreen></iframe>`
      : `<video controls autoplay><source src="${videoSrc}" type="video/mp4">Seu navegador não suporta vídeos.</video>`;

    document.getElementById('videoContainer').innerHTML = videoElement;
    document.getElementById('videoModal').style.display = 'flex';
  });
});

// Modo escuro (carregado no início)
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}
