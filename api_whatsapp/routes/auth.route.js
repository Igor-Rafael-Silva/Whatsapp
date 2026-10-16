const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Rota de Cadastro
router.post('/registrar', async (req, res) => {
    const { apelido, telefone, senha } = req.body;
    if (!apelido || !telefone || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
    }
    try {
        await pool.query(
            "INSERT INTO utilizadores (apelido, telefone, senha) VALUES (?, ?, ?)",
            [apelido, telefone, senha]
        );
        return res.status(201).json({ mensagem: "Utilizador registado com sucesso!" });
    } catch (erro) {
        console.error("Erro no registo:", erro);
        return res.status(500).json({ mensagem: "Erro ao registar utilizador." });
    }
});

// Rota de Login (Autenticação)
router.post('/auth', async (req, res) => {
    const { telefone, senha } = req.query;
    if (!telefone || !senha) {
        return res.status(400).json({ mensagem: "Telefone e senha são obrigatórios." });
    }
    try {
        const [rows] = await pool.query(
            "SELECT id, apelido, telefone FROM utilizadores WHERE telefone = ? AND senha = ?",
            [telefone, senha]
        );
        if (rows.length === 0) {
            return res.status(401).json({ mensagem: "Telefone ou senha inválidos." });
        }
        return res.status(200).json({ mensagem: "Autenticado com sucesso!", usuario: rows[0] });
    } catch (erro) {
        console.error("Erro na autenticação:", erro);
        return res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
});

// GET /utilizadores - Buscar todos os outros utilizadores
router.get('/utilizadores', async (req, res) => {
    const { meuTelefone } = req.query;
    try {
        const [utilizadores] = await pool.query(
            "SELECT id, apelido, telefone FROM utilizadores WHERE telefone != ?",
            [meuTelefone]
        );
        return res.status(200).json(utilizadores);
    } catch (erro) {
        console.error("Erro ao procurar utilizadores:", erro);
        return res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
});

// POST /chat - Guardar mensagem no MariaDB
router.post('/chat', async (req, res) => {
    const { telefone_remetente, telefone_destino, mensagem } = req.body;
    if (!telefone_remetente || !telefone_destino || !mensagem) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
    }
    try {
        const [resultado] = await pool.query(
            "INSERT INTO mensagens (telefone_remetente, telefone_destino, mensagem, data_envio) VALUES (?, ?, ?, NOW())",
            [telefone_remetente, telefone_destino, mensagem]
        );
        return res.status(201).json({ mensagem: "Mensagem enviada com sucesso!", id: resultado.insertId });
    } catch (erro) {
        console.error("Erro ao guardar mensagem:", erro);
        return res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
});

// GET /chat - Buscar histórico de mensagens
router.get('/chat', async (req, res) => {
    const { remetente, destino } = req.query;
    if (!remetente || !destino) {
        return res.status(400).json({ mensagem: "Parâmetros são obrigatórios." });
    }
    try {
        const [mensagens] = await pool.query(
            `SELECT * FROM mensagens 
             WHERE (telefone_remetente = ? AND telefone_destino = ?) 
                OR (telefone_remetente = ? AND telefone_destino = ?) 
             ORDER BY data_envio ASC`,
            [remetente, destino, destino, remetente]
        );
        return res.status(200).json(mensagens);
    } catch (erro) {
        console.error("Erro ao carregar mensagens:", erro);
        return res.status(500).json({ mensagem: "Erro ao procurar histórico." });
    }
});

module.exports = router;