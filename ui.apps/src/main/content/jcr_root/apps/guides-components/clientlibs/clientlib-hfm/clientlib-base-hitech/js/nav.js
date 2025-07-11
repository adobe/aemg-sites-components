window.addEventListener("scroll", function () {
    if (window.innerWidth <= 1023) return; // Ensure it runs only for width > 1023

    let outerContainer = document.querySelector(".outer-container");
    let footer = document.querySelector(".footer"); // Adjust to your footer selector
    if (!outerContainer || !footer) return; // Ensure elements exist

    let footerTop = footer.getBoundingClientRect().top;
    let viewportHeight = window.innerHeight;

    if (footerTop <= viewportHeight) {
        // If the footer is in view, make outerContainer sticky and scrollable
        outerContainer.style.position = "sticky";
        outerContainer.style.bottom = "0";
        outerContainer.style.width = "100%";
        outerContainer.style.maxHeight = "70vh"; // Adjust as needed
        outerContainer.style.overflowY = "auto"; // Enable scrolling
    } else {
        // Otherwise, keep it fixed with a limited height
        outerContainer.style.position = "fixed";
        outerContainer.style.width = "25%";
        outerContainer.style.bottom = "auto";
        outerContainer.style.maxHeight = "none";
        outerContainer.style.overflowY = "visible"; // Remove scrolling
    }
});

// Handle window resize to remove styles if width is ≤ 1023
window.addEventListener("resize", function () {
    let outerContainer = document.querySelector(".outer-container");
    if (window.innerWidth <= 1023 && outerContainer) {
        outerContainer.style.position = "";
        outerContainer.style.bottom = "";
        outerContainer.style.maxHeight = "";
        outerContainer.style.overflowY = "";
    }
});
