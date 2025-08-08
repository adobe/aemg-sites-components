$(document).ready(function () {

	const $toolbar = $('.toolbar-hitech .desktop');
    let backdrop = document.createElement("div");
    if (backdrop) {
        backdrop.className = "backdropAccessibility hidden";
        document.body.appendChild(backdrop);
        backdrop.style.display = "none";
    }

    $(".gu-accessibility_wrapper").each(function () {
        const $wrapper = $(this);
        const $accessibilityBtn = $wrapper.find("#gu_accessibility-icon");
        const $accessibilityMenu = $wrapper.find("#gu_accessibility-menu");

        if ($accessibilityBtn.length && $accessibilityMenu.length) {
            $accessibilityBtn.on("click", function () {
                const isExpanded = $accessibilityBtn.attr("aria-expanded") === "true";
                $accessibilityBtn.attr("aria-expanded", !isExpanded);
                $accessibilityMenu.toggleClass("show");

                if (backdrop) {
					backdrop.style.display = "block";
                    $toolbar.css('position', 'static');
                }
			});

            $(document).on("click", function (event) {
                if (!$wrapper.is(event.target) && $wrapper.has(event.target).length === 0) {
                    $accessibilityMenu.removeClass("show");
                    $accessibilityBtn.attr("aria-expanded", "false");

                }

            });

            const $menuItems = $accessibilityMenu.find("li");
            $menuItems.on("keydown", function (event) {
                const index = $menuItems.index(this);
                switch (event.key) {
                    case "ArrowDown":
                        event.preventDefault();
                        $menuItems.eq((index + 1) % $menuItems.length).focus();
                        break;
                    case "ArrowUp":
                        event.preventDefault();
                        $menuItems.eq((index - 1 + $menuItems.length) % $menuItems.length).focus();
                        break;
                    case "Enter":
                    case " ":
                        event.preventDefault();
                        alert("Selected: " + $(this).text());
                        $accessibilityMenu.removeClass("show");
                        $accessibilityBtn.attr("aria-expanded", "false");
                        break;
                    case "Escape":
                        $accessibilityMenu.removeClass("show");
                        $accessibilityBtn.attr("aria-expanded", "false").focus();
                        break;
                }
            });
        }
    });

    if (backdrop) {
        // Hide backdrop and dropdown when clicking on the backdrop
        backdrop.addEventListener("click", () => {
    		backdrop.style.display = "none";
            $toolbar.css('position', 'sticky');
        });
      }

});
