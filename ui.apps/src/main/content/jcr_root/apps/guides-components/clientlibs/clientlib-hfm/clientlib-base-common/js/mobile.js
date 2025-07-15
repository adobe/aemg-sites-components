document.addEventListener("DOMContentLoaded", function () {
    const layoutButton = document.querySelector(".layout-button");
    const outerContainer = document.querySelector("#gu-nav");

    // Create a backdrop element
    const backdrop = document.createElement("div");
    backdrop.classList.add("backdrops");
    document.body.appendChild(backdrop);

    function closeMenu() {
        outerContainer?.classList.remove("show");
        backdrop.classList.remove("active");
    }

    backdrop.addEventListener("click", closeMenu);

    if (layoutButton && outerContainer) {
        layoutButton.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent click from bubbling to document
            outerContainer.classList.toggle("show");
            backdrop.classList.toggle("active");
        });

        // Close menu when clicking on the backdrop
        document.addEventListener("click", function (event) {
            if (!outerContainer.contains(event.target) && !layoutButton.contains(event.target)) {
                closeMenu();
            }
        });
    }

});
