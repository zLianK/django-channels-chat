document.addEventListener('DOMContentLoaded', function () {
    const searchSection = document.getElementById('search-content');
    searchSection.style.display = 'none';

    const searchButton = document.getElementById('search-btn');
    searchButton.addEventListener('click', () => dynamicSearchingResults());

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => disableEnableSearchButton());

    // Prevent the form from submitting
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchButton = document.getElementById('search-btn');
        searchButton.disabled = true;
    });
});

async function dynamicSearchingResults() {

    const indexSection = document.getElementById('index-content');
    indexSection.style.display = 'none';

    const searchSection = document.getElementById('search-content');
    searchSection.style.display = 'block';

    // Clean the search-users div
    document.getElementById('search-users').innerHTML = '';

    // Get the search term
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value;

    // Get the users with the search term
    const usersResponse = await fetch(`http://127.0.0.1:8000/api/search?search=${searchTerm}`);
    const usersJson = await usersResponse.json();

    // Change the title depending on the search term
    const searchTitle = document.getElementById('search-title');
    searchTitle.innerHTML = `Searching for: <span class="searching-for">${usersJson.searching_for}</span>`;

    // For each user that contains the search term, create a component
    const users = usersJson.users;
    const searchUsersDiv = document.getElementById('search-users');
    users.forEach(element => {

        // If user id is equal to current user id, do nothing
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
        userButton.setAttribute('class', 'search-user-btn btn');
        userButton.addEventListener('click', () => redirectToChat(element.username));

        userDiv.append(userParagraph, userButton);
        searchUsersDiv.append(userDiv);
    });

    searchInput.value = '';
}

function getSearchParams(searchParamName) {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const searchTerm = url.searchParams.get(searchParamName);

    return searchTerm;
}

function redirectToChat(username) {
    window.open(`http://127.0.0.1:8000/chat/${username}`, '_blank');
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

function disableEnableSearchButton() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');

    if (searchInput.value != '') {
        searchButton.removeAttribute('disabled');
    } else {
        searchButton.disabled = true;
    }
}