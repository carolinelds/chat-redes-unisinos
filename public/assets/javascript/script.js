//porta que sera utilizada
const socket = io('http://localhost:3000');

//chat - mostra hora que a mensagem foi enviada, nome de quem enviou, e a mensagem
function renderMessage(message) {
    $('.messages').append(`
        <div class="message">
            <p class="time">(${message.time})</p>
            <p class="content"><strong>${message.author}</strong> ${message.message}</p>
        </div>
    `);

    //pega o último elemento com a classe .messages e ele sempre aparece na tela
    const lastMessage = document.querySelector(".messages > div:last-of-type");
    lastMessage.scrollIntoView();
};

//monitora eventos de 'receivedMessage', aciona a funçao renderMessage quando o evento é recebido
socket.on('receivedMessage', function(message) {
    renderMessage(message);
});

//monitora eventos de 'previousMessages', aciona a funçao renderMessage quando o evento é recebido
socket.on('previousMessages', function(messages) {
    for (const message of messages) {
        renderMessage(message);
    };
});

//tela de login para ingressar no chat
$('#user').submit(function(event) {
    event.preventDefault();

    const author = $('input[name=username]').val();
    const usernameForm = document.querySelector('.user-container');

    //condiçao que verifica se tamanho do nome de usuário é maior que 0 e menor que 10
    if (author.length > 0 && author.length <= 10) {
        usernameForm.classList.remove('user-container');
        usernameForm.classList.add('form-not-visible');

        //pega o primeiro elemento com a classe .chat-container e adiciona html para exibir o chat
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.innerHTML = `
            <div class="messages"></div>
            <div class="horizontal-container">
                <p class="username">${author}:</p>
                <input type="text" name="message" class="message-input" placeholder="Digite sua mensagem">
            </div>
            <button type="submit">Enviar</button>
        `;
    } else {
        // exibe mensagem de erro
        usernameForm.innerHTML = `
            <input type="text" name="username" placeholder="Digite seu nome de usuário" class="disabled" disabled>
            <div>
                <p class="alert">Mínimo de 1 caracter e máximo de 10 caracteres. Tente novamente.</p>
            </div>
            <button type="submit" class="disabled" disabled>Entrar no chat</button>
        `;

        //Chama a funçao location.reload após 2s
        setTimeout(function(){location.reload()}, 2000); // 2000 ms = 2 s
    };
});

//Envio de mensagens
$('#chat').submit(function(event) {
    event.preventDefault();

    const message = $('input[name=message]').val();

    //Condiçao que verifica se tamanho da mensagem é maior que 0
    if (message.length > 0) {
        const author = document.querySelector('.username').innerHTML;
        
        // obtem as horas da biblioteca dayjs
        let now = dayjs();
        now = now.format('HH:mm:ss');

        const messageObject = { 
            message: message,
            author: author,
            time: now
        };
    
        renderMessage(messageObject);
    
        //emite um evento chamado sendMessage (envia a mensagem)
        socket.emit('sendMessage', messageObject);
    };
});
