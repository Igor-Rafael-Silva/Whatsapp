# 💬 Uatizap - Aplicação de Mensagens em Tempo Real

O **Uatizap** é uma plataforma de comunicação instantânea inspirada no WhatsApp Web, desenvolvida com arquitetura full-stack utilizando **Node.js**, **Express**, **MariaDB** e **Socket.IO**. O projeto conta com autenticação por telefone e senha em duas etapas, histórico persistido em banco de dados e envio de mensagens em tempo real via WebSockets.

---

## 🚀 Funcionalidades

- **Cadastro de Usuários (`registro.html`):**
  - Criação de conta com apelido, telefone e senha.
  - Armazenamento seguro na tabela `utilizadores` do MariaDB.

- **Autenticação em Duas Etapas (`index.html`):**
  - **Passo 1:** Digitação do número de telefone e seleção do DDI (+55 BR / +1 US).
  - **Passo 2:** Digitação da senha cadastrada com transição dinâmica de campos.
  - Validação via rota `/auth` no backend.

- **Interface do Chat em Tempo Real (`interface.html`):**
  - **Listagem Dinâmica:** Busca automática de todos os contatos cadastrados no MariaDB.
  - **Mensagens Instantâneas:** Comunicação bidirecional sem necessidade de recarregar a página usando WebSockets (`Socket.IO`).
  - **Histórico Persistente:** Armazenamento e consulta das conversas no banco de dados.
  - **Gerenciamento de Sessão:** Armazenamento do usuário logado no `localStorage` e opção de logout.

---

## 🛠️ Tecnologias Utilizadas

### **Front-end**
- HTML5 & CSS3 (Design moderno com CSS `:has()`, Flexbox e layout responsivo)
- JavaScript Assíncrono (Fetch API / ES6+)
- [Socket.IO Client](https://socket.io/) (Comunicação WebSockets)

### **Back-end**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/) (Servidor WebSockets)
- [mysql2/promise](https://www.npmjs.com/package/mysql2) (Pool de conexão assíncrono para MariaDB)
- [CORS](https://www.npmjs.com/package/cors) (Cross-Origin Resource Sharing)

### **Banco de Dados**
- [MariaDB](https://mariadb.org/) / MySQL

---

## 🗄️ Estrutura do Banco de Dados

O banco de dados `whatsapp` possui duas tabelas principais interligadas:

### 1. Tabela `utilizadores`
```sql
CREATE TABLE utilizadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    apelido VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
