import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ejs from 'ejs';

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
    res.render('index.html');
});

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    //socket.on('registerUser', data => {
    //    console.log(data);
    //});

    socket.on('sendMessage', data => {
      
    })
});

server.listen(3000);


