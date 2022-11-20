const socket = io('http://localhost:3000');

function renderMessage(message) {
    $('.messages').append(`
        <div class="message">
            <p class="time">(${message.time})</p>
            <p class="content"><strong>${message.author}</strong> ${message.message}</p>
        </div>
    `);

    const lastMessage = document.querySelector(".messages > div:last-of-type");
    lastMessage.scrollIntoView();
};

socket.on('receivedMessage', function(message) {
    renderMessage(message);
});

socket.on('previousMessages', function(messages) {
    for (const message of messages) {
        renderMessage(message);
    };
});

$('#user').submit(function(event) {
    event.preventDefault();

    const author = $('input[name=username]').val();
    const usernameForm = document.querySelector('.user-container');

    if (author.length > 0 && author.length <= 10) {
        usernameForm.classList.remove('user-container');
        usernameForm.classList.add('form-not-visible');

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
        usernameForm.innerHTML = `
            <input type="text" name="username" placeholder="Digite seu nome de usuário" class="disabled" disabled>
            <div>
                <p class="alert">Mínimo de 1 caracter e máximo de 10 caracteres. Tente novamente.</p>
            </div>
            <button type="submit" class="disabled" disabled>Entrar no chat</button>
        `;

        setTimeout(function(){location.reload()}, 2000); // 2000 ms = 2 s
    };
});

$('#chat').submit(function(event) {
    event.preventDefault();

    const message = $('input[name=message]').val();

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
    
        socket.emit('sendMessage', messageObject);
    };
});
