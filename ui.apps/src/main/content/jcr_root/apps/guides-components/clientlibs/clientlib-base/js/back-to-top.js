document.addEventListener("DOMContentLoaded", function () {
    const getActiveBackToTopButton = () => document.querySelector(".toolbar:not(.hidden) .gu-backToTop_wrapper");

    // Scroll event listener (only attach once)
    window.addEventListener("scroll", () => {
        const backToTopButton = getActiveBackToTopButton();
        if (backToTopButton) {
            backToTopButton.style.display = window.scrollY > 200 ? "block" : "none";
        }
    });

    // Click event listener (use event delegation)
    document.addEventListener("click", (event) => {
        if (event.target.closest(".gu-backToTop_wrapper")) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });

    // Hide button on load if it exists
    const initialBackToTopButton = getActiveBackToTopButton();
    if (initialBackToTopButton) {
        initialBackToTopButton.style.display = "none";
    }
});
