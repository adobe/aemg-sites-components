$(document).ready(function () {
    $(".gu-toc__toggle").click(function () {
        $(".col-3grid--right, .col-6grid").toggleClass("collapsed");
    });

    // Function to check if TOC is empty and collapse right section if needed
    function checkTOCContent() {
        const tocContent = document.querySelector(".cmp-toc__content");

        if (!tocContent || tocContent.innerHTML.trim() === "") {
            $(".col-3grid--right, .col-6grid").addClass("collapsed");
        }
    }

    // Run on page load
    checkTOCContent();
});


document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".toc-button");
    const tocContent = document.querySelector("#toc-content");
    const backdrop = document.createElement("div");
    backdrop.className = "toc-backdrop hidden";
    document.body.appendChild(backdrop);

    const isMobileView = () => window.innerWidth <= 768; // Adjust breakpoint if needed

    const toggleTOC = () => {
        const isActive = tocContent.classList.toggle("show");
        backdrop.classList.toggle("hidden", !isActive);
    };

    button.addEventListener("click", function (event) {
        event.stopPropagation();
        toggleTOC();
    });

    backdrop.addEventListener("click", toggleTOC);

    document.addEventListener("click", function (event) {
        if (!tocContent.contains(event.target) && !button.contains(event.target)) {
            tocContent.classList.remove("show");
            backdrop.classList.add("hidden");
        }
    });

    // Handle TOC link clicks
    document.querySelectorAll(".tableofcontents ul li a").forEach((link) => {
        link.addEventListener("click", function () {
            document.querySelectorAll(".tableofcontents ul li").forEach((li) => {
                li.classList.remove("active");
            });
            this.parentElement.classList.add("active");

            // Remove backdrop and close TOC only in mobile view
            backdrop.classList.add("hidden");
            if (isMobileView()) {
                tocContent.classList.remove("show");
            }
        });
    });

    // Handle window resize to update behavior dynamically
    window.addEventListener("resize", function () {
        if (!isMobileView()) {
            backdrop.classList.add("hidden");
        }
    });
});

