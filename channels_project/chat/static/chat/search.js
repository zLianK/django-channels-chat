document.addEventListener('DOMContentLoaded', function () {
    dynamicSearchingResults()
});

async function dynamicSearchingResults() {
    const searchTerm = getSearchParams('search');

    const usersResponse = await fetch(`http://127.0.0.1:8000/api/search?search=${searchTerm}`);
    const usersJson = await usersResponse.json();

    const searchTitle = document.getElementById('search-title');
    searchTitle.innerHTML = `Searching for: <span class="searching-for">${usersJson.searching_for}</span>`;

    const users = usersJson.users;

    const searchUsersDiv = document.getElementById('search-users');
    users.forEach(element => {
        const currentUserId = parseInt(JSON.parse(document.getElementById('user_id').textContent));

        if (currentUserId == parseInt(element.id)) {
            return;
        }

        const userDiv = document.createElement('div');
        userDiv.setAttribute('class', 'search-user');
        userDiv.setAttribute('id', `search-user-${element.id}`)

        const userParagraph = document.createElement('p');
        userParagraph.innerHTML = element.username;
        userParagraph.setAttribute('class', 'search-username');
        userParagraph.setAttribute('id', `search-username-${element.id}`)

        const userButton = document.createElement('button');
        userButton.innerHTML = 'Message';
        userButton.setAttribute('id', `search-user-btn-${element.id}`);
        userButton.setAttribute('class', 'search-user-btn btn btn-primary');
        userButton.addEventListener('click', () => redirectToChat(element.id, currentUserId));

        userDiv.append(userParagraph, userButton);
        searchUsersDiv.append(userDiv);
    });
}

async function redirectToChat(recipientUserId, currentUserId) {

    if (currentUserId > parseInt(recipientUserId)) {
        var chatGroup = [recipientUserId, currentUserId];
    } else if (currentUserId < parseInt(recipientUserId)) {
        var chatGroup = [currentUserId, recipientUserId];
    }

    const createGroupResponse = await fetch(`http://127.0.0.1:8000/api/create-group`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            first_user: chatGroup[0],
            second_user: chatGroup[1],
        }),
    });

    window.location = `http://127.0.0.1:8000/home`;
}

function getSearchParams(searchParamName) {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const searchTerm = url.searchParams.get(searchParamName);

    return searchTerm;
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