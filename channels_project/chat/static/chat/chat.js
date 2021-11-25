document.addEventListener("DOMContentLoaded", function () {
    const chatInput = document.getElementById('chat-input');
    chatInput.addEventListener('input', () => disableEnableSendButton());

    preventFormFromSubmitting();
    getAllMessages();
    startWebSocket();

})

function preventFormFromSubmitting() {
    const chatForm = document.getElementById('chat-form');
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const chatButton = document.getElementById('chat-btn');
        chatButton.disabled = true;
    });
}

function disableEnableSendButton() {
    const chatInput = document.getElementById('chat-input');
    const chatButton = document.getElementById('chat-btn');

    if (chatInput.value != '') {
        chatButton.removeAttribute('disabled');
    } else {
        chatButton.disabled = true;
    }
}

async function getAllMessages() {
    const users = getUsersSorted();

    const messagesResponse = await fetch(`http://127.0.0.1:8000/api/messages?first_user=${users[0]}&second_user=${users[1]}`);
    const messagesJson = await messagesResponse.json();

    const messages = messagesJson.messages;
    printAllMessages(messages);
    updateScroll();
}

function printAllMessages(messages) {

    const currentUserId = getCurrentUserId();

    const messageArea = document.getElementById('message-area');

    messages.forEach(element => {
        console.log(element.content)

        var messageContainer = document.createElement('div');
        var messageParagraph = document.createElement('p');

        if (element.sender == currentUserId) {
            messageContainer = createCurrentUserMessageContainer(messageContainer, messageParagraph, element.content);
        } else {
            messageContainer = createRecipientUserMessageContainer(messageContainer, messageParagraph, element.content);
        }

        messageArea.append(messageContainer);

    });
}

function getUsersSorted() {
    const currentUserId = getCurrentUserId();
    const recipientId = getRecipientUserId();

    return [currentUserId, recipientId].sort();
}

function getCurrentUserId() {
    return parseInt(JSON.parse(document.getElementById('user_id').textContent));
}

function getRecipientUserId() {
    return parseInt(JSON.parse(document.getElementById('recipient_id').textContent));
}

function startWebSocket() {

    const currentUserId = getCurrentUserId();
    const recipientId = getRecipientUserId();
    const users = getUsersSorted();

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
            messageContainer = createCurrentUserMessageContainer(messageContainer, messageParagraph, data.message);
        } else {
            messageContainer = createRecipientUserMessageContainer(messageContainer, messageParagraph, data.message);
        }

        messageArea.append(messageContainer);

        updateScroll();

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

function createCurrentUserMessageContainer(container, paragraph, content) {
    container.setAttribute('class', 'message-container current-user-container');
    paragraph.setAttribute('class', 'current-user-chat message-chat');
    paragraph.innerHTML = `${content}`;
    container.append(paragraph);

    return container;
}

function createRecipientUserMessageContainer(container, paragraph, content) {
    container.setAttribute('class', 'message-container recipient-user-container');
    paragraph.setAttribute('class', 'recipient-chat message-chat');
    paragraph.innerHTML = `${content}`;
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

function updateScroll() {
    var element = document.getElementById('message-area');
    element.scrollTop = element.scrollHeight - element.clientHeight;
}