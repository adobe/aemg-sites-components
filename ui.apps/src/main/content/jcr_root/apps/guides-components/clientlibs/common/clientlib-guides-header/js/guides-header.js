document.addEventListener("DOMContentLoaded", function () {

    let hamburger = document.querySelector(".hamburger_icon");
    let header = document.querySelector(".fsi-header-wrapper");
    let searchInput = document.getElementById("js-search-results");

    hamburger.addEventListener('click', () => {
        header.classList.toggle('mob-navigation');
    });

    document.querySelector('.global-search').addEventListener('click', () => {
        document.querySelector('.search-container').classList.remove('display-none');
        searchInput.value = "";
    });

    document.querySelector('.cmp-search-bar__clear-icon').addEventListener('click', () => {
        document.querySelector('.search-container').classList.add('display-none');
        searchInput.value = "";
    });

    document.querySelector('.cmp-search-bar__form').addEventListener('submit', (e) => {
        // Trigger click event before form submission
        const clearIcon = document.querySelector('.cmp-search-bar__clear-icon');
        document.querySelector('.search-container').classList.add('display-none');
    });
});
