const btnAcao = document.querySelector("#btnAcao");
const campoInput = document.querySelector("#tel");
const seletorDdi = document.querySelector("#seletor-ddi");
const grupoConectado = document.querySelector("#grupo-conectado");

const labelCampo = document.querySelector("#label-campo");
const indicadorPasso = document.querySelector("#indicador-passo");

let passoAtual = 1;
let telefoneDigitado = "";

btnAcao.addEventListener("click", async () => {
    if (passoAtual === 1) {
        const telefone = campoInput.value.trim();

        if (!telefone) {
            alert("Por favor, digite o número de telefone.");
            return;
        }

        // Mantém apenas os números digitados pelo utilizador
        telefoneDigitado = telefone.replace(/\D/g, "");

        // Transição visual para a etapa da senha (Passo 2)
        passoAtual = 2;
        if (seletorDdi) seletorDdi.style.display = "none";
        if (grupoConectado) grupoConectado.style.display = "none";

        labelCampo.innerText = "Senha";
        indicadorPasso.innerText = "Passo 2 de 2";
        btnAcao.innerText = "Entrar";

        // Transforma o campo em password e limpa o valor
        campoInput.type = "password";
        campoInput.placeholder = "Sua senha";
        campoInput.value = "";
        campoInput.focus();

    } else if (passoAtual === 2) {
        const senha = campoInput.value.trim();

        if (!senha) {
            alert("Por favor, digite sua senha.");
            return;
        }

        try {
            const PORTA = "3000"; // Certifique-se de que é a porta onde o seu backend está rodando
            const url = `http://localhost:${PORTA}/auth?telefone=${encodeURIComponent(telefoneDigitado)}&senha=${encodeURIComponent(senha)}`;

            const resposta = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.mensagem || "Credenciais inválidas.");
            }

            // Guarda as informações do usuário logado na memória do navegador
            localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));

            // Redireciona para a interface do chat
            window.location.href = "interface.html";

        } catch (erro) {
            console.error("Erro ao autenticar:", erro);
            alert(erro.message || "Erro de ligação ao servidor.");
        }
    }
});