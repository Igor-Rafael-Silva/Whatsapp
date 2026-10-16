const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Configuração do Socket.IO com suporte a CORS
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Importa as rotas existentes
const authRoutes = require('./routes/auth.route');
app.use('/', authRoutes);

// Mapeamento de utilizadores online: { telefone: socket.id }
const utilizadoresConectados = {};

io.on('connection', (socket) => {
    console.log('Utilizador conectado:', socket.id);

    // Quando o utilizador entra na aplicação, regista o seu telefone
    socket.on('registrar_utilizador', (telefone) => {
        utilizadoresConectados[telefone] = socket.id;
        console.log(`Utilizador ${telefone} associado ao socket ${socket.id}`);
    });

    // Evento de envio de mensagem em tempo real
    socket.on('enviar_mensagem', async (dados) => {
        const { telefone_remetente, telefone_destino, mensagem } = dados;

        // Procura se o destinatário está conectado no WebSocket
        const socketDestinoId = utilizadoresConectados[telefone_destino];

        if (socketDestinoId) {
            // Envia a mensagem apenas para o destinatário
            io.to(socketDestinoId).emit('receber_mensagem', {
                telefone_remetente,
                mensagem,
                data_envio: new Date()
            });
        }
    });

    socket.on('disconnect', () => {
        // Remove o utilizador do mapa de conexões ativas
        for (const telefone in utilizadoresConectados) {
            if (utilizadoresConectados[telefone] === socket.id) {
                delete utilizadoresConectados[telefone];
                console.log(`Utilizador ${telefone} desconectado`);
                break;
            }
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor a rodar na porta ${PORT}`);
});