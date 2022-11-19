const socket = io('http://localhost:3000');

function renderMessage(message) {
    $('.messages').append(`
        <div class="message">
            <strong>${message.author}</strong> ${message.message}
        </div>
    `);
};

$('#user').submit(function(event) {
    event.preventDefault();

    const author = $('input[name=username]').val();

    const usernameForm = document.querySelector('.user-container');
    usernameForm.classList.remove('user-container');
    usernameForm.classList.add('form-not-visible');

    const chatContainer = document.querySelector('.chat-container');
    chatContainer.innerHTML = `
        <div class="messages"></div>
        <div class="horizontal-container">
            <p class="username">${author}:</p>
            <input type="text" name="message" class="message" placeholder="Digite sua mensagem">
        </div>
        <button type="submit">Enviar</button>
    `;

    //socket.emit('registerUser', author);
});

$('#chat').submit(function(event) {
    event.preventDefault();

    const message = $('input[name=message]').val();

    const author = document.querySelector('.username').innerHTML;

    const messageObject = { 
        message: message,
        author: author
    };

    renderMessage(messageObject);

    socket.emit('sendMessage', messageObject);
});
