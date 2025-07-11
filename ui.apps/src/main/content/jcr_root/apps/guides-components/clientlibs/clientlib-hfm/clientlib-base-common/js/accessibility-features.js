$(document).ready(function () {
    const $htmlElement = $("html"); // Select the <html> element

    // Function to toggle a class
    const toggleClass = (className) => {
        $htmlElement.toggleClass(className);
    };

    // Function to toggle high contrast mode
    const toggleHighContrast = () => {
        $htmlElement.attr("id", $htmlElement.attr("id") === "adobeguides-dark-contrast" ? "" : "adobeguides-dark-contrast");
    };

    // Function to toggle low contrast mode
    const toggleLowContrast = () => {
        $htmlElement.toggleClass("adobeguides-light-contrast");
        if ($htmlElement.attr("id") === "adobeguides-dark-contrast") {
            $htmlElement.removeAttr("id");
        }
    };

    // Function to reset all styles
    const resetAll = () => {
        $htmlElement.removeClass("adobeguides-text-size adobeguides-text-spacing adobeguides-light-contrast").removeAttr("id");
    };

    // Attach event listeners for multiple buttons
    $(".high-contrast").on("click", toggleHighContrast);
    $(".low-contrast").on("click", toggleLowContrast);
    $(".text-size").on("click", () => toggleClass("adobeguides-text-size"));
    $(".text-space").on("click", () => toggleClass("adobeguides-text-spacing"));
    $(".reset-all").on("click", resetAll);
});
