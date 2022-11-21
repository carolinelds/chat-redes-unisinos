import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ejs from 'ejs';

// realiza as configuracoes da aplicacao
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use('/', (req,res) => {
    res.render('index.html'); // Renderiza a pagina principal html
});

let messages = []; // cria array para armazenar as mensagens

//io/socket.on('evento', fazalgumacoisa) ==> back/servidor
//socket.emit('evento', mensagem) ==> frontend (pasta public)

io.on('connection', socket => { // funcao io.on disparada em um evento de uma conexao feita
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', messageObject => {
      messages.push(messageObject); // Adiciona mensagem ao array
      socket.broadcast.emit('receivedMessage', messageObject); // Envia broadcast permitindo que todos registrados no chat recebam a mensagem
    });
});

server.listen(3000); // Define porta para receber conexão. 


