document.addEventListener("DOMContentLoaded", function () {

    const $navigation = $(".navigation");
    const $targetContainer = $(".custom-container").has(".topic").find(".col-3grid .outer-container");

    if ($navigation.length && $targetContainer.length) {
        $navigation.detach().prependTo($targetContainer);
    }

    let cmpNav = document.querySelector("nav.cmp-navigation");
    if (!cmpNav) return;

    // Handle arrow icon clicks
    cmpNav.addEventListener("click", function (event) {
        const arrowIcon = event.target.closest(".cmp-navigation__item-arrow-icon");
        if (arrowIcon) {
            event.preventDefault();
            event.stopPropagation();
            const navItem = arrowIcon.closest("li.cmp-navigation__item");
            if (navItem) {
                navItem.classList.toggle("expanded");
            }
        }
    });

    // Handle navigation item clicks
    cmpNav.addEventListener("click", function (event) {
        const navItem = event.target.closest("li.cmp-navigation__item");
        if (navItem && !event.target.closest(".cmp-navigation__item-arrow-icon")) {
            const hasChildren = navItem.querySelector("ul");
            if (hasChildren) {
                navItem.classList.toggle("expanded");
            }
        }
    });

    // Highlight current page in navigation
    let current_page = window.location;
    let links = Array.from(cmpNav.querySelectorAll("li.cmp-navigation__item a"));
    for (let link of links) {
        let url = new URL(link.href);
        if (current_page.pathname === url.pathname) {
            $(link).css({ "color": "#0065ff" });
            $(link).parentsUntil(".navigation", "ul.cmp-navigation__group").closest("li.cmp-navigation__item").addClass("expanded");
        }
    }

    // Handle navigation filtering
    $(".navigation input[name='cmp-navigation-filter']").on("keyup", function (event) {
        let $input = $(this);
        let filter = $input.val();
        let $navigation = $input.closest(".navigation");

        // Handle Backspace
        if (event.key === "Backspace" && filter.length < 2) {
            $navigation.removeClass("filtered");
        }

        // Handle Escape
        if (event.key === "Escape") {
            $input.val(""); // Clear input
            $navigation.removeClass("filtered");
            $navigation.find("li.cmp-navigation__item").removeClass("matched");
            return; // Stop further execution
        }

        // Toggle filtered class based on input length
        $navigation.toggleClass("filtered", filter.length >= 2);
        if(!filter || filter.length <= 2) { 
            $navigation.find("li.cmp-navigation__item").removeClass("expanded"); // Remove expanded class from all items
            return;
        }

        // Filter navigation links
        $navigation.find("ul.cmp-navigation__group > li.cmp-navigation__item > a, ul.cmp-navigation__group > li.cmp-navigation__item > span").each(function (index, item) {
            let text = $(item).text().trim().toLowerCase();
            $(item).closest("li").toggleClass("matched", filter && text && text.toLowerCase().includes(filter.toLowerCase()));
            $(item).parentsUntil(".navigation", "ul.cmp-navigation__group").closest("li.cmp-navigation__item").addClass("expanded");
            if(filter && text && text.toLowerCase().includes(filter.toLowerCase())) {
                let nested = item.closest("li").querySelector("ul");
                if(nested) {
                    nested.classList.add("tree");
                }
            } 
        }); 
    });

    // Handle filter clear button
    $(".navigation .cmp-navigation-filter-container .cmp-navigation-filter__closeicon").on("click", function () {
        let $navigation = $(this).closest(".navigation");
        $navigation.find("input[name='cmp-navigation-filter']").val(""); // Clear input
        $navigation.removeClass("filtered"); // Remove filtered class
        $navigation.find("li.cmp-navigation__item").removeClass("matched"); // Remove matched class from all items
        $navigation.find("li.cmp-navigation__item").removeClass("expanded"); // Remove expanded class from all items
    });
});
