const PORTA_BACKEND = "3000";
const socket = io(`http://localhost:${PORTA_BACKEND}`);

// Validação de Sessão
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    window.location.href = "index.html";
}

const meuTelefone = usuarioLogado.telefone;
const meuNome = usuarioLogado.apelido || meuTelefone;

let contactoAtivo = null;

// Elementos do DOM
const nomeUtilizador = document.getElementById("nomeUtilizador");
const avatarUtilizador = document.getElementById("avatarUtilizador");
const btnSair = document.getElementById("btnSair");
const listaContactos = document.getElementById("listaContactos");

const avatarContactoAtivo = document.getElementById("avatarContactoAtivo");
const nomeContactoAtivo = document.getElementById("nomeContactoAtivo");
const statusContactoAtivo = document.getElementById("statusContactoAtivo");
const containerMensagens = document.getElementById("containerMensagens");

const inputMensagem = document.getElementById("inputMensagem");
const btnEnviar = document.getElementById("btnEnviar");

// 1. Inicializar Dados do Utilizador Logado
if (nomeUtilizador) nomeUtilizador.innerText = meuNome;
if (avatarUtilizador) avatarUtilizador.innerText = meuNome.charAt(0).toUpperCase();

socket.emit("registrar_utilizador", meuTelefone);

// 2. Procurar Utilizadores Registados no MariaDB
async function carregarContactos() {
    try {
        const resposta = await fetch(`http://localhost:3000/utilizadores?meuTelefone=${meuTelefone}`);
        const utilizadores = await resposta.json();

        if (!listaContactos) return;
        listaContactos.innerHTML = "";

        if (!Array.isArray(utilizadores) || utilizadores.length === 0) {
            listaContactos.innerHTML = `<div style="padding: 15px; text-align: center; color: #667781; font-size: 13px;">Nenhum outro utilizador encontrado.</div>`;
            return;
        }

        utilizadores.forEach((u, index) => {
            const nomeExibicao = u.apelido || u.telefone;
            const divItem = document.createElement("div");
            divItem.classList.add("chat-item");

            divItem.innerHTML = `
                <div class="user-avatar avatar-contact">${nomeExibicao.charAt(0).toUpperCase()}</div>
                <div class="chat-details">
                    <div class="chat-title">${nomeExibicao}</div>
                    <div class="chat-subtitle">${u.telefone}</div>
                </div>
            `;

            divItem.addEventListener("click", () => {
                selecionarContacto(u.telefone, nomeExibicao);
            });

            listaContactos.appendChild(divItem);

            // Seleciona automaticamente o primeiro contacto da lista
            if (index === 0) {
                selecionarContacto(u.telefone, nomeExibicao);
            }
        });

    } catch (erro) {
        console.error("Erro ao carregar contactos:", erro);
    }
}
// 3. Selecionar Contacto e Carregar Mensagens
async function selecionarContacto(telefone, nome) {
    contactoAtivo = telefone;
    if (nomeContactoAtivo) nomeContactoAtivo.innerText = nome;
    if (avatarContactoAtivo) avatarContactoAtivo.innerText = nome.charAt(0).toUpperCase();
    if (statusContactoAtivo) statusContactoAtivo.innerText = "online";

    carregarMensagens(telefone);
}

// 4. Carregar Histórico de Mensagens
async function carregarMensagens(telefoneDestino) {
    try {
        const resposta = await fetch(`http://localhost:${PORTA_BACKEND}/chat?remetente=${meuTelefone}&destino=${telefoneDestino}`);
        const mensagens = await resposta.json();

        if (!containerMensagens) return;
        containerMensagens.innerHTML = "";

        if (Array.isArray(mensagens)) {
            mensagens.forEach(msg => {
                exibirMensagem(msg.mensagem, msg.telefone_remetente === meuTelefone);
            });
        }

        rolarParaFim();
    } catch (erro) {
        console.error("Erro ao carregar mensagens:", erro);
    }
}

// 5. Exibir Mensagem na Tela
function exibirMensagem(texto, ehMinha) {
    if (!containerMensagens) return;

    // Se estiver a mensagem padrão de tela vazia, limpa antes
    const emptyChat = containerMensagens.querySelector(".empty-chat");
    if (emptyChat) emptyChat.remove();

    const divBalao = document.createElement("div");
    divBalao.classList.add("balao-mensagem");
    divBalao.classList.add(ehMinha ? "minha-mensagem" : "mensagem-recebida");
    divBalao.innerText = texto;

    containerMensagens.appendChild(divBalao);
    rolarParaFim();
}

function rolarParaFim() {
    if (containerMensagens) {
        containerMensagens.scrollTop = containerMensagens.scrollHeight;
    }
}

// 6. Enviar Mensagem
async function enviarMensagem() {
    const texto = inputMensagem ? inputMensagem.value.trim() : "";

    if (!texto) return;

    if (!contactoAtivo) {
        alert("Por favor, crie/selecione um contacto na lista para enviar mensagem.");
        return;
    }

    const dadosMensagem = {
        telefone_remetente: meuTelefone,
        telefone_destino: contactoAtivo,
        mensagem: texto
    };

    exibirMensagem(texto, true);
    if (inputMensagem) inputMensagem.value = "";

    try {
        await fetch(`http://localhost:${PORTA_BACKEND}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosMensagem)
        });

        socket.emit("enviar_mensagem", dadosMensagem);

    } catch (erro) {
        console.error("Erro ao enviar mensagem:", erro);
    }
}

// Ouvir mensagens em tempo real
socket.on("receber_mensagem", (dados) => {
    if (dados.telefone_remetente === contactoAtivo) {
        exibirMensagem(dados.mensagem, false);
    }
});

// Listeners
if (btnEnviar) btnEnviar.addEventListener("click", enviarMensagem);
if (inputMensagem) {
    inputMensagem.addEventListener("keypress", (e) => {
        if (e.key === "Enter") enviarMensagem();
    });
}

if (btnSair) {
    btnSair.addEventListener("click", () => {
        localStorage.removeItem("usuarioLogado");
        window.location.href = "index.html";
    });
}

// Inicializa a lista
carregarContactos();