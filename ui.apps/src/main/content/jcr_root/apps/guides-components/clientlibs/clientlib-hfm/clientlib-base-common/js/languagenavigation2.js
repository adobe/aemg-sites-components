$(document).ready(function () {
    const $toolbar = $('.toolbar-hitech .desktop');

    const getActiveToolbar = () =>
        document.querySelector(".toolbar:not(.hidden) .language-selector");
    const isMobileView = () => window.matchMedia("(max-width: 1023px)").matches;

    const createBackdrop = () => {
        //if (!isMobileView()) return; // Only add backdrop for mobile view
        let backdrop = document.createElement("div");
        $toolbar.css('position', 'static');

        if(backdrop) {
            backdrop.classList.add("language-backdrop");
            document.body.appendChild(backdrop);

        }
    };

    const removeBackdrop = () => {
        const backdrop = document.querySelector(".language-backdrop");
        if (backdrop) backdrop.remove();
	};


    document.addEventListener("click", (event) => {
		const activeToolbar = getActiveToolbar();
        if (!activeToolbar || activeToolbar.closest('.lat-section')) return;


        const toggleButton = activeToolbar.querySelector(".language-selector__toggle");
        const menu = activeToolbar.querySelector(".cmp-languagenavigation");
        if(!menu) {return;}
        if (toggleButton.contains(event.target)) {
            event.stopPropagation(); // Prevent immediate closing due to document click listener
            const isVisible = menu.style.display === "block";


            if (isVisible) {
                menu.style.display = "none";

                removeBackdrop();
            } else {
                menu.style.display = "block";

                createBackdrop(); // Add backdrop only if in mobile view
            }
        } else if (event.target.closest(".cmp-languagenavigation__item-title")) {
            const clickedTitle = event.target.closest(".cmp-languagenavigation__item-title");
            const parentItem = clickedTitle.closest(".cmp-languagenavigation__item");

            // Close all items first
            activeToolbar.querySelectorAll(".cmp-languagenavigation__item").forEach((item) =>
                item.classList.remove("open")
            );

            // Toggle clicked item
            if (!parentItem.classList.contains("open")) {
                parentItem.classList.add("open");
            }
        } else {
            menu.style.display = "none"; // Hide menu if clicking outside
            removeBackdrop();
        }
    });

    // Hide menu and remove backdrop on resize
    window.addEventListener("resize", () => {
        const activeToolbar = getActiveToolbar();
        if (!activeToolbar || activeToolbar.closest('.lat-section')) return;
        document.querySelectorAll(".cmp-languagenavigation").forEach((menu) => (menu.style.display = "none"));
        removeBackdrop();
    });

    // Hide menu and remove backdrop when clicking the backdrop
    document.body.addEventListener("click", (event) => {
        if (event.target.classList.contains("language-backdrop")) {
    $toolbar.css('position', 'sticky');
            document.querySelectorAll(".cmp-languagenavigation").forEach((menu) => (menu.style.display = "none"));
            removeBackdrop();
        }
    });

});
