$(document).ready(function () {
    let shortdesc = document.querySelector('.shortdesc');
    if (!shortdesc) return;

    // Function to check text overflow
    function isTextOverflowing(element) {
        return element.scrollWidth > element.clientWidth;
    }

    function updateBackground() {
        if (!isTextOverflowing(shortdesc)) {
            shortdesc.style.backgroundImage = "none"; // Hide arrow
        } else {
            shortdesc.style.backgroundImage = "url('/content/dam/guides/common-images/icons/Chevron-orange.svg')"; // Show arrow
        }
    }

    // Function to check if the div is empty
    function isEmpty(element) {
        return !element.textContent.trim(); // Check if there's visible text content
    }

    // Hide shortdesc if empty
    if (isEmpty(shortdesc)) {
        shortdesc.style.display = 'none';
    } else {
        shortdesc.style.display = ''; // Ensure it's visible if not empty
        updateBackground(); // Initial check
    }

    shortdesc.addEventListener('click', function () {
        if (!isTextOverflowing(shortdesc) && shortdesc.clientWidth <= 50) return;
        this.classList.toggle('expanded');
    });

    $(document).on("click", ".gu-next-topic_container, .gu-pre-topic_container", function () {
        const selectedBtn = $(this);
        const link = selectedBtn.find("a").attr("href");
        if (link) window.location.href = link;
    });

    window.addEventListener('resize', updateBackground);
});

