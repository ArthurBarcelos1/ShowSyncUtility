// Seletores dos elementos HTML
const videoUrlInput = document.getElementById("video-url");
const currentTimeDisplay = document.getElementById("current-time");
const keypointNameInput = document.getElementById("keypoint-name");
const newKeypointButton = document.getElementById("new-keypoint");

// Contêiner onde o player será renderizado
const videoContainer = document.querySelector(".video-container");

// Variável para o player do YouTube
let player;

// Criação de uma área para exibir os KeyPoints
const keypointsList = document.createElement("div");
keypointsList.id = "keypoints-list";
document.body.appendChild(keypointsList); // Adiciona o container ao final do body

// Função para carregar o vídeo a partir de uma URL ou ID
function loadVideo(url) {
    let videoId;

    // Verifica se é uma URL completa ou apenas o ID do vídeo
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const urlParams = new URL(url).searchParams;
        videoId = urlParams.get("v") || url.split("/").pop();
    } else {
        videoId = url; // Assume que é apenas o ID
    }

    // Remove o player existente, se houver
    if (player) {
        player.destroy();
    }

    // Cria um novo player do YouTube
    player = new YT.Player("video-placeholder", {
        videoId: videoId,
        width: "800", // Ajuste o tamanho conforme necessário
        height: "450",
        events: {
            onReady: startTrackingTime,
            onError: handlePlayerError,
        },
    });
}

// Função para tratar erros de reprodução
function handlePlayerError(event) {
    if (event.data === 150 || event.data === 101) {
        const videoId = player.getVideoData().video_id;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        alert(`O vídeo selecionado não permite reprodução em outros sites. Você pode assisti-lo no YouTube: ${videoUrl}`);
        window.open(videoUrl, "_blank");
    } else {
        alert("Erro ao carregar o vídeo. Verifique o link e tente novamente.");
    }
}

// Função para atualizar o tempo atual do vídeo
function startTrackingTime() {
    setInterval(() => {
        if (player && player.getCurrentTime) {
            const currentTime = player.getCurrentTime().toFixed(2); // Pega o tempo atual do vídeo
            currentTimeDisplay.textContent = `${currentTime} s`;
        }
    }, 100); // Atualiza a cada 100ms
}

// Escuta o clique no botão para criar um novo KeyPoint
newKeypointButton.addEventListener("click", () => {
    const keypointName = keypointNameInput.value.trim();

    // Verifica se o nome do KeyPoint é válido e o player está carregado
    if (keypointName && player) {
        const currentTime = player.getCurrentTime().toFixed(2);

        // Cria um elemento para exibir o KeyPoint
        const keypointItem = document.createElement("div");
        keypointItem.textContent = `${currentTime} | ${keypointName}`;
        keypointItem.style.borderBottom = "1px solid #ccc";
        keypointItem.style.padding = "5px 0";
        keypointsList.insertBefore(keypointItem, keypointsList.firstChild);

        // Limpa o campo de entrada
        keypointNameInput.value = "";
    } else {
        alert("Insira um nome para o KeyPoint ou carregue um vídeo primeiro!");
    }
});

// Carrega a API do YouTube
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Define a função global para inicializar a API
window.onYouTubeIframeAPIReady = function () {
    // Insere dinamicamente o placeholder para o player
    const placeholder = document.createElement("div");
    placeholder.id = "video-placeholder";
    videoContainer.appendChild(placeholder);

    console.log("API do YouTube carregada com sucesso.");
};

// Evento para capturar o link do vídeo e carregar no iframe
videoUrlInput.addEventListener("change", () => {
    const url = videoUrlInput.value;
    loadVideo(url);
});
