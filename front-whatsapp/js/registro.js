const btnRegistrar = document.querySelector("#btnRegistrar");

btnRegistrar.addEventListener("click", async (e) => {
    e.preventDefault();

    const apelido = document.querySelector("#apelido").value.trim();
    const telefone = document.querySelector("#tel").value.trim();
    const senha = document.querySelector("#senha").value.trim();

    if (!apelido || !telefone || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        // Altera para 3000 ou 3001 consoante a PORTA do teu main.js[cite: 2]
        const resposta = await fetch("http://localhost:3000/registrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ apelido, senha, telefone })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem);
        }

        alert(dados.mensagem);
        window.location.href = "index.html";

    } catch (erro) {
        console.error("Erro no registo:", erro);
        alert(erro.message || "Não foi possível conectar ao servidor.");
    }
});