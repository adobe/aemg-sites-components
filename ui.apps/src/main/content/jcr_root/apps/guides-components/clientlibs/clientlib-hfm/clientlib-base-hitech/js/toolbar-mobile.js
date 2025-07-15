$(document).ready(function () {
    // Move the mobile toolbar to the toolbar container
    const $toolbarHeaderContainer = $(".toolbar-header-container");
    const $toolbarHeaderMobile = $(".toolbar.toolbar-header.mobile");
    if ($toolbarHeaderMobile.length && $toolbarHeaderContainer.length) {
        $toolbarHeaderContainer.append($toolbarHeaderMobile);
    }
    // Move the mobile toolbar to the toolbar container
    const $toolbarContainer = $(".toolbar-container");
    const $toolbarTopMobile = $(".toolbar.top.mobile");
    if ($toolbarTopMobile.length && $toolbarContainer.length) {
        $toolbarContainer.append($toolbarTopMobile);
    }

    function checkFooterVisibility($toolbar, staticClass) {
        const footer = $(".footer")[0];
        if (!footer) return;

        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (footerRect.top < windowHeight) {
            $toolbar.addClass(staticClass);
        } else {
            $toolbar.removeClass(staticClass);
        }
    }


    function setupFooterCheck(toolbarSelector, staticClass) {
        const $toolbar = $(toolbarSelector);
        if (!$toolbar.length || !$(".footer").length) return;

        const updateVisibility = () => checkFooterVisibility($toolbar, staticClass);
        $(window).on("scroll resize", updateVisibility);
        updateVisibility(); // Run on page load
    }

    setupFooterCheck(".sticky-middle", "static");
    setupFooterCheck(".bottom", "static-feedback");
});


