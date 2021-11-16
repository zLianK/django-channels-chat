document.addEventListener("DOMContentLoaded", function () {
    const chatInput = document.getElementById('chat-input');
    chatInput.addEventListener('input', () => disableEnableSendButton());

    getAllMessages();
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

function getAllMessages() {
    console.log('GET ALL MESSAGES');
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

        const messageArea = document.getElementById('message-area');

        var messageContainer = document.createElement('div');
        var messageParagraph = document.createElement('p');

        if (data.sender == currentUserId) {
            messageContainer = createCurrentUserMessageContainer(messageContainer, messageParagraph, data);
        } else {
            messageContainer = createRecipientUserMessageContainer(messageContainer, messageParagraph, data);
        }

        messageArea.append(messageContainer);

    };

    chatSocket.onclose = function () {
        console.error('Chat socket closed unexpectedly');
    };

    document.getElementById('chat-btn').onclick = function () {
        const messageInputDom = document.getElementById('chat-input');
        const message = messageInputDom.value;

        saveMessage(message, currentUserId, recipientId);

        chatSocket.send(JSON.stringify({
            'message': message,
            'sender': currentUserId
        }));
        messageInputDom.value = '';
    };
}

function createCurrentUserMessageContainer(container, paragraph, data) {
    container.setAttribute('class', 'message-container current-user-container');
    paragraph.setAttribute('class', 'current-user-chat message-chat');
    paragraph.innerHTML = `${data.message}`;
    container.append(paragraph);

    return container;
}

function createRecipientUserMessageContainer(container, paragraph, data) {
    container.setAttribute('class', 'message-container recipient-user-container');
    paragraph.setAttribute('class', 'recipient-chat message-chat');
    paragraph.innerHTML = `${data.message}`;
    container.append(paragraph);

    return container;
}

function saveMessage(message, currentUser, recipientUser) {
    const csrftoken = getCookie('csrftoken');

    fetch('http://127.0.0.1:8000/api/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            content: message,
            sender: currentUser,
            recipient: recipientUser
        })
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}