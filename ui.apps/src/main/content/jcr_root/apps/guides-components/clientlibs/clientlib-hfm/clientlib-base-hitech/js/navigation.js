document.addEventListener("DOMContentLoaded", function () {

    const $navigation = $(".navigation");
    const $targetContainer = $(".custom-container").has(".topic").find(".col-3grid .outer-container");

    if ($navigation.length && $targetContainer.length) {
        $navigation.detach().prependTo($targetContainer);
    }

    let cmp_navigation_links_selector = "ul.cmp-navigation__group li.cmp-navigation__item";

    let cmpNav = document.querySelector("nav.cmp-navigation");
    if (!cmpNav) return;

    let current_page = window.location;
    let links = Array.from(cmpNav.querySelectorAll("li.cmp-navigation__item a"));
    for (let link of links) {
        let url = new URL(link.href);
        if (current_page.pathname === url.pathname) {
            $(link).css({ "color": "#0065ff" });
            $(link).parentsUntil(".navigation", "ul.cmp-navigation__group").closest("li.cmp-navigation__item").addClass("expanded");
        }
    }

    $('.cmp-navigation__item-arrow-icon').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Toggle the 'expanded' class on the closest li.cmp-navigation__item
        $(this).closest('li.cmp-navigation__item').toggleClass('expanded');
    });

    //listen to keyup rather than keydown to capture the latest value after keystroke
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
                } else {
                    nested.classList.remove("tree");
                }
            }
        });
    });



    $(".navigation .cmp-navigation-filter-container .cmp-navigation-filter__closeicon").on("click", function () {
        let $navigation = $(this).closest(".navigation");

        $navigation.find("input[name='cmp-navigation-filter']").val(""); // Clear input
        $navigation.removeClass("filtered"); // Remove filtered class
        $navigation.find("li.cmp-navigation__item").removeClass("matched"); // Remove matched class from all items
        $navigation.find("li.cmp-navigation__item").removeClass("expanded"); // Remove expanded class from all items
    });
});
