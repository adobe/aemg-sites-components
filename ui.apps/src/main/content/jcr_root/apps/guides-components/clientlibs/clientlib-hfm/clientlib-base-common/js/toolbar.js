document.addEventListener("DOMContentLoaded", () => {
    const toggleVisibility = () => {
        const isMobileView = window.innerWidth <= 1023; // Example breakpoint for mobile

        // Handle mobile elements
        Array.from(document.querySelectorAll(".mobile")).forEach((element) => {
            element.classList.toggle("hidden", !isMobileView);
        });

        // Handle desktop elements
        Array.from(document.querySelectorAll(".desktop")).forEach((element) => {
            element.classList.toggle("hidden", isMobileView);
        });
    };

    // Initial check
    toggleVisibility();
    // Recheck on window resize
    window.addEventListener("resize", toggleVisibility);
});


