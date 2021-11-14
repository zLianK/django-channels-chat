document.addEventListener("DOMContentLoaded", function () {
    const chatInput = document.getElementById('chat-input');
    chatInput.addEventListener('input', () => disableEnableSendButton());

    startWebSocket();

    // Prevent the form from submitting
    const chatForm = document.getElementById('chat-form');
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const chatButton = document.getElementById('chat-btn');
        chatButton.disabled = true;
    });
})

function disableEnableSendButton() {
    const chatInput = document.getElementById('chat-input');
    const chatButton = document.getElementById('chat-btn');

    if (chatInput.value != '') {
        chatButton.removeAttribute('disabled');
    } else {
        chatButton.disabled = true;
    }
}

function startWebSocket() {

    const currentUserId = parseInt(JSON.parse(document.getElementById('user_id').textContent));
    const recipientId = parseInt(JSON.parse(document.getElementById('recipient_id').textContent));


    const users = [currentUserId, recipientId].sort();

    const chatSocket = new WebSocket(
        'ws://'
        + window.location.host
        + '/ws/chat/'
        + users[0]
        + '/'
        + users[1]
        + '/'
    );

    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        document.querySelector('#message-area').innerHTML += (`<h1>${data.message}</h1>`);
    };

    chatSocket.onclose = function (e) {
        console.error('Chat socket closed unexpectedly');
    };

    document.querySelector('#chat-btn').onclick = function (e) {
        const messageInputDom = document.querySelector('#chat-input');
        const message = messageInputDom.value;
        chatSocket.send(JSON.stringify({
            'message': message
        }));
        messageInputDom.value = '';
    };
}