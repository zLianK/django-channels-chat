const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');

document.addEventListener('DOMContentLoaded', function () {
    searchInput.addEventListener('input', () => disableEnableSearchButton());
});

function disableEnableSearchButton() {
    if (searchInput.value != '') {
        searchButton.removeAttribute('disabled');
    } else {
        searchButton.disabled = true;
    }
}